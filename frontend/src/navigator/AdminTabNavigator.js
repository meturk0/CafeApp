import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AdminScreen from '../screens/AdminScreen';
import AccountScreen from '../screens/AccountScreen';

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="AdminPanel"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee', height: 60 },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'AdminPanel') iconName = focused ? 'shield-account' : 'shield-account-outline';
                    else if (route.name === 'Hesabım') iconName = focused ? 'account' : 'account-outline';
                    else iconName = 'help-circle-outline';
                    return <Icon name={iconName} size={26} color={focused ? '#275636' : '#666'} />;
                },
                tabBarLabelStyle: { fontSize: 13 },
                tabBarActiveTintColor: '#275636',
                tabBarInactiveTintColor: '#666',
            })}
        >
            <Tab.Screen name="AdminPanel" component={AdminScreen} options={{ title: 'Admin' }} />
            <Tab.Screen name="Hesabım" component={AccountScreen} />
        </Tab.Navigator>
    );
};

export default AdminTabNavigator; 