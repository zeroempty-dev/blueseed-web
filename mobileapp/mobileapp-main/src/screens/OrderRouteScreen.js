import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatToDDMMYYYY } from '../utils/formatDate';
import { useOrderDraft } from '../context/OrderDraftContext';
import Stepper from '../components/Stepper';
import ScreenHeader from '../components/ScreenHeader';
import { useSharedStyles } from '../hooks/useSharedStyles';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function OrderRouteScreen({ navigation }) {
  const shared = useSharedStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { draft, updateDraft } = useOrderDraft();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onNext = () => {
    if (!draft.pickupLocation || !draft.dropLocation || !draft.pickupDate) {
      Alert.alert(t('missingFieldsTitle'), t('enterPickupAndDrop'));
      return;
    }
    navigation.navigate('CargoDetails');
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateDraft({ pickupDate: selectedDate.toISOString().split('T')[0] });
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={shared.screen}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <ScreenHeader title={t('orderCreation')} onBack={() => navigation.goBack()} />
        <Stepper current={0} navigation={navigation} />
        <Text style={shared.sectionTitle}>{t('routePickup')}</Text>

        <View style={shared.field}>
          <Text style={shared.label}>{t('pickupLocation')}</Text>
          <TextInput
            style={shared.input}
            value={draft.pickupLocation}
            onChangeText={(v) => updateDraft({ pickupLocation: v })}
            placeholder="Delhi"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={shared.field}>
          <Text style={shared.label}>{t('dropLocation')}</Text>
          <TextInput
            style={shared.input}
            value={draft.dropLocation}
            onChangeText={(v) => updateDraft({ dropLocation: v })}
            placeholder="Pune"
            placeholderTextColor={colors.textMuted}
          />
        </View>
        <View style={shared.field}>
          <Text style={shared.label}>{t('pickupDate')}</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <TextInput
                style={shared.input}
                value={formatToDDMMYYYY(draft.pickupDate)}
                placeholder={t('selectDate')}
                placeholderTextColor={colors.textMuted}
                editable={false}
              />
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={draft.pickupDate ? new Date(draft.pickupDate) : new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
        <View style={shared.field}>
          <Text style={shared.label}>{t('transportType')}</Text>
          <TextInput
            style={shared.input}
            value={draft.transportType}
            onChangeText={(v) => updateDraft({ transportType: v })}
            placeholder={t('fullTruckLoad')}
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <TouchableOpacity style={shared.primaryBtn} onPress={onNext}>
          <Text style={shared.primaryBtnText}>{t('continueToCargo')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
