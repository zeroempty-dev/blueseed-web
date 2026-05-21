import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';
import OrdersHomeScreen from '../screens/OrdersHomeScreen';
import OrderRouteScreen from '../screens/OrderRouteScreen';
import CargoDetailsScreen from '../screens/CargoDetailsScreen';
import DeliveryTimingScreen from '../screens/DeliveryTimingScreen';
import RouteSummaryScreen from '../screens/RouteSummaryScreen';
import PriceScreen from '../screens/PriceScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TabBarIcon from '../components/TabBarIcon';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const Tab = createBottomTabNavigator();
const OrdersStack = createNativeStackNavigator();

function OrdersStackNavigator() {
  const { colors } = useTheme();
  return (
    <OrdersStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <OrdersStack.Screen name="OrdersHome" component={OrdersHomeScreen} />
      <OrdersStack.Screen name="OrderRoute" component={OrderRouteScreen} />
      <OrdersStack.Screen name="CargoDetails" component={CargoDetailsScreen} />
      <OrdersStack.Screen name="DeliveryTiming" component={DeliveryTimingScreen} />
      <OrdersStack.Screen name="RouteSummary" component={RouteSummaryScreen} />
      <OrdersStack.Screen name="Price" component={PriceScreen} />
    </OrdersStack.Navigator>
  );
}

function TabLabel({ labelKey, focused }) {
  const { colors } = useTheme();
  const { t } = useLanguage();
  return (
    <Text style={{ color: focused ? colors.accent : colors.textMuted, fontSize: 10 }}>
      {t(labelKey)}
    </Text>
  );
}

export default function RootNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, size }) => (
          <TabBarIcon routeName={route.name} focused={focused} size={size} />
        ),
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel labelKey="tabHome" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="OrdersTab"
        component={OrdersStackNavigator}
        options={{
          title: 'Orders',
          tabBarLabel: ({ focused }) => <TabLabel labelKey="tabOrders" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Track"
        component={PlaceholderScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel labelKey="tabTrack" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={PlaceholderScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel labelKey="tabWallet" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ focused }) => <TabLabel labelKey="tabProfile" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}
