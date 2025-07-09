import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchAllOrders } from '../api/order';

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
                <Text style={styles.buttonText}>Ciro</Text>
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Ciro Hesapla</Text>
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

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7fa' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 32 },
    button: { backgroundColor: '#275636', borderRadius: 10, paddingVertical: 16, paddingHorizontal: 40, marginVertical: 10, alignItems: 'center', width: 220 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320, alignItems: 'center' },
    dateBtn: { backgroundColor: '#f3f3f3', borderRadius: 8, padding: 10, marginVertical: 6, width: 220, alignItems: 'center' },
});

export default AdminScreen; 