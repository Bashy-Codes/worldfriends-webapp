// Theme interface definitions
export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    borderLight: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    white: string;
    black: string;
    overlay: string;
    tabBar: string;
    tabBarActive: string;
    notification: string;
    shadow: string;
    surfaceSecondary: string;
    textTertiary: string;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
}

export const lightTheme: Theme = {
  isDark: false,
  colors: {
    primary: "#6366F1",
    primaryLight: "#818CF8",
    primaryDark: "#4F46E5",
    secondary: "#EC4899",
    background: "#F8FAFC",
    surface: "#FFFFFF",
    card: "#F1F5F9",
    text: "#1E293B",
    textSecondary: "#475569",
    textMuted: "#64748B",
    border: "#CBD5E1",
    borderLight: "#E2E8F0",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
    white: "#FFFFFF",
    black: "#000000",
    overlay: "rgba(0, 0, 0, 0.5)",
    tabBar: "#FFFFFF",
    tabBarActive: "#6366F1",
    notification: "#EF4444",
    shadow: "#000000",
    surfaceSecondary: "#F1F5F9",
    textTertiary: "#94A3B8",
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
};

export const darkTheme: Theme = {
  isDark: true,
  colors: {
    primary: "#818CF8",
    primaryLight: "#A5B4FC",
    primaryDark: "#6366F1",
    secondary: "#F472B6",
    background: "#0F172A",
    surface: "#1E293B",
    card: "#334155",
    text: "#F1F5F9",
    textSecondary: "#CBD5E1",
    textMuted: "#94A3B8",
    border: "#475569",
    borderLight: "#334155",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    info: "#60A5FA",
    white: "#FFFFFF",
    black: "#000000",
    overlay: "rgba(0, 0, 0, 0.7)",
    tabBar: "#1E293B",
    tabBarActive: "#818CF8",
    notification: "#F87171",
    shadow: "#000000",
    surfaceSecondary: "#334155",
    textTertiary: "#64748B",
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
};
