import { View, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedStyles } from '../hooks/useSharedStyles';

/** Back row sits ~5% below the safe-area top (iPhone 16 friendly). */
export default function ScreenHeader({ title, onBack }) {
  const shared = useSharedStyles();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const topOffset = insets.top + height * 0.05;

  return (
    <View style={[shared.headerRow, { paddingTop: topOffset, marginBottom: 8 }]}>
      <TouchableOpacity
        onPress={onBack}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={shared.backBtn}>←</Text>
      </TouchableOpacity>
      <Text style={shared.headerTitle}>{title}</Text>
    </View>
  );
}
