import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Pressable, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { updateOrder, deleteOrder } from '../api/order';
import { fetchUserById } from '../api/user';
import styles from '../styles/OrderDetailScreenStyles';

// Sipariş detay ekranı: Siparişin ürünleri, durumu ve kullanıcı bilgisi gösterilir
const OrderDetailScreen = ({ route }) => {
    const { order } = route.params;
    // Durum değiştirme modalı ve seçili durum
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
    // Kullanıcı adı state'i
    const [userName, setUserName] = useState('');
    const [userLoading, setUserLoading] = useState(true);
    // Siparişi veren kullanıcıyı getir
    useEffect(() => {
        let mounted = true;
        const getUser = async () => {
            if (!order.user_id) return;
            setUserLoading(true);
            try {
                const user = await fetchUserById(order.user_id);
                if (mounted) setUserName(user.name + (user.surname ? ' ' + user.surname : ''));
            } catch {
                if (mounted) setUserName('Kullanıcı');
            } finally {
                if (mounted) setUserLoading(false);
            }
        };
        getUser();
        return () => { mounted = false; };
    }, [order.user_id]);
    // Sipariş durumunu değiştir
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
            {/* Geri butonu */}
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
            {/* Durum seçenekleri modalı */}
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
            {/* Sipariş bilgileri kartı */}
            <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Sipariş No:</Text>
                    <Text style={styles.infoValue}>{order.id}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Kullanıcı:</Text>
                    <Text style={styles.infoValue}>{userLoading ? 'Yükleniyor...' : userName}</Text>
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
            {/* Ürünler listesi */}
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
            {/* Toplam tutar */}
            <View style={styles.orderTotalWrap}>
                <Text style={styles.orderTotalLabel}>Toplam Tutar:</Text>
                <Text style={styles.orderTotalValue}>{orderTotal != null ? orderTotal + ' TL' : '-'}</Text>
            </View>
            {/* Siparişi sil butonu */}
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

export default OrderDetailScreen; 