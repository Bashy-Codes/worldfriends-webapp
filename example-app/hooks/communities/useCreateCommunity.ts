import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Toast from "react-native-toast-message";
import { uploadImageToConvex } from "@/utils/uploadImages";
import { useTranslation } from "react-i18next";

interface UseCreateCommunityReturn {
  title: string;
  description: string;
  rules: string[];
  genderOption: "all" | "my_gender";
  language: string;
  bannerUri: string | null;

  isCreating: boolean;
  agreementAccepted: boolean;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addRule: (rule: string) => void;
  removeRule: (index: number) => void;
  setGenderOption: (option: "all" | "my_gender") => void;
  setLanguage: (language: string) => void;
  setBannerUri: (uri: string | null) => void;
  setAgreementAccepted: (accepted: boolean) => void;

  createCommunity: () => Promise<boolean>;
  canCreate: boolean;
}

export const useCreateCommunity = (): UseCreateCommunityReturn => {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState<string[]>([]);
  const [genderOption, setGenderOption] = useState<"all" | "my_gender">("all");
  const [language, setLanguage] = useState("");
  const [bannerUri, setBannerUri] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  const createCommunityMutation = useMutation(api.communities.mutations.createCommunity);
  const generateUploadUrl = useMutation(api.storage.generateConvexUploadUrl);

  const addRule = useCallback((rule: string) => {
    if (rule.trim() && !rules.includes(rule.trim())) {
      setRules(prev => [...prev, rule.trim()]);
    }
  }, [rules]);

  const removeRule = useCallback((index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  }, []);

  const createCommunity = useCallback(async (): Promise<boolean> => {
    if (!title.trim() || !description.trim() || !language || !agreementAccepted) {
      return false;
    }

    setIsCreating(true);
    try {
      let bannerId: Id<"_storage"> | undefined = undefined;

      if (bannerUri) {
        const uploadResult = await uploadImageToConvex(bannerUri, generateUploadUrl);
        if (uploadResult?.storageId) {
          bannerId = uploadResult.storageId as Id<"_storage">;
        }
      }

      await createCommunityMutation({
        title: title.trim(),
        description: description.trim(),
        rules,
        genderOption,
        language,
        banner: bannerId,
      });

      Toast.show({
        type: "success",
        text1: t("successToasts.communityCreated")
      });

      return true;
    } catch (error) {
      console.error("Failed to create community:", error);
      Toast.show({
        type: "error",
        text1: t("errorToasts.genericError")
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [title, description, rules, genderOption, language, bannerUri, agreementAccepted, createCommunityMutation, generateUploadUrl]);

  const canCreate = title.trim().length > 0 &&
    description.trim().length > 0 &&
    language.length > 0 &&
    agreementAccepted;

  return {
    title,
    description,
    rules,
    genderOption,
    language,
    bannerUri,
    isCreating,
    agreementAccepted,
    setTitle,
    setDescription,
    addRule,
    removeRule,
    setGenderOption,
    setLanguage,
    setBannerUri,
    setAgreementAccepted,
    createCommunity,
    canCreate,
  };
};