import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import styles from '../styles/LoginScreenStyles';

// Giriş ekranı: Kullanıcı e-posta ve şifre ile giriş yapar
const LoginScreen = ({ navigation }) => {
    // State ve contextler
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin, loading, error } = useLogin();
    const { login, user } = useAuth();
    const { setUser } = useUser();
    const [loginSuccess, setLoginSuccess] = useState(false);

    // Giriş işlemi
    const onLogin = async () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        if (!trimmedEmail || !trimmedPassword) {
            // local error
            return;
        }
        const success = await login(handleLogin, { email: trimmedEmail, password: trimmedPassword });
        if (success && user) {
            setUser(user);
        }
        setLoginSuccess(success);
    };

    // Giriş başarılıysa role göre yönlendirme
    useEffect(() => {
        if (loginSuccess && user && user.role) {
            const role = user.role.toLowerCase();
            if (role === 'personel') {
                navigation.replace('OrdersList');
            } else if (role === 'admin') {
                navigation.replace('Admin');
            } else if (role === 'müşteri') {
                navigation.replace('Main');
            } else {
                navigation.replace('Main');
            }
        } else if (loginSuccess && user) {
            navigation.replace('Main');
        }
    }, [loginSuccess, user]);

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* Logo ve başlık */}
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/cafe.png')} style={styles.logo} />
                <Text style={styles.title}>blnk.</Text>
            </View>
            {/* Giriş formu */}
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="E-posta"
                    placeholderTextColor="#888"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Şifre"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={onLogin} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Hesabın yok mu? Kayıt ol</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen; 