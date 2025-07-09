import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import CartScreen from '../screens/CartScreen';
import CampaignsScreen from '../screens/CampaignsScreen';
import AccountScreen from '../screens/AccountScreen';
import { CartContext } from '../context/CartContext';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
    const { cart } = useContext(CartContext);
    const cartCount = cart?.length || 0;

    return (
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

                    if (route.name === 'Sepetim' && cartCount > 0) {
                        return (
                            <View>
                                <Icon name={iconName} size={26} color={focused ? '#275636' : '#666'} />
                                <View style={{
                                    position: 'absolute',
                                    right: -6,
                                    top: -4,
                                    backgroundColor: '#e53935',
                                    borderRadius: 8,
                                    minWidth: 16,
                                    height: 16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingHorizontal: 3,
                                }}>
                                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: 'bold' }}>{cartCount}</Text>
                                </View>
                            </View>
                        );
                    }

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
};

export default MainTabNavigator;