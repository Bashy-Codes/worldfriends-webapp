import React, { useState, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/Theme";

interface Flashcard {
  id: string;
  word: string;
  meaning: string;
}

interface QuizModalProps {
  visible: boolean;
  flashcards: Flashcard[];
  onClose: () => void;
}

interface QuizQuestion {
  word: string;
  correctAnswer: string;
  options: string[];
}

export const QuizModal: React.FC<QuizModalProps> = ({ visible, flashcards, onClose }) => {
  const theme = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  const questions = useMemo<QuizQuestion[]>(() => {
    if (flashcards.length < 2) return [];

    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    const quizQuestions = shuffled.slice(0, Math.min(10, flashcards.length));

    return quizQuestions.map((card) => {
      const wrongOptions = flashcards
        .filter((c) => c.id !== card.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((c) => c.meaning);

      const options = [...wrongOptions, card.meaning].sort(() => Math.random() - 0.5);

      return {
        word: card.word,
        correctAnswer: card.meaning,
        options,
      };
    });
  }, [flashcards]);

  const handleAnswer = useCallback((answer: string) => {
    if (selectedAnswer) return;

    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestion].correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    setAnsweredQuestions([...answeredQuestions, isCorrect]);
  }, [selectedAnswer, questions, currentQuestion, score, answeredQuestions]);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  }, [currentQuestion, questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnsweredQuestions([]);
  }, []);

  const handleClose = useCallback(() => {
    handleRestart();
    onClose();
  }, [handleRestart, onClose]);

  const getOptionColor = (option: string) => {
    if (!selectedAnswer) return theme.colors.surface;
    if (option === questions[currentQuestion].correctAnswer) return "#4CAF50";
    if (option === selectedAnswer) return "#F44336";
    return theme.colors.surface;
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.7)",
    },
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 16,
    },
    card: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.xl,
      padding: 24,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.colors.text,
    },
    closeButton: {
      padding: 8,
    },
    questionContainer: {
      marginBottom: 32,
    },
    questionNumber: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    question: {
      fontSize: 28,
      fontWeight: "700",
      color: theme.colors.text,
      textAlign: "center",
    },
    optionsContainer: {
      gap: 16,
      marginBottom: 24,
    },
    option: {
      padding: 16,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 2,
      borderColor: "transparent",
      marginVertical: 3,
    },
    optionText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.colors.text,
      textAlign: "center",
    },
    nextButton: {
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    nextButtonDisabled: {
      opacity: 0.5,
    },
    nextButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.white,
    },
    resultContainer: {
      alignItems: "center",
    },
    resultIcon: {
      marginBottom: 20,
    },
    resultScore: {
      fontSize: 48,
      fontWeight: "700",
      color: theme.colors.primary,
      marginBottom: 8,
    },
    resultText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      marginBottom: 32,
    },
    resultButtons: {
      flexDirection: "row",
      gap: 12,
      width: "100%",
    },
    resultButton: {
      flex: 1,
      padding: 16,
      borderRadius: theme.borderRadius.lg,
      alignItems: "center",
    },
    resultButtonPrimary: {
      backgroundColor: theme.colors.primary,
    },
    resultButtonSecondary: {
      backgroundColor: theme.colors.surface,
    },
    resultButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
  });

  if (questions.length === 0) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>Quiz</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </View>
              <View style={styles.resultContainer}>
                <Ionicons name="alert-circle" size={64} color={theme.colors.textSecondary} />
                <Text style={[styles.resultText, { marginTop: 20 }]}>
                  Add at least 2 flashcards to start a quiz
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>Quiz</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {!showResult ? (
              <>
                <View style={styles.questionContainer}>
                  <Text style={styles.questionNumber}>
                    Question {currentQuestion + 1} of {questions.length}
                  </Text>
                  <Text style={styles.question}>{questions[currentQuestion].word}</Text>
                </View>

                <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
                  {questions[currentQuestion].options.map((option, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.option,
                        { backgroundColor: getOptionColor(option) },
                      ]}
                      onPress={() => handleAnswer(option)}
                      disabled={!!selectedAnswer}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={[styles.nextButton, !selectedAnswer && styles.nextButtonDisabled]}
                  onPress={handleNext}
                  disabled={!selectedAnswer}
                  activeOpacity={0.8}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.resultContainer}>
                <View style={styles.resultIcon}>
                  {score / questions.length >= 0.7 ? (
                    <Ionicons name="trophy" size={80} color="#FFD700" />
                  ) : (
                    <Ionicons name="ribbon" size={80} color={theme.colors.primary} />
                  )}
                </View>
                <Text style={styles.resultScore}>
                  {score}/{questions.length}
                </Text>
                <Text style={styles.resultText}>
                  {score / questions.length >= 0.7
                    ? "Excellent work! 🎉"
                    : score / questions.length >= 0.5
                      ? "Good job! Keep practicing 💪"
                      : "Keep studying! You'll do better next time 📚"}
                </Text>
                <View style={styles.resultButtons}>
                  <TouchableOpacity
                    style={[styles.resultButton, styles.resultButtonSecondary]}
                    onPress={handleClose}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.resultButtonText, { color: theme.colors.text }]}>
                      Close
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.resultButton, styles.resultButtonPrimary]}
                    onPress={handleRestart}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.resultButtonText, { color: theme.colors.white }]}>
                      Retry
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};