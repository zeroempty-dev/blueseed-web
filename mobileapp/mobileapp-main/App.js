/**
 * Root Application Component
 * This is the entry point for the React Native Mobile Application.
 * It configures navigation, theming, state management providers, and the safe area context.
 */

import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OrderDraftProvider } from './src/context/OrderDraftContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import RootNavigator from './src/navigation/RootNavigator';

/**
 * AppContent wraps the main navigation container.
 * It dynamically adjusts navigation themes based on the selected mode (Light/Dark).
 */
function AppContent() {
  const { colors, isDark } = useTheme();
  const base = isDark ? DarkTheme : DefaultTheme;

  // Custom navigation theme object to match custom UI colors
  const navTheme = {
    ...base,
    dark: isDark,
    colors: {
      ...base.colors,
      primary: colors.accent,
      background: colors.bg,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * App Component
 * Wraps the app content with necessary Context Providers (Theme, Orders Draft, Safe Area).
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <OrderDraftProvider>
            <AppContent />
          </OrderDraftProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
