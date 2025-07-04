import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useLogin } from '../hooks/useLogin';
import { useUser } from '../context/UserContext';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin, loading, error } = useLogin();
    const { setUser } = useUser();

    const onLogin = async () => {
        if (!email || !password) {
            // local error
            return;
        }
        const user = await handleLogin(email, password);
        if (user) {
            setUser(user);
            if (user.role && user.role.toLowerCase() === 'personel') {
                navigation.replace('OrdersList');
            } else if (user.role && user.role.toLowerCase() === 'admin') {
                navigation.replace('Admin');
            } else {
                navigation.replace('Main');
            }
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/cafe.png')} style={styles.logo} />
                <Text style={styles.title}>blnk.</Text>
            </View>
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f7fa', justifyContent: 'center' },
    logoContainer: { alignItems: 'center', marginBottom: 32 },
    logo: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 8 },
    title: { color: '#275636', fontSize: 25, fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: 1 },
    form: { paddingHorizontal: 32 },
    input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
    button: { backgroundColor: '#275636', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    error: { color: 'red', marginBottom: 8, textAlign: 'center' },
    registerLink: { marginTop: 18, alignItems: 'center' },
    registerText: { color: '#275636', fontWeight: 'bold' },
});

export default LoginScreen; 