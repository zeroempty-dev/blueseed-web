import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export function createSharedStyles(colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 20,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 4,
    },
    headerTitle: { fontSize: 16, color: colors.textMuted, fontWeight: '600' },
    backBtn: { fontSize: 22, color: colors.text },
    brand: { fontSize: 24, fontWeight: '700', color: colors.accent, marginTop: 8 },
    greeting: { fontSize: 18, color: colors.text, marginBottom: 16 },
    sectionTitle: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: 16 },
    sectionLabel: {
      fontSize: 11,
      letterSpacing: 1,
      color: colors.textMuted,
      fontWeight: '600',
      marginTop: 20,
      marginBottom: 10,
    },
    field: { marginBottom: 14 },
    label: { fontSize: 13, color: colors.textMuted, marginBottom: 6 },
    input: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 14,
      color: colors.text,
      fontSize: 16,
    },
    primaryBtn: {
      backgroundColor: colors.accent,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    primaryBtnText: { color: colors.accentOn, fontSize: 16, fontWeight: '700' },
    ctaBtn: {
      backgroundColor: colors.accent,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
      marginVertical: 12,
    },
    ctaText: { color: colors.accentOn, fontSize: 16, fontWeight: '700' },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    chipSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accentDim,
    },
    chipText: { color: colors.textMuted, fontSize: 14 },
    chipTextSelected: { color: colors.accent, fontWeight: '600' },
    grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    gridItem: { width: '48%' },
    timingCard: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 14,
      marginBottom: 10,
      backgroundColor: colors.surface,
    },
    timingCardSelected: {
      borderColor: colors.accent,
      backgroundColor: colors.accentDim,
    },
    timingTitle: { color: colors.text, fontWeight: '700', fontSize: 16 },
    error: { color: '#ef4444', marginTop: 8 },
  });
}

export function useSharedStyles() {
  const { colors } = useTheme();
  return useMemo(() => createSharedStyles(colors), [colors]);
}
