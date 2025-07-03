import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import CampaignsScreen from '../screens/CampaignsScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
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

export default MainTabNavigator; 