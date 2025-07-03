import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCart } from '../context/CartContext';
import { useNavigation } from '@react-navigation/native';



const CartScreen = () => {
    const { cart, setCart } = useCart();
    const navigation = useNavigation();


    // const [cart, setCart] = useState([]); // Boş sepet için

    const increase = (id) => {
        setCart(cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
    };
    const decrease = (id) => {
        setCart(cart => cart.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
    };
    const remove = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const renderCartItem = ({ item }) => (
        <View style={styles.cartItem}>
            <View style={{ flex: 1 }}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <Text style={styles.cartItemPrice}>{item.price} TL</Text>
            </View>
            <View style={styles.cartItemActions}>
                {(
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

                )}
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

            {/* Adres ve mağaza */}
            <View style={styles.addressRow}>
                <Icon name="shopping-outline" size={22} color="#222" style={{ marginRight: 8 }} />
                <Text style={styles.addressText}>Cafe</Text>
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
                    keyExtractor={item => item.id}
                    renderItem={renderCartItem}
                    style={{ marginBottom: 8 }}
                />
            )}

            {/* Alt Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.totalWrap}>
                    <Text style={styles.totalText}>{total} TL</Text>
                </View>
                <TouchableOpacity style={[styles.checkoutBtn, cart.length === 0 && { backgroundColor: '#e8e8e8' }]} disabled={cart.length === 0}>
                    <Text style={[styles.checkoutBtnText, cart.length === 0 && { color: '#bfc5cb' }]}>Devam Et</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#275636', paddingHorizontal: 16, paddingTop: 45, paddingBottom: 10 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    addressRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, marginBottom: 8 },
    addressText: { fontWeight: 'bold', color: '#222', fontSize: 16 },
    emptyCart: { alignItems: 'center', marginVertical: 32 },
    emptyCartIconWrap: { backgroundColor: '#e8e8e8', borderRadius: 100, padding: 32, marginBottom: 16 },
    emptyCartText: { fontSize: 18, color: '#222', fontWeight: 'bold', marginBottom: 16 },
    cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 12, marginVertical: 6 },
    cartItemName: { fontWeight: 'bold', fontSize: 16, color: '#222' },
    cartItemPrice: { color: '#e53935', fontWeight: 'bold', fontSize: 16, marginTop: 4 },
    cartItemActions: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f3f3', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8 },
    iconBtn: { padding: 4 },
    cartItemQty: { fontWeight: 'bold', fontSize: 16, marginHorizontal: 8 },
    suggestionTitle: { fontWeight: 'bold', fontSize: 16, marginLeft: 16, marginTop: 8, marginBottom: 4, color: '#222' },
    suggestionCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginHorizontal: 8, alignItems: 'center', width: width * 0.38, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    suggestionImage: { width: 70, height: 70, resizeMode: 'contain', marginBottom: 8 },
    suggestionName: { fontWeight: 'bold', fontSize: 15, textAlign: 'center', marginBottom: 4 },
    suggestionPrice: { color: '#222', fontWeight: 'bold', marginBottom: 8 },
    suggestionAddBtn: { backgroundColor: '#6ec6b3', borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 12, right: 12 },
    bottomBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderTopWidth: 1, borderColor: '#eee', position: 'absolute', left: 0, right: 0, bottom: 0 },
    totalWrap: { flex: 1, alignItems: 'flex-start' },
    totalText: { fontWeight: 'bold', fontSize: 22, color: '#222' },
    checkoutBtn: { backgroundColor: '#275636', borderRadius: 24, paddingHorizontal: 32, paddingVertical: 12 },
    checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CartScreen; 
