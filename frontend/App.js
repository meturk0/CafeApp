import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { CartProvider } from './src/context/CartContext';
import CampaignDetailScreen from './src/screens/CampaignDetailScreen';
import MainTabNavigator from './src/navigator/MainTabNavigator';
import PersonelTabNavigator from './src/navigator/PersonelTabNavigator';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import AdminTabNavigator from './src/navigator/AdminTabNavigator';
import AdminUsers from './src/screens/AdminUsers';
import AdminProducts from './src/screens/AdminProducts';
import AdminCampaigns from './src/screens/AdminCampaigns';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
          <Stack.Screen name="OrdersList" component={PersonelTabNavigator} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
          <Stack.Screen name="Admin" component={AdminTabNavigator} />
          <Stack.Screen name="AdminUsers" component={AdminUsers} />
          <Stack.Screen name="AdminProducts" component={AdminProducts} />
          <Stack.Screen name="AdminCampaigns" component={AdminCampaigns} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
