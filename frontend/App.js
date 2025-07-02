import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View } from 'react-native';
import CartScreen from './src/screens/CartScreen';
import CampaignsScreen from './src/screens/CampaignsScreen';
import AccountScreen from './src/screens/AccountScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { CartProvider } from './src/context/CartContext';
import CampaignDetailScreen from './src/screens/CampaignDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Anasayfa"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarShowLabel: true,
      tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', height: 60 },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Anasayfa') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Arama') iconName = focused ? 'magnify' : 'magnify';
        else if (route.name === 'Sepetim') iconName = focused ? 'cart' : 'cart-outline';
        else if (route.name === 'Kampanyalar') iconName = focused ? 'gift' : 'gift-outline';
        else if (route.name === 'Hesabım') iconName = focused ? 'account' : 'account-outline';
        else iconName = 'help-circle-outline';
        return <Icon name={iconName} size={26} color={focused ? '#275636' : '#666'} />;
      },
      tabBarLabelStyle: { fontSize: 13 },
      tabBarActiveTintColor: '#275636',
      tabBarInactiveTintColor: '#666',
    })}
  >
    <Tab.Screen name="Anasayfa" component={HomeScreen} />
    <Tab.Screen name="Arama" component={SearchScreen} />
    <Tab.Screen name="Sepetim" component={CartScreen} />
    <Tab.Screen name="Kampanyalar" component={CampaignsScreen} />
    <Tab.Screen name="Hesabım" component={AccountScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
