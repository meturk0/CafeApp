import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation && useNavigation();

    useEffect(() => {
        // Uygulama açıldığında token ve user'ı oku
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                const storedUser = await AsyncStorage.getItem('user'); // user da oku
                if (storedToken) {
                    setToken(storedToken);
                }
                if (storedUser) {
                    setUser(JSON.parse(storedUser)); // user'ı set et
                }
            } catch (e) {
                console.error('Token veya user okunamadı', e);
            } finally {
                setLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (loginFunc, credentials) => {
        try {
            const response = await loginFunc(credentials.email, credentials.password);
            if (response && response.token) {
                setToken(response.token);
                await AsyncStorage.setItem('token', response.token);
                setUser(response.user || null);
                await AsyncStorage.setItem('user', JSON.stringify(response.user || {}));
                const storedUser = await AsyncStorage.getItem('user');
                const storedToken = await AsyncStorage.getItem('token');
                return true;
            } else {

                return false;
            }
        } catch (e) {
            Alert.alert('Giriş başarısız', e.message || 'Bir hata oluştu.');
            return false;
        }
    };

    const logout = async () => {
        setToken(null);
        setUser(null);
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user'); // user'ı da sil
    };

    // fetch wrapper: 401'de logout
    const authFetch = async (url, options = {}) => {
        const token = await AsyncStorage.getItem('token');
        const headers = {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const response = await fetch(url, { ...options, headers });
        if (response.status === 401) {
            await logout();
            if (navigation) navigation.replace('Login');
            throw new Error('Oturum süresi doldu, tekrar giriş yapınız.');
        }
        return response;
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading, authFetch }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 