import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Modal, Pressable } from 'react-native';
import { fetchAllUsers, registerUser } from '../api/user';
import { Picker } from '@react-native-picker/picker';

const AdminUserScreen = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({ name: '', surname: '', email: '', password: '', role: '' });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchAllUsers();
                setUsers(data);
                setFilteredUsers(data);
            } catch (err) {
                setError('Kullanıcılar alınamadı.');
            } finally {
                setLoading(false);
            }
        };
        getUsers();
    }, []);

    useEffect(() => {
        if (search.trim() === '') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(
                users.filter(user =>
                    user.name.toLowerCase().includes(search.toLowerCase())
                )
            );
        }
    }, [search, users]);

    const handleAddUser = async () => {
        setFormError('');
        setSaving(true);
        try {
            await registerUser(form);
            setModalVisible(false);
            setForm({ name: '', surname: '', email: '', password: '', role: '' });
            // Listeyi güncelle
            const data = await fetchAllUsers();
            setUsers(data);
            setFilteredUsers(data);
        } catch (err) {
            setFormError(err.message || 'Kullanıcı eklenemedi');
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.userItem} onPress={() => {/* Modal açma işlemi burada olacak */ }}>
            <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                {item.name} {item.surname}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="tail">
                {item.email || ''}
            </Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#275636" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kullanıcılar</Text>
            <View style={styles.searchRow}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="İsim ile ara..."
                    value={search}
                    onChangeText={setSearch}
                />
                <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.addButtonText}>+</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id?.toString() || item.email}
                renderItem={renderItem}
                ListEmptyComponent={<Text>Kullanıcı bulunamadı.</Text>}
                contentContainerStyle={{ flexGrow: 1 }}
            />
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Kullanıcı Ekle</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Ad"
                            value={form.name}
                            onChangeText={v => setForm(f => ({ ...f, name: v }))}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Soyad"
                            value={form.surname}
                            onChangeText={v => setForm(f => ({ ...f, surname: v }))}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="E-posta"
                            value={form.email}
                            onChangeText={v => setForm(f => ({ ...f, email: v }))}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Şifre"
                            value={form.password}
                            onChangeText={v => setForm(f => ({ ...f, password: v }))}
                            secureTextEntry
                        />
                        <Picker
                            selectedValue={form.role}
                            style={{ height: 48, width: 200 }}
                            onValueChange={v => setForm(f => ({ ...f, role: v }))}
                        >
                            <Picker.Item label="Rol seçiniz..." value="" />
                            <Picker.Item label="Admin" value="admin" />
                            <Picker.Item label="Personel" value="personel" />
                            <Picker.Item label="Kullanıcı" value="kullanıcı" />
                        </Picker>
                        {formError ? <Text style={{ color: 'red', marginBottom: 8 }}>{formError}</Text> : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCancelBtn}>
                                <Text style={{ color: '#275636', fontWeight: 'bold' }}>İptal</Text>
                            </Pressable>
                            <Pressable onPress={handleAddUser} style={styles.modalSaveBtn} disabled={saving}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#f7f7fa', paddingTop: 32 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 16 },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
    },
    addButton: {
        marginLeft: 8,
        backgroundColor: '#275636',
        borderRadius: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: -2,
    },
    userItem: {
        width: '95%',
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 12,
        marginBottom: 14,
        elevation: 1,
        flexDirection: 'column',
        width: 325
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2
    },
    userEmail: {
        fontSize: 16,
        color: '#555',
    },
    subtitle: { fontSize: 18, color: '#222' },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 320,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#275636',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
        fontSize: 16,
        backgroundColor: '#f7f7fa',
    },
    modalCancelBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#eee',
        marginRight: 8,
    },
    modalSaveBtn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#275636',
    },
    modalPicker: {
        backgroundColor: '#f7f7fa',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        height: 48,
        justifyContent: 'center',
    },
});

export default AdminUserScreen; 