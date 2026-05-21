import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const THEME_OPTIONS = [
  { id: 'light', labelKey: 'themeLight', subtitleKey: 'themeLightSub', icon: 'sunny-outline' },
  { id: 'dark', labelKey: 'themeDark', subtitleKey: 'themeDarkSub', icon: 'moon-outline' },
  { id: 'system', labelKey: 'themeSystem', subtitleKey: 'themeSystemSub', icon: 'phone-portrait-outline' },
];

const LANG_OPTIONS = [
  { id: 'en', labelKey: 'langEnglish', icon: 'language-outline' },
  { id: 'hi', labelKey: 'langHindi', icon: 'language-outline' },
  { id: 'kn', labelKey: 'langKannada', icon: 'language-outline' },
  { id: 'ta', labelKey: 'langTamil', icon: 'language-outline' },
];

export default function ProfileScreen() {
  const { colors, mode, setMode } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  return (
    <ScrollView
      style={[styles.screen, { paddingTop: insets.top + 16 }]}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>{t('profile')}</Text>

      <Text style={styles.sectionLabel}>{t('appearance')}</Text>
      {THEME_OPTIONS.map((opt) => {
        const selected = mode === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => setMode(opt.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={opt.icon}
              size={22}
              color={selected ? colors.accent : colors.textMuted}
            />
            <View style={styles.optionText}>
              <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                {t(opt.labelKey)}
              </Text>
              <Text style={styles.optionSub}>{t(opt.subtitleKey)}</Text>
            </View>
            {selected && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
          </TouchableOpacity>
        );
      })}

      <Text style={[styles.sectionLabel, { marginTop: 28 }]}>{t('language')}</Text>
      {LANG_OPTIONS.map((opt) => {
        const selected = lang === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => setLang(opt.id)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={opt.icon}
              size={22}
              color={selected ? colors.accent : colors.textMuted}
            />
            <View style={styles.optionText}>
              <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>
                {t(opt.labelKey)}
              </Text>
            </View>
            {selected && <Ionicons name="checkmark-circle" size={22} color={colors.accent} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    content: { paddingHorizontal: 20, paddingBottom: 40 },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 24,
    },
    sectionLabel: {
      fontSize: 12,
      letterSpacing: 1,
      fontWeight: '600',
      color: colors.textMuted,
      marginBottom: 12,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      marginBottom: 10,
    },
    optionSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accentDim,
    },
    optionText: { flex: 1 },
    optionLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
    optionLabelSelected: { color: colors.accent },
    optionSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  });
}
