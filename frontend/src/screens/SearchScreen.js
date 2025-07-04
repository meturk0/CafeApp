import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, TextInput, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useAddToCart';
import { useUser } from '../context/UserContext';

const SearchScreen = () => {
    const [search, setSearch] = useState('');
    const navigation = useNavigation();
    const { cart, setCart } = useCart();
    const { products, loading, error } = useProducts();
    const { addToCart } = useAddToCart();
    const { user } = useUser();

    // Arama filtresi
    const filteredProducts = products.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                {user?.role === 'admin' && (
                    <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                        <Icon name="arrow-left" size={26} color="#fff" />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>Arama</Text>
            </View>
            {/* Search Bar */}
            <View style={styles.searchBarRow}>
                <View style={styles.searchBarContainer}>
                    <Icon name="magnify" size={26} color="#888" style={{ marginLeft: 8 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Bugün canın ne istiyor?"
                        placeholderTextColor="#aaa"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                {user?.role === 'admin' && (
                    <TouchableOpacity style={styles.addProductButton} onPress={() => {/* Ürün ekleme modalı açılacak */ }}>
                        <Icon name="plus" size={28} color="#fff" />
                    </TouchableOpacity>
                )}
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
                            {user?.role === 'admin' ? (
                                <TouchableOpacity style={styles.adminIcon} onPress={() => {/* admin işlemi */ }}>
                                    <Icon name="pencil" size={22} color="#275636" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                                    <Text style={styles.addButtonText}>+</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 17,
        backgroundColor: '#275636',
        position: 'relative',
    },
    backIcon: {
        position: 'absolute',
        left: 12,
        top: 42,
        zIndex: 2,
        padding: 4,
    },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, paddingTop: 30 },
    searchBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginTop: 8,
        marginBottom: 8,
    },
    searchBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f3f3',
        borderRadius: 16,
        paddingHorizontal: 8,
        height: 44,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 8,
        color: '#222',
    },
    sectionTitle: { fontWeight: 'bold', fontSize: 16, marginLeft: 16, marginTop: 8, marginBottom: 4, color: '#222' },
    popularSearches: { flexDirection: 'row', marginLeft: 8, marginBottom: 8 },
    popularSearchItem: { backgroundColor: '#f3f3f3', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4 },
    popularSearchText: { color: '#444', fontWeight: '500' },
    productCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginHorizontal: 12,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    productImage: { width: 60, height: 80, resizeMode: 'contain', marginRight: 12 },
    productName: { fontWeight: 'bold', fontSize: 15, marginBottom: 2, color: '#222' },
    productDesc: { color: '#666', fontSize: 13, marginBottom: 2, width: width * 0.38 },
    productPrice: { color: '#275636', fontWeight: 'bold', fontSize: 15 },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    adminIcon: {
        backgroundColor: '#e0f2e9',
        borderRadius: 8,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
    },
    addButton: {
        backgroundColor: '#275636',
        borderRadius: 16,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 'auto',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
    },
    addProductButton: {
        backgroundColor: '#275636',
        borderRadius: 8,
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SearchScreen; 