import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchOrders } from '../api';
import StatusBadge from '../components/StatusBadge';
import { useSharedStyles } from '../hooks/useSharedStyles';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

function formatWeight(kg) {
  if (!kg) return '';
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} T`;
  return `${kg} kg`;
}

export default function OrdersHomeScreen({ navigation }) {
  const shared = useSharedStyles();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const insets = useSafeAreaInsets();
  const styles = createListStyles(colors);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <View style={[shared.screen, { paddingTop: insets.top + 12 }]}>
      <Text style={shared.headerTitle}>{t('orderCreation')}</Text>
      <Text style={shared.brand}>ZeroEmpty</Text>
      <Text style={shared.greeting}>{t('welcome')}</Text>

      <TouchableOpacity
        style={shared.ctaBtn}
        onPress={() => navigation.navigate('OrderRoute')}
      >
        <Text style={shared.ctaText}>{t('newTransportOrder')}</Text>
      </TouchableOpacity>

      <Text style={shared.sectionLabel}>{t('recentOrders')}</Text>
      {loading && <ActivityIndicator color={colors.accent} />}
      {error && <Text style={shared.error}>{error}</Text>}

      <FlatList
        data={orders}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.avatar} />
            <View style={styles.body}>
              <View style={styles.row}>
                <Text style={styles.id}>Order #{item.id}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Text style={styles.route}>
                {item.pickupLocation} → {item.dropLocation}
              </Text>
              <Text style={styles.cargo}>
                {item.commodity?.name || 'Cargo'} — {formatWeight(item.commodity?.weightKg)}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

function createListStyles(colors) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      gap: 12,
      padding: 14,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 10,
    },
    avatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.surfaceElevated,
    },
    body: { flex: 1 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    id: { color: colors.text, fontWeight: '600' },
    route: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
    cargo: { color: colors.text, fontSize: 13, marginTop: 2 },
  });
}
