import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatToDDMMYYYY } from '../utils/formatDate';
import { useOrderDraft } from '../context/OrderDraftContext';
import Stepper from '../components/Stepper';
import ScreenHeader from '../components/ScreenHeader';
import { useSharedStyles } from '../hooks/useSharedStyles';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function DeliveryTimingScreen({ navigation }) {
  const shared = useSharedStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { draft, updateDraft } = useOrderDraft();
  const [showPicker, setShowPicker] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      updateDraft({ deliveryDeadline: selectedDate.toISOString() });
    }
  };

  return (
    <ScrollView style={shared.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      <ScreenHeader title={t('orderCreation')} onBack={() => navigation.goBack()} />
      <Stepper current={2} navigation={navigation} />
      <Text style={shared.sectionTitle}>{t('deliveryTiming')}</Text>

      <TouchableOpacity
        style={[shared.timingCard, draft.deliveryType === 'timed' && shared.timingCardSelected]}
        onPress={() => updateDraft({ deliveryType: 'timed' })}
      >
        <Text style={shared.timingTitle}>{t('timedDelivery')}</Text>
        <Text style={shared.label}>{t('timedDeliveryDesc')}</Text>
        {draft.deliveryType === 'timed' && (
          <View style={{ marginTop: 12 }}>
            <Text style={shared.label}>{t('deliveryDeadline')}</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <View pointerEvents="none">
                <TextInput
                  style={shared.input}
                  value={formatToDDMMYYYY(draft.deliveryDeadline)}
                  placeholder={t('selectDeadline')}
                  placeholderTextColor={colors.textMuted}
                  editable={false}
                />
              </View>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={draft.deliveryDeadline ? new Date(draft.deliveryDeadline) : new Date()}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[shared.timingCard, draft.deliveryType === 'non_timed' && shared.timingCardSelected]}
        onPress={() => updateDraft({ deliveryType: 'non_timed', deliveryDeadline: '' })}
      >
        <Text style={shared.timingTitle}>{t('nonTimedDelivery')}</Text>
        <Text style={shared.label}>{t('nonTimedDeliveryDesc')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={shared.primaryBtn}
        onPress={() => {
          if (draft.deliveryType === 'timed' && !draft.deliveryDeadline) {
            Alert.alert(t('missingFieldTitle'), t('selectDeadlineAlert'));
            return;
          }
          navigation.navigate('RouteSummary');
        }}
      >
        <Text style={shared.primaryBtnText}>{t('reviewSubmit')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
