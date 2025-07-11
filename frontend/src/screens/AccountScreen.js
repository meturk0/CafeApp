import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/AccountScreenStyles';

const AccountScreen = ({ navigation }) => {
    const userContext = typeof useUser === 'function' ? useUser() : {};
    const authContext = typeof useAuth === 'function' ? useAuth() : {};
    const user = authContext?.user || userContext?.user;
    const userId = authContext?.user?.id || userContext?.userId;
    const setUser = userContext?.setUser;
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState(user || { name: '', surname: '', email: '', phone_number: '', password: '', role: '' });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');

    useEffect(() => {
        if (user) setForm(user);
    }, [user]);

    const handleChange = (key, value) => setForm({ ...form, [key]: value });
    const handleSave = async () => {
        setEdit(false);
        try {
            const body = {
                name: form.name,
                surname: form.surname,
                email: form.email,
                phone_number: form.phone_number,
                role: form.role,
                // password alanı gönderilmiyor!
            };
            await updateUser(userId, body);
            if (typeof setUser === 'function') {
                setUser({ ...user, ...body });
            }
            await AsyncStorage.setItem('user', JSON.stringify({ ...user, ...body }));
            Alert.alert('Başarılı', 'Kullanıcı bilgileri güncellendi.');
        } catch (err) {
            Alert.alert('Hata', err.message || 'Güncelleme başarısız');
        }
    };

    // Şifre değiştirme işlemi (dummy, backend fonksiyonu ile entegre edilecek)
    const handlePasswordChange = async () => {
        if (!oldPassword || !newPassword || !newPasswordAgain) {
            Alert.alert('Hata', 'Tüm alanları doldurun.');
            return;
        }
        if (newPassword !== newPasswordAgain) {
            Alert.alert('Hata', 'Yeni şifreler eşleşmiyor.');
            return;
        }
        try {
            // Mevcut kullanıcı bilgilerini ve yeni şifreyi gönder
            const body = {
                name: user.name,
                surname: user.surname,
                email: user.email,
                phone_number: user.phone_number,
                role: user.role,
                password: newPassword,
            };
            await updateUser(userId, body);
            if (typeof setUser === 'function') {
                setUser({ ...user, password: newPassword });
            }
            await AsyncStorage.setItem('user', JSON.stringify({ ...user, password: newPassword }));
            Alert.alert('Başarılı', 'Şifre değiştirildi.');
            setShowPasswordModal(false);
            setOldPassword('');
            setNewPassword('');
            setNewPasswordAgain('');
        } catch (err) {
            Alert.alert('Hata', err.message || 'Şifre değiştirilemedi');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Çıkış Yap',
            'Emin misiniz?',
            [
                { text: 'Vazgeç', style: 'cancel' },
                { text: 'Evet', onPress: () => navigation.replace('Login') },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hesabım</Text>
            </View>
            <View style={styles.editRow}>
                <View style={{ flex: 1 }} />
                <TouchableOpacity style={styles.editIconWrap} onPress={() => setEdit(!edit)}>
                    <Icon name="pencil-outline" size={22} color="#275636" />
                </TouchableOpacity>
            </View>
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>İsim:</Text>
                    {edit ? (
                        <TextInput
                            style={styles.input}
                            value={form.name}
                            onChangeText={v => handleChange('name', v)}
                        />
                    ) : (
                        <Text style={styles.value}>{form.name}</Text>
                    )}
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Soyisim:</Text>
                    {edit ? (
                        <TextInput
                            style={styles.input}
                            value={form.surname}
                            onChangeText={v => handleChange('surname', v)}
                        />
                    ) : (
                        <Text style={styles.value}>{form.surname}</Text>
                    )}
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Mail:</Text>
                    {edit ? (
                        <TextInput
                            style={styles.input}
                            value={form.email}
                            onChangeText={v => handleChange('email', v)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    ) : (
                        <Text style={styles.value}>{form.email}</Text>
                    )}
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Telefon:</Text>
                    {edit ? (
                        <TextInput
                            style={styles.input}
                            value={form.phone_number}
                            onChangeText={v => handleChange('phone_number', v)}
                            keyboardType="phone-pad"
                        />
                    ) : (
                        <Text style={styles.value}>{form.phone_number}</Text>
                    )}
                </View>
                {/* Şifre alanı kaldırıldı */}
            </View>
            {edit && (
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Kaydet</Text>
                </TouchableOpacity>
            )}
            {/* Şifre Değiştir Butonu */}
            <TouchableOpacity onPress={() => setShowPasswordModal(true)}>
                <Text style={styles.passwordTextBtn}>Şifre Değiştir</Text>
            </TouchableOpacity>
            {/* Şifre Değiştir Modalı */}
            <Modal visible={showPasswordModal} transparent animationType="slide">
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={{ backgroundColor: '#fff', padding: 24, borderRadius: 12, width: '80%' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Şifre Değiştir</Text>
                        <TextInput
                            placeholder="Eski Şifre"
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            secureTextEntry
                            style={[styles.input, { marginBottom: 8 }]}
                        />
                        <TextInput
                            placeholder="Yeni Şifre"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            style={[styles.input, { marginBottom: 8 }]}
                        />
                        <TextInput
                            placeholder="Yeni Şifre (Tekrar)"
                            value={newPasswordAgain}
                            onChangeText={setNewPasswordAgain}
                            secureTextEntry
                            style={[styles.input, { marginBottom: 16 }]}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity onPress={() => setShowPasswordModal(false)} style={{ padding: 8 }}>
                                <Text>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handlePasswordChange} style={{ padding: 8 }}>
                                <Text style={{ color: '#275636', fontWeight: 'bold' }}>Değiştir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {user?.role === 'müşteri' && (
                <TouchableOpacity style={styles.ordersBtn} onPress={() => navigation.navigate('CustomerOrders')}>
                    <Text style={styles.ordersBtnText}>Siparişlerim</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Icon name="logout" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
        </View>
    );
};

export default AccountScreen; 