import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/order';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/PaymentScreenStyles';

// Ödeme ekranı: Sepet onaylama ve açıklama ekleme
const PaymentScreen = () => {
    // State ve contextler
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const userContext = typeof useUser === 'function' ? useUser() : {};
    const authContext = typeof useAuth === 'function' ? useAuth() : {};
    const userId = authContext?.user?.id || userContext?.userId;
    const { cart, setCart } = useCart();
    const navigation = useNavigation();

    // Sepeti onayla ve siparişi oluştur
    const handleConfirm = async () => {
        if (!cart.length) return;
        setLoading(true);
        try {
            const now = new Date();
            const orderData = {
                user_id: userId,
                state: 'Sipariş Alındı',
                date: now.toISOString(),
                price: cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toString(),
                description: note,
                products: cart.flatMap(item => {
                    if (item.type === 'campaign') {
                        return item.products.flatMap(product => Array(item.quantity).fill({ id: product.id }));
                    } else {
                        return Array(item.quantity).fill({ id: item.id });
                    }
                }),
            };
            await createOrder(orderData);
            setCart([]);
            Alert.alert('Başarılı', 'Siparişiniz oluşturuldu!', [
                {
                    text: 'Tamam',
                    onPress: () => navigation.navigate('CustomerOrders'),
                },
            ]);
        } catch (err) {
            Alert.alert('Hata', err.message || 'Sipariş oluşturulamadı');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Başlık */}
            <Text style={styles.title}>Ödeme Ekranı</Text>
            {/* Açıklama inputu */}
            <TextInput
                style={styles.input}
                placeholder="Açıklama (isteğe bağlı)"
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
            />
            {/* Sepeti onayla butonu */}
            <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Gönderiliyor...' : 'Sepeti Onayla'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default PaymentScreen; 