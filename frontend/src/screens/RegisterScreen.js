import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { useRegister } from '../hooks/useRegister';
import styles from '../styles/RegisterScreenStyles';

// Kayıt ekranı: Kullanıcı yeni hesap oluşturur
const RegisterScreen = ({ navigation }) => {
    // State ve register hook'u
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const { handleRegister, loading, error } = useRegister();

    // Kayıt işlemi
    const onRegister = async () => {
        const trimmedName = name.trim();
        const trimmedSurname = surname.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();
        const trimmedPassword = password.trim();
        if (!trimmedName || !trimmedSurname || !trimmedEmail || !trimmedPhone || !trimmedPassword) {
            // local error
            return;
        }
        const result = await handleRegister({
            name: trimmedName,
            surname: trimmedSurname,
            email: trimmedEmail,
            phone_number: trimmedPhone,
            password: trimmedPassword,
            role: 'müşteri',
        });
        if (result) navigation.goBack();
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            {/* Logo ve başlık */}
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/cafe.png')} style={styles.logo} />
                <Text style={styles.title}>blnk.</Text>
            </View>
            {/* Kayıt formu */}
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Ad"
                    placeholderTextColor="#888"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Soyad"
                    placeholderTextColor="#888"
                    value={surname}
                    onChangeText={setSurname}
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

export default RegisterScreen; 