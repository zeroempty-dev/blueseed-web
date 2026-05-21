import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const STATUS_KEYS = {
  in_transit: 'transit',
  delivered: 'success',
  completed: 'success',
  pending: 'muted',
};

export default function StatusBadge({ status }) {
  const { colors, isDark } = useTheme();
  const key = STATUS_KEYS[status] || 'muted';

  const palette = {
    transit: {
      label: 'In Transit',
      bg: isDark ? 'rgba(255,107,0,0.2)' : 'rgba(37,99,235,0.15)',
      fg: colors.accent,
    },
    success: {
      label: status === 'delivered' ? 'Delivered' : 'Completed',
      bg: 'rgba(34,197,94,0.2)',
      fg: colors.success,
    },
    muted: {
      label: status || 'Pending',
      bg: colors.surfaceElevated,
      fg: colors.textMuted,
    },
  };

  const info = palette[key] || palette.muted;

  return (
    <Text style={[styles.badge, { backgroundColor: info.bg, color: info.fg }]}>
      {info.label}
    </Text>
  );
}

const styles = StyleSheet.create({
  badge: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
});
