import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resolvePalette } from '../theme/palettes';

const STORAGE_KEY = '@zeroempty/theme_mode';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemScheme = useColorScheme();
  const [mode, setModeState] = useState('system');
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setModeState(stored);
      }
    });
  }, []);

  const setMode = useCallback(async (next) => {
    setModeState(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const resolvedScheme = mode === 'system' ? systemScheme || 'dark' : mode;
  const colors = useMemo(
    () => resolvePalette(mode, systemScheme),
    [mode, systemScheme]
  );

  const value = useMemo(
    () => ({
      mode,
      setMode,
      colors,
      isDark: resolvedScheme === 'dark',
    }),
    [mode, setMode, colors, resolvedScheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
