import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/CartScreenStyles';

// Sepet ekranı: Kullanıcının sepetindeki ürünleri ve toplam tutarı gösterir.
const CartScreen = () => {
    const { cart, setCart } = useCart();
    const navigation = useNavigation();

    // Ürün adedini artır
    const increase = (id) => {
        setCart(cart.map(item =>
            item.id === id && item.type === 'campaign'
                ? { ...item, quantity: item.quantity + 1 }
                : item.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
        ));
    };
    // Ürün adedini azalt
    const decrease = (id) => {
        setCart(cart => cart.map(item =>
            item.id === id && item.type === 'campaign' && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item.id === id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
        ));
    };
    // Ürünü sepetten çıkar
    const remove = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };
    // Sepet toplam tutarı
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Sepet ürününü render eden fonksiyon
    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>{item.price} TL</Text>
                {item.type === 'campaign' && (
                    <Text style={{ color: '#275636', fontSize: 13, marginTop: 2 }}>Kampanya Ürünleri: {item.products.map(p => p.name).join(', ')}</Text>
                )}
            </View>
            <View style={styles.cartItemActions}>
                <TouchableOpacity
                    onPress={() => {
                        if (item.quantity > 1) {
                            decrease(item.id);
                        } else {
                            remove(item.id);
                        }
                    }}
                    style={styles.iconBtn}
                >
                    <Icon name="delete-outline" size={22} color="#222" />
                </TouchableOpacity>
                <Text style={styles.cartItemQty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => increase(item.id)} style={styles.iconBtn}>
                    <Icon name="plus" size={22} color="#222" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate('Anasayfa'); // Tab'a gitmek için
                }}>
                    <Icon name="arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sepetim</Text>
                <TouchableOpacity onPress={() => { setCart([]) }}>
                    <Icon name="delete-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Sepet */}
            {cart.length === 0 ? (
                <View style={styles.emptyCart}>
                    <View style={styles.emptyCartIconWrap}>
                        <Icon name="cart-outline" size={90} color="#bfc5cb" />
                    </View>
                    <Text style={styles.emptyCartText}>Sepetinde Ürün Bulunmamaktadır!</Text>
                </View>
            ) : (
                <FlatList
                    data={cart}
                    keyExtractor={(item, index) => `${item.id}-${index}`}
                    renderItem={renderCartItem}
                    style={{ marginBottom: 8 }}
                />
            )}

            {/* Alt Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.totalWrap}>
                    <Text style={styles.totalText}>{total} TL</Text>
                </View>
                <TouchableOpacity style={[styles.checkoutBtn, cart.length === 0 && { backgroundColor: '#e8e8e8' }]} disabled={cart.length === 0} onPress={() => navigation.navigate('PaymentScreen')}>
                    <Text style={[styles.checkoutBtnText, cart.length === 0 && { color: '#bfc5cb' }]}>Devam Et</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CartScreen; 
