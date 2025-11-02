import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { Flashcard } from "@/types/study";

const STORAGE_KEY = "flashcards";

export const useFlashcards = () => {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFlashcards();
    }, []);

    const loadFlashcards = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setFlashcards(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Error loading flashcards:", error);
        } finally {
            setLoading(false);
        }
    };

    const saveFlashcards = async (cards: Flashcard[]) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
            setFlashcards(cards);
        } catch (error) {
            console.error("Error saving flashcards:", error);
        }
    };

    const addFlashcard = async (word: string, meaning: string) => {
        const newCard: Flashcard = {
            id: Date.now().toString(),
            word: word.trim(),
            meaning: meaning.trim(),
        };
        const updated = [...flashcards, newCard];
        await saveFlashcards(updated);
    };

    const deleteFlashcard = async (id: string) => {
        const updated = flashcards.filter(card => card.id !== id);
        await saveFlashcards(updated);
    };

    return {
        flashcards,
        loading,
        addFlashcard,
        deleteFlashcard,
    };
};