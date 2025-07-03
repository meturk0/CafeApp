import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, StyleSheet } from 'react-native';
import AccountScreen from '../screens/AccountScreen';
import OrdersScreen from '../screens/OrdersScreen';

const Tab = createBottomTabNavigator();



const PersonelTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Siparişler"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', height: 60 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Siparişler') iconName = focused ? 'format-list-bulleted' : 'format-list-bulleted';
                    else if (route.name === 'Hesabım') iconName = focused ? 'account' : 'account-outline';
                    else iconName = 'help-circle-outline';
                    return <Icon name={iconName} size={26} color={focused ? '#275636' : '#666'} />;
                },
                tabBarLabelStyle: { fontSize: 13 },
                tabBarActiveTintColor: '#275636',
                tabBarInactiveTintColor: '#666',
            })}
        >
            <Tab.Screen name="Siparişler" component={OrdersScreen} />
            <Tab.Screen name="Hesabım" component={AccountScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7fa' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 16 },
    subtitle: { fontSize: 18, color: '#222' },
});

export default PersonelTabNavigator; 