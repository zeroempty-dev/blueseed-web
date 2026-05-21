import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useOrderDraft } from '../context/OrderDraftContext';
import Stepper from '../components/Stepper';
import ScreenHeader from '../components/ScreenHeader';
import { useSharedStyles } from '../hooks/useSharedStyles';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function RouteSummaryScreen({ navigation }) {
  const shared = useSharedStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { draft } = useOrderDraft();

  return (
    <ScrollView style={shared.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title={t('orderCreation')} onBack={() => navigation.goBack()} />
      <Stepper current={3} navigation={navigation} />

      <View style={styles.mapPlaceholder}>
        <View style={styles.mapMarkers}>
          <View style={[styles.marker, { backgroundColor: colors.accent }]} />
          <Text style={styles.mapText}>{t('mapView')}</Text>
          <View style={[styles.marker, { backgroundColor: '#4ade80' }]} />
        </View>
      </View>

      <View style={shared.grid2}>
        <View style={[styles.statBox, { borderColor: colors.accent }]}>
          <Text style={[styles.statValue, { color: colors.accent }]}>342 km</Text>
          <Text style={styles.statLabel}>{t('distanceLabel')}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>6h 20m</Text>
          <Text style={styles.statLabel}>{t('estTimeLabel')}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>{t('stopsLabel')}</Text>
        </View>
      </View>

      <View style={styles.routeSummary}>
        <Text style={styles.summaryTitle}>{t('routeSummaryTitle')}</Text>
        <View style={styles.routeItem}>
          <View style={[styles.dot, { backgroundColor: colors.accent }]} />
          <Text style={styles.routeText}>{draft.pickupLocation || t('pickupLocationDefault')}</Text>
        </View>
        <View style={styles.routeItem}>
          <View style={[styles.dot, { backgroundColor: colors.textMuted }]} />
          <Text style={styles.routeText}>{draft.dropLocation || t('dropLocationDefault')}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={shared.primaryBtn}
        onPress={() => navigation.navigate('Price')}
      >
        <Text style={shared.primaryBtnText}>{t('confirmRoute')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mapPlaceholder: {
    height: 180,
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2c2c2e',
  },
  mapMarkers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  marker: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  mapText: {
    color: '#666',
    fontWeight: '600',
  },
  statBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
  },
  routeSummary: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    color: '#888',
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeText: {
    color: '#fff',
    fontSize: 14,
  },
});
