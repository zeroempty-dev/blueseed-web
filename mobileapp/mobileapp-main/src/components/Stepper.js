import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const STEP_KEYS = ['stepOrder', 'stepCargo', 'stepTiming', 'stepRoute', 'stepPrice'];
const STEP_SCREENS = ['OrderRoute', 'CargoDetails', 'DeliveryTiming', 'RouteSummary', 'Price'];

export default function Stepper({ current = 0, navigation }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors);

  return (
    <View style={styles.row}>
      {STEP_KEYS.map((key, index) => {
        const done = index < current;
        const active = index === current;
        const tappable = done && navigation;

        const dot = (
          <View style={[styles.dot, done && styles.dotDone, active && styles.dotActive]}>
            <Text style={[styles.dotText, (done || active) && styles.dotTextActive]}>
              {done ? '✓' : index + 1}
            </Text>
          </View>
        );

        return (
          <View key={key} style={styles.step}>
            {tappable ? (
              <TouchableOpacity
                onPress={() => navigation.navigate(STEP_SCREENS[index])}
                activeOpacity={0.7}
              >
                {dot}
              </TouchableOpacity>
            ) : (
              dot
            )}
            <Text style={[styles.label, (done || active) && styles.labelActive]}>
              {t(key)}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 16,
    },
    step: { alignItems: 'center', flex: 1 },
    dot: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceElevated,
    },
    dotActive: {
      borderColor: colors.accent,
      backgroundColor: colors.accentDim,
    },
    dotDone: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    dotText: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },
    dotTextActive: { color: colors.accentOn },
    label: { fontSize: 9, color: colors.textMuted, marginTop: 4 },
    labelActive: { color: colors.text },
  });
}
