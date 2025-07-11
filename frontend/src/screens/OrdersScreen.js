import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useOrders } from '../hooks/useOrders';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { fetchUserById } from '../api/user';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return {
        date: `${day}.${month}.${year}`,
        time: `${hour}:${minute}`
    };
}

const OrdersScreen = () => {
    const { orders, loading, error, fetchOrders } = useOrders();
    const navigation = useNavigation();
    const [userNames, setUserNames] = useState({}); // { user_id: 'Ad Soyad' }
    // Date filter states
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });
    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setHours(23, 59, 59, 999);
        return d;
    });
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    // Modal içi için geçici state'ler
    const [tempStartDate, setTempStartDate] = useState(startDate);
    const [tempEndDate, setTempEndDate] = useState(endDate);

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [fetchOrders])
    );

    useEffect(() => {
        // Siparişlerdeki user_id'ler için kullanıcı adlarını çek
        const fetchNames = async () => {
            if (!orders) return;
            const uniqueUserIds = [...new Set(orders.map(o => o.user_id).filter(Boolean))];
            const newUserNames = { ...userNames };
            await Promise.all(uniqueUserIds.map(async (userId) => {
                if (!newUserNames[userId]) {
                    try {
                        const user = await fetchUserById(userId);
                        newUserNames[userId] = user.name + (user.surname ? ' ' + user.surname : '');
                    } catch {
                        newUserNames[userId] = 'Kullanıcı';
                    }
                }
            }));
            setUserNames(newUserNames);
        };
        fetchNames();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orders]);

    // Tarih aralığına göre filtrele
    const filteredOrders = (orders || []).filter(order => {
        const d = new Date(order.date);
        return d >= startDate && d <= endDate;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    const renderItem = ({ item }) => {
        const { date, time } = formatDateTime(item.date);
        // Tutarı hesapla: products arrayindeki fiyatların toplamı
        let total = item.price;
        if (total == null && Array.isArray(item.products)) {
            total = item.products.reduce((sum, p) => sum + (p.price || 0), 0);
        }
        let cardBackground = '#fff';
        if (item.state === 'Sipariş Alındı') cardBackground = '#e3f2fd'; // açık mavi
        else if (item.state === 'Hazırlanıyor') cardBackground = '#e8f5e9'; // açık yeşil
        return (
            <TouchableOpacity style={[styles.card, { backgroundColor: cardBackground }]} onPress={() => navigation.navigate('OrderDetail', { order: item })}>
                <View style={styles.cardHeader}>
                    <View>
                        <Text style={styles.orderNo}>
                            Sipariş No: {item.id}
                        </Text>
                        <Text style={styles.userName}>
                            {userNames[item.user_id] ? `${userNames[item.user_id]}` : 'Kullanıcı: ...'}
                        </Text>
                    </View>
                    <View style={styles.dateTimeWrap}>
                        <Text style={styles.date}>{date}</Text>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </View>
                {/* Durum ve tutar aynı satırda, alt kısımda */}
                <View style={styles.cardFooterRow}>
                    <Text style={styles.state}>{item.state}</Text>
                    <Text style={styles.total}>Tutar: {total != null ? total + ' TL' : '-'}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sipariş Geçmişi</Text>
            {/* Filtrele butonu */}
            <TouchableOpacity style={styles.dropdownBtn} onPress={() => {
                setTempStartDate(startDate);
                setTempEndDate(endDate);
                setFilterModalVisible(true);
            }}>
                <Text style={styles.dropdownBtnText}>Filtrele</Text>
                <Icon name="arrow-drop-down" size={22} color="#888" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            {/* Filtre modalı */}
            <Modal
                visible={filterModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Tarih Aralığı Seç</Text>
                        <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateBtn}>
                            <Text>Başlangıç Tarihi: {tempStartDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateBtn}>
                            <Text>Bitiş Tarihi: {tempEndDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showStartPicker && (
                            <DateTimePicker
                                value={tempStartDate}
                                mode="date"
                                display="default"
                                onChange={(e, date) => {
                                    setShowStartPicker(false);
                                    if (date) setTempStartDate(new Date(date.setHours(0, 0, 0, 0)));
                                }}
                            />
                        )}
                        {showEndPicker && (
                            <DateTimePicker
                                value={tempEndDate}
                                mode="date"
                                display="default"
                                onChange={(e, date) => {
                                    setShowEndPicker(false);
                                    if (date) setTempEndDate(new Date(date.setHours(23, 59, 59, 999)));
                                }}
                            />
                        )}
                        <TouchableOpacity style={styles.applyBtn} onPress={() => {
                            setStartDate(tempStartDate);
                            setEndDate(tempEndDate);
                            setFilterModalVisible(false);
                        }}>
                            <Text style={styles.applyBtnText}>Uygula</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setFilterModalVisible(false)}>
                            <Text style={styles.closeBtnText}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* FlatList ve diğer içerik */}
            {loading ? (
                <Text>Yükleniyor...</Text>
            ) : error ? (
                <Text>Hata: Siparişler alınamadı.</Text>
            ) : (
                <FlatList
                    data={filteredOrders}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 24 }}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f7fa', padding: 16 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 16, textAlign: 'center' },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    orderNo: { fontWeight: 'bold', fontSize: 16, color: '#222' },
    info: { color: '#222', fontSize: 15, marginVertical: 2 },
    total: { fontWeight: 'bold', fontSize: 16, marginTop: 1 },
    subtitle: { fontSize: 18, color: '#222' },
    state: { fontWeight: 'bold', fontSize: 15, color: '#e53935', marginTop: 10 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    dateTimeWrap: { alignItems: 'flex-end' },
    date: { color: '#222', fontSize: 13 },
    time: { color: '#888', fontSize: 13 },
    cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 8 },
    cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 8 },
    userName: { color: '#888', fontSize: 14, marginTop: 4 },
    dateFilterRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10, gap: 8 },
    dateBtn: { backgroundColor: '#f3f3f3', borderRadius: 8, padding: 10, marginVertical: 6, width: 220, alignItems: 'center' },
    filterBtn: { backgroundColor: '#275636', borderRadius: 10, paddingVertical: 16, paddingHorizontal: 40, alignItems: 'center', alignSelf: 'center', marginBottom: 10, width: 220 },
    filterBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320, alignItems: 'center' },
    applyBtn: { backgroundColor: '#275636', borderRadius: 10, paddingVertical: 16, alignItems: 'center', width: 220, marginTop: 16 },
    applyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    closeBtn: { backgroundColor: '#e53935', borderRadius: 10, paddingVertical: 16, alignItems: 'center', width: 220, marginTop: 16 },
    closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    dropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8e8e8',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        marginBottom: 10,
        minWidth: 120,
    },
    dropdownBtnText: {
        color: '#222',
        fontSize: 16,
        flex: 1,
    },
});

export default OrdersScreen; 