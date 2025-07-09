import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from '../context/UserContext';
import { fetchAllOrders } from '../api/order';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

function formatOrderDate(dateString) {
    const date = new Date(dateString);
    const time = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Istanbul' });
    const day = date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Istanbul' });
    return `${time} , ${day}`;
}

const FILTERS = [
    { key: 'daily', label: 'Günlük' },
    { key: 'weekly', label: 'Haftalık' },
    { key: 'monthly', label: 'Aylık' },
    { key: 'yearly', label: 'Yıllık' },
];

const CustomerOrdersScreen = () => {
    const { userId } = useUser();
    const navigation = useNavigation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('daily');

    useEffect(() => {
        const getOrders = async () => {
            try {
                const allOrders = await fetchAllOrders();
                const userOrders = allOrders.filter(order => order.user_id === userId);
                userOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(userOrders);
            } catch (err) {
                // hata yönetimi
            } finally {
                setLoading(false);
            }
        };
        if (userId) getOrders();
    }, [userId]);

    // Filtreye göre siparişleri döndür
    const getFilteredOrders = () => {
        const now = new Date();
        if (filter === 'daily') {
            return orders.filter(order => {
                const d = new Date(order.date);
                return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
            });
        } else if (filter === 'weekly') {
            // Pazartesi başlangıçlı haftalık filtre
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Pazartesi
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            return orders.filter(order => {
                const d = new Date(order.date);
                return d >= startOfWeek && d <= endOfWeek;
            });
        } else if (filter === 'monthly') {
            return orders.filter(order => {
                const d = new Date(order.date);
                return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
            });
        } else if (filter === 'yearly') {
            return orders.filter(order => {
                const d = new Date(order.date);
                return d.getFullYear() === now.getFullYear();
            });
        }
        return orders;
    };

    const filteredOrders = getFilteredOrders();

    if (loading) return <Text>Yükleniyor...</Text>;
    if (!filteredOrders.length) return <Text>Sipariş bulunamadı.</Text>;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backIcon} onPress={() => navigation.navigate('Hesabım')}>
                    <Icon name="arrow-left" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Siparişlerim</Text>
            </View>
            {/* Picker ile filtre seçimi */}
            <View style={styles.pickerRow}>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={filter}
                        style={styles.picker}
                        onValueChange={(itemValue) => setFilter(itemValue)}
                        mode="dropdown"
                    >
                        {FILTERS.map(f => (
                            <Picker.Item key={f.key} label={f.label} value={f.key} />
                        ))}
                    </Picker>
                </View>
            </View>
            <FlatList
                data={filteredOrders}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.orderCard}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Text style={styles.orderId}>Sipariş No: {item.id}</Text>
                            <Text style={styles.orderState}>{item.state}</Text>
                        </View>
                        <Text><Text >Tarih: </Text>{formatOrderDate(item.date)}</Text>
                        <Text><Text >Açıklama: </Text>{item.description || '-'}</Text>
                        <Text><Text >Fiyat: </Text>{item.price} TL</Text>
                        <Text style={styles.productsTitle}>Ürünler:</Text>
                        {item.products && item.products.length > 0 ? (
                            item.products.map((product, idx) => (
                                <Text key={idx} style={styles.productName}>- {product.name}</Text>
                            ))
                        ) : (
                            <Text style={styles.productName}>Ürün yok</Text>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        backgroundColor: '#275636',
        position: 'relative',
    },
    backIcon: {
        position: 'absolute',
        left: 12,
        top: 15,
        zIndex: 2,
        padding: 4,
    },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, paddingVertical: 15 },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#e8e8e8',
        marginBottom: 8,
        marginTop: 12,
    },

    pickerWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 25,
        overflow: 'hidden',
        marginLeft: 15,
        marginRight: 260,
        height: 36,
        justifyContent: 'center',
    },
    picker: {
        height: 36,
        fontWeight: 'bold',
    },

    orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, margin: 10 },
    orderId: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
    orderState: {
        color: '#e53935',
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    productsTitle: { marginTop: 8, fontWeight: 'bold', color: '#275636' },
    productName: { marginLeft: 8, color: '#222' },
});

export default CustomerOrdersScreen; 