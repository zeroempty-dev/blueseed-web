import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);

  return (
    <ScrollView
      style={[styles.screen, { paddingTop: insets.top + 24 }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>ZeroEmpty</Text>
      <Text style={styles.welcome}>{t('homeWelcome')}</Text>
      <Text style={styles.tagline}>{t('homeTagline')}</Text>
      <View style={styles.divider} />
      <Text style={styles.body}>{t('homeBody')}</Text>
      <View style={styles.featureRow}>
        <FeatureCard
          styles={styles}
          title={t('homeCreateOrders')}
          subtitle={t('homeCreateOrdersSub')}
          onPress={() => navigation.navigate('OrdersTab', { screen: 'OrderRoute' })}
        />
        <FeatureCard
          styles={styles}
          title={t('homeTrackRealtime')}
          subtitle={t('homeTrackRealtimeSub')}
          onPress={() => navigation.navigate('Track')}
        />
      </View>
    </ScrollView>
  );
}

function FeatureCard({ styles, title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: colors.bg },
    content: {
      paddingHorizontal: 28,
      paddingBottom: 48,
    },
    eyebrow: {
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: colors.accent,
      marginBottom: 20,
    },
    welcome: {
      fontSize: 34,
      fontWeight: '700',
      color: colors.text,
      lineHeight: 42,
      letterSpacing: -0.5,
      marginBottom: 16,
    },
    tagline: {
      fontSize: 20,
      fontWeight: '400',
      color: colors.textMuted,
      lineHeight: 30,
      marginBottom: 32,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 28,
    },
    body: {
      fontSize: 16,
      lineHeight: 26,
      color: colors.textMuted,
      marginBottom: 32,
    },
    featureRow: { gap: 14 },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    cardSubtitle: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textMuted,
    },
  });
}
