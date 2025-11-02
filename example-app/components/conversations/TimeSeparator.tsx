import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/Theme';

interface TimeSeparatorProps {
  text: string;
}

export const TimeSeparator: React.FC<TimeSeparatorProps> = ({ text }) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginVertical: 12,
    },
    text: {
      fontSize: 12,
      color: theme.colors.textMuted,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      overflow: 'hidden',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};