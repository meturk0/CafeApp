import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchAllOrders } from '../api/order';
import styles from '../styles/AdminScreenStyles';

const AdminScreen = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [revenue, setRevenue] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCalculateRevenue = async () => {
        setLoading(true);
        try {
            const orders = await fetchAllOrders();
            const filtered = orders.filter(order => {
                const d = new Date(order.date);
                return d >= startDate && d <= endDate;
            });
            const total = filtered.reduce((sum, order) => sum + parseFloat(order.price), 0);
            setRevenue(total);
        } catch (err) {
            Alert.alert('Hata', err.message || 'Ciro hesaplanamadı');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Paneli</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminUserScreen')}>
                <Text style={styles.buttonText}>Kullanıcılar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminProductScreen')}>
                <Text style={styles.buttonText}>Ürünler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminCampaignScreen')}>
                <Text style={styles.buttonText}>Kampanyalar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                <Text style={styles.buttonText}>Ciro Hesaplama</Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateBtn}>
                            <Text>Başlangıç Tarihi: {startDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateBtn}>
                            <Text>Bitiş Tarihi: {endDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display="default"
                                onChange={(e, date) => {
                                    setShowStartPicker(false);
                                    if (date) setStartDate(date);
                                }}
                            />
                        )}
                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display="default"
                                onChange={(e, date) => {
                                    setShowEndPicker(false);
                                    if (date) setEndDate(date);
                                }}
                            />
                        )}
                        <TouchableOpacity style={[styles.button, { marginTop: 16 }]} onPress={handleCalculateRevenue} disabled={loading}>
                            <Text style={styles.buttonText}>{loading ? 'Hesaplanıyor...' : 'Ciroyu Hesapla'}</Text>
                        </TouchableOpacity>
                        {revenue !== null && (
                            <Text style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold', color: '#275636' }}>Ciro: {revenue.toFixed(2)} TL</Text>
                        )}
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#e53935', marginTop: 16 }]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default AdminScreen; 