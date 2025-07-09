import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useOrders } from '../hooks/useOrders';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

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

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [fetchOrders])
    );

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
                    <Text style={styles.orderNo}>
                        Sipariş No: {item.id}
                    </Text>
                    <View style={styles.dateTimeWrap}>
                        <Text style={styles.date}>{date}</Text>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </View>
                <Text style={styles.state}>{item.state}</Text>
                <View style={styles.cardFooter}>
                    <View style={{ flex: 1 }} />
                    <Text style={styles.total}>Tutar: {total != null ? total + ' TL' : '-'}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sipariş Geçmişi</Text>
            {loading ? (
                <Text>Yükleniyor...</Text>
            ) : error ? (
                <Text>Hata: Siparişler alınamadı.</Text>
            ) : (
                <FlatList
                    data={[...(orders || [])].sort((a, b) => new Date(b.date) - new Date(a.date))}
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
    state: { fontWeight: 'bold', fontSize: 15, color: '#e53935' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    dateTimeWrap: { alignItems: 'flex-end' },
    date: { color: '#222', fontSize: 13 },
    time: { color: '#888', fontSize: 13 },
    cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: 8 },
});

export default OrdersScreen; 