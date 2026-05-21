import { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, StyleSheet } from 'react-native';
import { useOrderDraft } from '../context/OrderDraftContext';
import { createOrder } from '../api';
import Stepper from '../components/Stepper';
import ScreenHeader from '../components/ScreenHeader';
import { useSharedStyles } from '../hooks/useSharedStyles';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function PriceScreen({ navigation }) {
  const shared = useSharedStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { draft, resetDraft } = useOrderDraft();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [offerPrice, setOfferPrice] = useState('4500');

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await createOrder({
        pickupLocation: draft.pickupLocation,
        dropLocation: draft.dropLocation,
        pickupDate: draft.pickupDate,
        transportType: draft.transportType,
        deliveryType: draft.deliveryType,
        deliveryDeadline:
          draft.deliveryType === 'timed' && draft.deliveryDeadline
            ? new Date(draft.deliveryDeadline).toISOString()
            : null,
        commodity: {
          name: draft.commodity.name,
          type: draft.commodity.type,
          weightTons: parseFloat(draft.commodity.weightTons) || 0,
          lengthCm: draft.commodity.lengthCm ? parseFloat(draft.commodity.lengthCm) : null,
          widthCm: draft.commodity.widthCm ? parseFloat(draft.commodity.widthCm) : null,
          heightCm: draft.commodity.heightCm ? parseFloat(draft.commodity.heightCm) : null,
        },
        offerPrice: parseFloat(offerPrice),
      });
      resetDraft();
      navigation.navigate('OrdersHome');
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={shared.screen} contentContainerStyle={{ paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
      <ScreenHeader title={t('orderCreation')} onBack={() => navigation.goBack()} />
      <Stepper current={4} navigation={navigation} />
      <Text style={shared.sectionTitle}>{t('setOfferPrice')}</Text>

      <View style={styles.suggestedBox}>
        <Text style={styles.suggestedLabel}>{t('platformSuggestedPrice')}</Text>
        <Text style={styles.suggestedPrice}>₹ 4,200</Text>
      </View>

      <View style={shared.field}>
        <Text style={shared.label}>{t('yourOfferPrice')}</Text>
        <TextInput
          style={shared.input}
          keyboardType="numeric"
          value={offerPrice}
          onChangeText={setOfferPrice}
          placeholder="4500"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.breakdownBox}>
        <Text style={styles.breakdownTitle}>{t('priceBreakdown')}</Text>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>{t('baseRate')}</Text>
          <Text style={styles.breakdownValue}>₹ 3,800</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>{t('distanceSurcharge')}</Text>
          <Text style={styles.breakdownValue}>₹ 350</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>{t('handlingFee')}</Text>
          <Text style={styles.breakdownValue}>₹ 350</Text>
        </View>
        <View style={[styles.breakdownRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>{t('yourOffer')}</Text>
          <Text style={styles.totalValue}>₹ {offerPrice || '0'}</Text>
        </View>
      </View>

      {error && <Text style={shared.error}>{error}</Text>}

      <TouchableOpacity style={shared.primaryBtn} onPress={submit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color={colors.accentOn} />
        ) : (
          <Text style={shared.primaryBtnText}>{t('publishJob')}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  suggestedBox: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  suggestedLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  suggestedPrice: {
    color: '#ff6b00',
    fontSize: 32,
    fontWeight: '700',
  },
  breakdownBox: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  breakdownTitle: {
    color: '#888',
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  breakdownLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  breakdownValue: {
    color: '#fff',
    fontSize: 14,
  },
  totalRow: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
    marginBottom: 0,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    color: '#ff6b00',
    fontSize: 16,
    fontWeight: '700',
  },
});
