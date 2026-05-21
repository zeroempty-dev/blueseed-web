import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useOrderDraft } from '../context/OrderDraftContext';
import Stepper from '../components/Stepper';
import ScreenHeader from '../components/ScreenHeader';
import { useSharedStyles } from '../hooks/useSharedStyles';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const TYPE_KEYS = [
  { key: 'bulk', labelKey: 'typeBulk' },
  { key: 'perishable', labelKey: 'typePerishable' },
  { key: 'fragile', labelKey: 'typeFragile' },
  { key: 'electronics', labelKey: 'typeElectronics' },
];

const FT_TO_CM = 30.48;

function convertDim(value, fromUnit, toUnit) {
  const n = parseFloat(value);
  if (!value || isNaN(n)) return '';
  if (fromUnit === toUnit) return value;
  const cm = fromUnit === 'ft' ? n * FT_TO_CM : n;
  const result = toUnit === 'ft' ? cm / FT_TO_CM : cm;
  return toUnit === 'ft' ? result.toFixed(2) : result.toFixed(1);
}

export default function CargoDetailsScreen({ navigation }) {
  const shared = useSharedStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { draft, updateCommodity } = useOrderDraft();
  const { commodity } = draft;

  const [unit, setUnit] = useState('ft');
  const [dims, setDims] = useState({ length: '', width: '', height: '' });

  const switchUnit = (newUnit) => {
    if (newUnit === unit) return;
    setDims({
      length: convertDim(dims.length, unit, newUnit),
      width: convertDim(dims.width, unit, newUnit),
      height: convertDim(dims.height, unit, newUnit),
    });
    setUnit(newUnit);
  };

  const handleDimChange = (field, val) => {
    setDims((prev) => ({ ...prev, [field]: val }));
    const n = parseFloat(val);
    const cm = !val || isNaN(n) ? '' : String(unit === 'ft' ? (n * FT_TO_CM).toFixed(2) : n);
    const contextKey = { length: 'lengthCm', width: 'widthCm', height: 'heightCm' }[field];
    updateCommodity({ [contextKey]: cm });
  };

  const styles = createStyles(colors);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={shared.screen}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title={t('orderCreation')} onBack={() => navigation.goBack()} />
        <Stepper current={1} navigation={navigation} />
        <Text style={shared.sectionTitle}>{t('cargoDetails')}</Text>

        <View style={shared.field}>
          <Text style={shared.label}>{t('commodityName')}</Text>
          <TextInput
            style={shared.input}
            value={commodity.name}
            onChangeText={(v) => updateCommodity({ name: v })}
            placeholder={t('commodityNamePlaceholder')}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <Text style={shared.label}>{t('commodityType')}</Text>
        <View style={[shared.chipRow, { marginBottom: 16 }]}>
          {TYPE_KEYS.map(({ key, labelKey }) => (
            <TouchableOpacity
              key={key}
              style={[shared.chip, commodity.type === key && shared.chipSelected]}
              onPress={() => updateCommodity({ type: key })}
            >
              <Text style={[shared.chipText, commodity.type === key && shared.chipTextSelected]}>
                {t(labelKey)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dimHeader}>
          <Text style={shared.label}>{t('dimensionsWeight')}</Text>
          <View style={styles.unitToggle}>
            {['ft', 'cm'].map((u) => (
              <TouchableOpacity
                key={u}
                style={[styles.unitBtn, unit === u && styles.unitBtnActive]}
                onPress={() => switchUnit(u)}
              >
                <Text style={[styles.unitBtnText, unit === u && styles.unitBtnTextActive]}>
                  {u}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={shared.grid2}>
          <View style={shared.gridItem}>
            <Text style={shared.label}>{t('weightLabel')}</Text>
            <TextInput
              style={shared.input}
              keyboardType="numeric"
              value={String(commodity.weightTons || '')}
              onChangeText={(v) => updateCommodity({ weightTons: v })}
              placeholder="24"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={shared.gridItem}>
            <Text style={shared.label}>{`${t('lengthLabel')} (${unit})`}</Text>
            <TextInput
              style={shared.input}
              keyboardType="numeric"
              value={dims.length}
              onChangeText={(v) => handleDimChange('length', v)}
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={shared.gridItem}>
            <Text style={shared.label}>{`${t('widthLabel')} (${unit})`}</Text>
            <TextInput
              style={shared.input}
              keyboardType="numeric"
              value={dims.width}
              onChangeText={(v) => handleDimChange('width', v)}
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <View style={shared.gridItem}>
            <Text style={shared.label}>{`${t('heightLabel')} (${unit})`}</Text>
            <TextInput
              style={shared.input}
              keyboardType="numeric"
              value={dims.height}
              onChangeText={(v) => handleDimChange('height', v)}
              placeholderTextColor={colors.textMuted}
            />
          </View>
        </View>

        <TouchableOpacity
          style={shared.primaryBtn}
          onPress={() => {
            if (!commodity.name || !commodity.weightTons) {
              Alert.alert(t('missingFieldsTitle'), t('enterNameAndWeight'));
              return;
            }
            navigation.navigate('DeliveryTiming');
          }}
        >
          <Text style={shared.primaryBtnText}>{t('continueToTiming')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    dimHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    unitToggle: {
      flexDirection: 'row',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    unitBtn: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      backgroundColor: colors.surface,
    },
    unitBtnActive: {
      backgroundColor: colors.accent,
    },
    unitBtnText: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.textMuted,
    },
    unitBtnTextActive: {
      color: colors.accentOn,
    },
  });
}
