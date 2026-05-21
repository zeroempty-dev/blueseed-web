import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ICONS = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  OrdersTab: { focused: 'clipboard', unfocused: 'clipboard-outline' },
  Track: { focused: 'navigate', unfocused: 'navigate-outline' },
  Wallet: { focused: 'wallet', unfocused: 'wallet-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

export default function TabBarIcon({ routeName, focused, size = 24 }) {
  const { colors } = useTheme();
  const pair = ICONS[routeName] || ICONS.Home;
  const name = focused ? pair.focused : pair.unfocused;

  return (
    <Ionicons
      name={name}
      size={size}
      color={focused ? colors.accent : colors.textMuted}
    />
  );
}
