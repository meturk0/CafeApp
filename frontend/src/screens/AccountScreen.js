import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const USER = {
    name: 'Emin',
    surname: 'Türk',
    email: 'emin.turk@example.com',
    phone: '+90 555 123 12 34',
};

const AccountScreen = ({ navigation }) => {
    const [edit, setEdit] = useState(false);
    const [form, setForm] = useState(USER);

    const handleChange = (key, value) => setForm({ ...form, [key]: value });
    const handleSave = () => {
        setEdit(false);
        // Burada backend'e güncelleme gönderilebilir
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
                            value={form.phone}
                            onChangeText={v => handleChange('phone', v)}
                            keyboardType="phone-pad"
                        />
                    ) : (
                        <Text style={styles.value}>{form.phone}</Text>
                    )}
                </View>
                {edit && (
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveBtnText}>Kaydet</Text>
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                <Icon name="logout" size={22} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.logoutText}>Çıkış Yap</Text>
            </TouchableOpacity>
        </View>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, backgroundColor: '#275636' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, paddingTop: 30 },
    editRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: -8 },
    editIconWrap: { padding: 8 },
    infoCard: { backgroundColor: '#fff', borderRadius: 16, margin: 16, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
    label: { color: '#888', fontWeight: 'bold', fontSize: 15, width: 80 },
    value: { color: '#222', fontWeight: 'bold', fontSize: 16 },
    input: { borderBottomWidth: 1, borderColor: '#275636', fontSize: 16, color: '#222', minWidth: width * 0.4, paddingVertical: 2 },
    saveBtn: { backgroundColor: '#275636', borderRadius: 20, paddingVertical: 10, alignItems: 'center', marginTop: 8 },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e53935', borderRadius: 24, paddingVertical: 14, marginHorizontal: 32, marginTop: 32 },
    logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default AccountScreen; 