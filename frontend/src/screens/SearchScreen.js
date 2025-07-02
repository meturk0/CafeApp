import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useAddToCart';

const SearchScreen = () => {
    const [search, setSearch] = useState('');
    const navigation = useNavigation();
    const { cart, setCart } = useCart();
    const { products, loading, error } = useProducts();
    const { addToCart } = useAddToCart();


    const handleAddToCart = (product) => {
        const found = cart.find(item => item.id === product.id);
        if (found) {
            setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    // Arama filtresi
    const filteredProducts = products.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Arama</Text>
            </View>
            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                <Icon name="magnify" size={26} color="#888" style={{ marginLeft: 8 }} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Hangi Coffy lezzetini istersin?"
                    placeholderTextColor="#aaa"
                    value={search}
                    onChangeText={setSearch}
                />
            </View>
            {/* Ürünler */}
            {loading ? (
                <Text>Yükleniyor...</Text>
            ) : error ? (
                <Text>Ürünler alınamadı.</Text>
            ) : (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Image source={require('../../assets/coffee.jpg')} style={styles.productImage} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productPrice}>{item.price} TL</Text>
                            </View>
                            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    style={{ marginBottom: 80 }}
                />
            )}
        </View>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, backgroundColor: '#275636' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, paddingTop: 30 },
    searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f3f3', borderRadius: 16, margin: 16, paddingHorizontal: 8, height: 44 },
    searchInput: { flex: 1, fontSize: 16, marginLeft: 8, color: '#222' },
    sectionTitle: { fontWeight: 'bold', fontSize: 16, marginLeft: 16, marginTop: 8, marginBottom: 4, color: '#222' },
    popularSearches: { flexDirection: 'row', marginLeft: 8, marginBottom: 8 },
    popularSearchItem: { backgroundColor: '#f3f3f3', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4 },
    popularSearchText: { color: '#444', fontWeight: '500' },
    productCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 12, marginHorizontal: 12, marginVertical: 6, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    productImage: { width: 60, height: 80, resizeMode: 'contain', marginRight: 12 },
    productName: { fontWeight: 'bold', fontSize: 15, marginBottom: 2, color: '#222' },
    productDesc: { color: '#666', fontSize: 13, marginBottom: 2, width: width * 0.38 },
    productPrice: { color: '#275636', fontWeight: 'bold', fontSize: 15 },
    addButton: { backgroundColor: '#275636', borderRadius: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 12, right: 12 },
    addButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
});

export default SearchScreen; 