import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";

export const useLetter = (letterId: Id<"letters">) => {
  const { t } = useTranslation();


  // Fetch letter data
  const letter = useQuery(api.letters.queries.getLetter, { letterId });

  // Loading state
  const isLoading = letter === undefined;

  // Error state (letter is null when query completes but letter not found)
  const hasError = letter === null;

  return {
    // Data
    letter,

    // States
    isLoading,
    hasError,
  };
};