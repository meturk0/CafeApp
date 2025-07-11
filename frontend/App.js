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
import AdminUserScreen from './src/screens/AdminUserScreen';
import { UserProvider } from './src/context/UserContext';
import SearchScreen from './src/screens/SearchScreen';
import CampaignsScreen from './src/screens/CampaignsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import CustomerOrdersScreen from './src/screens/CustomerOrdersScreen';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <UserProvider>
      <CartProvider>
        <NavigationContainer>
          <AuthProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Main" component={MainTabNavigator} />
              <Stack.Screen name="CampaignDetail" component={CampaignDetailScreen} />
              <Stack.Screen name="OrdersList" component={PersonelTabNavigator} />
              <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
              <Stack.Screen name="Admin" component={AdminTabNavigator} />
              <Stack.Screen name="AdminUserScreen" component={AdminUserScreen} />
              <Stack.Screen name="AdminProductScreen" component={SearchScreen} />
              <Stack.Screen name="AdminCampaignScreen" component={CampaignsScreen} />
              <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
              <Stack.Screen name="CustomerOrders" component={CustomerOrdersScreen} />
            </Stack.Navigator>
          </AuthProvider>
        </NavigationContainer>
      </CartProvider>
    </UserProvider>
  );
}
