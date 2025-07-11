import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, Modal, Pressable, Alert } from 'react-native';
import { fetchAllUsers, registerUser, deleteUser, updateUser } from '../api/user';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/AdminUserScreenStyles';

const AdminUserScreen = ({ navigation }) => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [form, setForm] = useState({ name: '', surname: '', email: '', password: '', role: '' });
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState('');
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [updateForm, setUpdateForm] = useState({ name: '', surname: '', email: '', phone_number: '', password: '', role: '' });

    const userContext = typeof useUser === 'function' ? useUser() : {};
    const authContext = typeof useAuth === 'function' ? useAuth() : {};
    const user = authContext?.user || userContext?.user;

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
            setForm({ name: '', surname: '', email: '', phone_number: '', password: '', role: '' });
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
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => {
                setSelectedUser(item);
                setActionModalVisible(true);
            }}
        >
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
            {/* Geri Butonu */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={28} color="#275636" />
            </TouchableOpacity>
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
                            placeholder="Telefon Numarası"
                            value={form.phone_number}
                            onChangeText={v => setForm(f => ({ ...f, phone_number: v }))}
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
                            <Picker.Item label="Müşteri" value="müşteri" />
                        </Picker>
                        {formError ? <Text style={{ color: 'red', marginBottom: 8 }}>{formError}</Text> : null}
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCancelBtn}>
                                <Text style={{ color: '#275636', fontWeight: 'bold' }}>İptal</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    Alert.alert(
                                        'Onay',
                                        'Yeni kullanıcı eklemek istediğinize emin misiniz?',
                                        [
                                            { text: 'Vazgeç', style: 'cancel' },
                                            { text: 'Evet', onPress: handleAddUser }
                                        ]
                                    );
                                }}
                                style={styles.modalSaveBtn}
                                disabled={saving}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{saving ? 'Kaydediliyor...' : 'Kaydet'}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={actionModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setActionModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.actionModalContent}>
                        <Text style={styles.modalTitle}>Kullanıcı İşlemleri</Text>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => {
                            if (!selectedUser) return;
                            setUpdateForm({
                                name: selectedUser.name || '',
                                surname: selectedUser.surname || '',
                                email: selectedUser.email || '',
                                phone_number: selectedUser.phone_number || '',
                                password: selectedUser.password || '',
                                role: selectedUser.role || '',
                            });
                            setActionModalVisible(false);
                            setUpdateModalVisible(true);
                        }}>
                            <Text style={styles.actionBtnText}>Düzenle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#e53935' }]} onPress={() => {
                            if (!selectedUser) return;
                            Alert.alert(
                                'Kullanıcıyı Sil',
                                'Bu kullanıcıyı silmek istediğinize emin misiniz?',
                                [
                                    { text: 'Vazgeç', style: 'cancel' },
                                    {
                                        text: 'Evet', style: 'destructive', onPress: async () => {
                                            try {
                                                await deleteUser(selectedUser.id);
                                                setActionModalVisible(false);
                                                // Listeyi güncelle
                                                const data = await fetchAllUsers();
                                                setUsers(data);
                                                setFilteredUsers(data);
                                            } catch (err) {
                                                Alert.alert('Hata', err.message || 'Kullanıcı silinemedi');
                                            }
                                        }
                                    }
                                ]
                            );
                        }}>
                            <Text style={[styles.actionBtnText, { color: '#fff' }]}>Sil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setActionModalVisible(false)}>
                            <Text style={{ color: '#888', fontWeight: 'bold' }}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={updateModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setUpdateModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Kullanıcıyı Güncelle</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Ad"
                            value={updateForm.name}
                            onChangeText={text => setUpdateForm({ ...updateForm, name: text })}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Soyad"
                            value={updateForm.surname}
                            onChangeText={text => setUpdateForm({ ...updateForm, surname: text })}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="E-posta"
                            value={updateForm.email}
                            onChangeText={text => setUpdateForm({ ...updateForm, email: text })}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Telefon Numarası"
                            value={updateForm.phone_number}
                            onChangeText={text => setUpdateForm({ ...updateForm, phone_number: text })}
                        />

                        <Picker
                            selectedValue={updateForm.role}
                            style={styles.modalInput}
                            onValueChange={itemValue => setUpdateForm({ ...updateForm, role: itemValue })}
                        >
                            <Picker.Item label="Müşteri" value="müşteri" />
                            <Picker.Item label="Personel" value="personel" />
                            <Picker.Item label="Admin" value="admin" />
                        </Picker>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                            <Pressable onPress={() => setUpdateModalVisible(false)} style={styles.modalCancelBtn}>
                                <Text style={{ color: '#275636', fontWeight: 'bold' }}>Kapat</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    Alert.alert(
                                        'Onay',
                                        'Kullanıcıyı güncellemek istediğinize emin misiniz?',
                                        [
                                            { text: 'Vazgeç', style: 'cancel' },
                                            {
                                                text: 'Evet',
                                                onPress: async () => {
                                                    try {
                                                        await updateUser(selectedUser.id, updateForm);
                                                        setUpdateModalVisible(false);
                                                        const data = await fetchAllUsers();
                                                        setUsers(data);
                                                        setFilteredUsers(data);
                                                    } catch (err) {
                                                        Alert.alert('Hata', err.message || 'Kullanıcı güncellenemedi');
                                                    }
                                                }
                                            }
                                        ]
                                    );
                                }}
                                style={styles.modalSaveBtn}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Kaydet</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AdminUserScreen; 