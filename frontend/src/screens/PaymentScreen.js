import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/order';
import { useNavigation } from '@react-navigation/native';

const PaymentScreen = () => {
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const { userId } = useUser();
    const { cart, setCart } = useCart();
    const navigation = useNavigation();

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
            <Text style={styles.title}>Ödeme Ekranı</Text>
            <TextInput
                style={styles.input}
                placeholder="Açıklama (isteğe bağlı)"
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
            />
            <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Gönderiliyor...' : 'Sepeti Onayla'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7fa', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 32 },
    input: {
        width: '100%',
        minHeight: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 24,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#275636',
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default PaymentScreen; 