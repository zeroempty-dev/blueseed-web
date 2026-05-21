import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../i18n/translations';

const STORAGE_KEY = '@zeroempty/language';
const VALID_LANGS = ['en', 'hi', 'kn', 'ta'];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (VALID_LANGS.includes(stored)) setLangState(stored);
    });
  }, []);

  const setLang = useCallback(async (next) => {
    setLangState(next);
    await AsyncStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key) => translations[lang]?.[key] ?? translations.en[key] ?? key,
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
