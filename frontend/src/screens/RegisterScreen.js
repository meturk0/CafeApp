import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRegister } from '../hooks/useRegister';

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { handleRegister, loading, error } = useRegister();

    const onRegister = async () => {
        if (!name || !email || !phone || !password) {
            // local error
            return;
        }
        const result = await handleRegister({
            name: name.split(' ')[0],
            surname: name.split(' ').slice(1).join(' ') || '-',
            email,
            password,
            role: 'admin',
        });
        if (result) navigation.goBack();
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/cafe.png')} style={styles.logo} />
                <Text style={styles.title}>Kayıt Ol</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Ad Soyad"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />
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
                    placeholder="Telefon Numarası"
                    placeholderTextColor="#888"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Parola"
                    placeholderTextColor="#888"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <TouchableOpacity style={styles.button} onPress={onRegister} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Kaydediliyor...' : 'Kayıt Ol'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginLink} onPress={() => navigation.goBack()}>
                    <Text style={styles.loginText}>Zaten hesabın var mı? Giriş yap</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f7fa', justifyContent: 'center' },
    logoContainer: { alignItems: 'center', marginBottom: 32 },
    logo: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 8 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', letterSpacing: 2 },
    form: { paddingHorizontal: 32 },
    input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
    button: { backgroundColor: '#275636', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    error: { color: 'red', marginBottom: 8, textAlign: 'center' },
    loginLink: { marginTop: 18, alignItems: 'center' },
    loginText: { color: '#275636', fontWeight: 'bold' },
});

export default RegisterScreen; 