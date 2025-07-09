import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { updateOrder, deleteOrder } from '../api/order';

const OrderDetailScreen = ({ route }) => {
    const { order } = route.params;
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [selectedState, setSelectedState] = useState(order.state);
    const statusOptions = ['Sipariş Alındı', 'Hazırlanıyor', 'Teslim Edildi'];
    // Ürünleri birleştir (aynı id'li ürünleri grupla)
    const groupedProducts = (order.products || []).reduce((acc, product) => {
        const found = acc.find(p => p.id === product.id);
        if (found) {
            found.count = (found.count || 1) + 1;
        } else {
            acc.push({ ...product, count: 1 });
        }
        return acc;
    }, []);
    // Siparişin toplam fiyatını hesapla
    let orderTotal = order.price;
    if (orderTotal == null && Array.isArray(order.products)) {
        orderTotal = order.products.reduce((sum, p) => sum + (p.price || 0), 0);
    }
    const navigation = useNavigation();
    const handleStatusChange = (newState) => {
        Alert.alert(
            'Onay',
            `"${newState}" durumuna geçirmek istediğinize emin misiniz?`,
            [
                { text: 'Hayır', style: 'cancel' },
                {
                    text: 'Evet',
                    onPress: async () => {
                        setSelectedState(newState);
                        setStatusModalVisible(false);
                        try {
                            await updateOrder(order.id, {
                                state: newState,
                                date: order.date,
                                price: order.price,
                                description: order.description,
                                products: order.products?.map(p => ({ id: p.id })) || [],
                            });
                        } catch (err) {
                            Alert.alert('Hata', err.message || 'Sipariş durumu güncellenemedi');
                        }
                    }
                }
            ]
        );
    };
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Icon name="arrow-left" size={28} color="#275636" />
            </TouchableOpacity>
            <Text style={styles.title}>Sipariş Detayı</Text>
            {/* Durum Değiştir Butonu ve Seçenekler */}
            <View style={styles.statusRow}>
                <TouchableOpacity style={styles.statusEditBtn} onPress={() => setStatusModalVisible(!statusModalVisible)}>
                    <Icon name="pencil-outline" size={22} color="#275636" />
                    <Text style={styles.statusEditText}>Sipariş durumunu değiştir</Text>
                </TouchableOpacity>
                <Text style={styles.currentStatus}>{selectedState}</Text>
            </View>
            {statusModalVisible && (
                <View style={styles.inlineStatusBox}>
                    {statusOptions.map(option => (
                        <Pressable
                            key={option}
                            style={({ pressed }) => [styles.modalOption, pressed && { backgroundColor: '#e8e8e8' }]}
                            onPress={() => handleStatusChange(option)}
                        >
                            <Text style={styles.modalOptionText}>{option}</Text>
                        </Pressable>
                    ))}
                    <Pressable style={styles.modalCancel} onPress={() => setStatusModalVisible(false)}>
                        <Text style={styles.modalCancelText}>İptal</Text>
                    </Pressable>
                </View>
            )}
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Sipariş No:</Text>
                    <Text style={styles.infoValue}>{order.id}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tarih:</Text>
                    <Text style={styles.infoValue}>{order.date ? new Date(order.date).toLocaleString() : '-'}</Text>
                </View>
                {order.description && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Açıklama:</Text>
                        <Text style={styles.infoValue}>{order.description}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.subtitle}>Ürünler:</Text>
            <FlatList
                data={groupedProducts}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <Text style={styles.productName}>{item.name} <Text style={styles.productCount}>   x{item.count}</Text> </Text>
                        <Text style={styles.productTotal}>{(item.price * item.count).toFixed(2)} TL</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.info}>Ürün yok</Text>}
            />
            <View style={styles.orderTotalWrap}>
                <Text style={styles.orderTotalLabel}>Toplam Tutar:</Text>
                <Text style={styles.orderTotalValue}>{orderTotal != null ? orderTotal + ' TL' : '-'}</Text>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => {
                Alert.alert(
                    'Siparişi Sil',
                    'Bu siparişi silmek istediğinize emin misiniz?',
                    [
                        { text: 'Vazgeç', style: 'cancel' },
                        {
                            text: 'Evet', style: 'destructive', onPress: async () => {
                                try {
                                    await deleteOrder(order.id);
                                    Alert.alert('Başarılı', 'Sipariş silindi.');
                                    navigation.goBack(); // veya navigation.navigate('OrdersScreen')
                                } catch (err) {
                                    Alert.alert('Hata', err.message || 'Sipariş silinemedi');
                                }
                            }
                        }
                    ]
                );
            }}>
                <Text style={styles.deleteBtnText}>Siparişi Sil</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f7fa', padding: 16 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 10, textAlign: 'center' },
    infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, marginTop: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    infoLabel: { color: '#888', fontSize: 15, flex: 1 },
    infoValue: { color: '#222', fontWeight: 'bold', fontSize: 15, flex: 1, textAlign: 'right' },
    subtitle: { fontWeight: 'bold', fontSize: 16, marginTop: 16, marginBottom: 4, color: '#275636' },
    productItem: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginVertical: 4, flexDirection: 'row', alignItems: 'center' },
    productName: { fontSize: 15, color: '#222', flex: 1 },
    productCount: { color: '#888', fontWeight: 'bold', fontSize: 15, marginHorizontal: 8 },
    productTotal: { color: '#e53935', fontWeight: 'bold', fontSize: 15, minWidth: 70, textAlign: 'right' },
    info: { color: '#222', fontSize: 15, marginBottom: 2 },
    orderTotalWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 15, backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    orderTotalLabel: { fontSize: 18, color: '#888', fontWeight: 'bold' },
    orderTotalValue: { fontSize: 22, color: '#e53935', fontWeight: 'bold' },
    statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, marginTop: 10 },
    statusEditBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e8f5e9', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
    statusEditText: { color: '#275636', fontWeight: 'bold', fontSize: 15, marginLeft: 6 },
    currentStatus: { color: '#222', fontWeight: 'bold', fontSize: 15 },
    inlineStatusBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        marginTop: 0,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center'
    },
    modalOption: { paddingVertical: 10, paddingHorizontal: 16, width: '100%', alignItems: 'center', borderRadius: 8, marginBottom: 6 },
    modalOptionText: { fontSize: 16, color: '#222' },
    modalCancel: { marginTop: 10 },
    modalCancelText: { color: '#e53935', fontWeight: 'bold', fontSize: 16 },
    backBtn: { position: 'absolute', top: 16, left: 10, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 4, elevation: 2 },
    deleteBtn: {
        backgroundColor: '#e53935',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    deleteBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default OrderDetailScreen; 