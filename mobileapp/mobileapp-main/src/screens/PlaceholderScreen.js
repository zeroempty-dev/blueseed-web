import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSharedStyles } from '../hooks/useSharedStyles';

export default function PlaceholderScreen({ route }) {
  const shared = useSharedStyles();
  const insets = useSafeAreaInsets();

  return (
    <View style={[shared.screen, { paddingTop: insets.top + 16 }]}>
      <Text style={shared.sectionTitle}>{route.name}</Text>
      <Text style={shared.label}>Coming soon</Text>
    </View>
  );
}
