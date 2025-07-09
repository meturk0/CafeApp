import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useAddToCart';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const HomeScreen = () => {
    const { selectedCategory, setSelectedCategory, products, categories, loading, error } = useProducts();
    const navigation = useNavigation();
    const { cart, setCart } = useCart();
    const { addToCart } = useAddToCart();



    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoCircle}>
                    <Image source={require('../../assets/cafe.png')} style={styles.headerLogo} />
                </View>
                <Text style={styles.label}>blnk.</Text>
            </View>

            {/* Kategori Butonları */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.categoryButton, selectedCategory === cat && styles.categoryButtonActive]}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {/* Ürünler */}
            {loading ? (
                <Text>Yükleniyor...</Text>
            ) : error ? (
                <Text>Ürünler alınamadı.</Text>
            ) : (
                <FlatList
                    data={products.filter(item => item.category === selectedCategory)}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.productList}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Image source={require('../../assets/coffee.jpg')} style={styles.productImage} />
                            <Text style={styles.productName}>{item.name}</Text>
                            <Text style={styles.productPrice}>{item.price} TL</Text>
                            <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                                <FontAwesome name="plus" size={15} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 16, backgroundColor: '#275636' },
    logoCircle: { width: 35, height: 35, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    headerLogo: { width: 25, height: 25, resizeMode: 'contain' },
    label: { color: '#fff', fontSize: 20, fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: 1 },
    categoryScroll: { marginHorizontal: 8, marginBottom: 8 },
    categoryButton: { height: 40, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8, marginHorizontal: 5, marginVertical: 10, borderWidth: 1, borderColor: '#e0e0e0' },
    categoryButtonActive: { backgroundColor: '#275636', borderColor: '#275636' },
    categoryText: { color: '#333', fontWeight: '500', },
    categoryTextActive: { color: '#ffff', fontWeight: 'bold' },
    productList: { paddingHorizontal: 8, paddingBottom: 80 },
    productCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, margin: 8, alignItems: 'center', width: cardWidth, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    productImage: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 4 },
    productName: { fontWeight: 'bold', fontSize: 15, textAlign: 'center', marginBottom: 4 },
    productPrice: { color: '#275636', fontWeight: 'bold', marginBottom: 8 },
    addButton: { backgroundColor: '#275636', borderRadius: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 12, right: 12 },
    addButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold', alignItems: 'center', justifyContent: 'center', },
});

export default HomeScreen; 