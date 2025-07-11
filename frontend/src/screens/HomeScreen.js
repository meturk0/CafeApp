import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useAddToCart';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import styles from '../styles/HomeScreenStyles';

// Ana sayfa: Kategoriler, ürünler ve ürün detay modalı
const HomeScreen = () => {
    // Ürünler, kategoriler ve sepet contextleri
    const { selectedCategory, setSelectedCategory, products, categories, loading, error } = useProducts();
    const navigation = useNavigation();
    const { cart, setCart } = useCart();
    const { addToCart } = useAddToCart();
    const [productDetailModalVisible, setProductDetailModalVisible] = useState(false);
    const [productDetail, setProductDetail] = useState(null);

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
                        <TouchableOpacity onPress={() => { setProductDetail(item); setProductDetailModalVisible(true); }}>
                            <View style={styles.productCard}>
                                <Image source={item.imageLink ? { uri: item.imageLink } : require('../../assets/coffee.jpg')} style={styles.productImage} />
                                <Text style={styles.productName}>{item.name}</Text>
                                <Text style={styles.productPrice}>{item.price} TL</Text>
                                <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                                    <FontAwesome name="plus" size={15} color="white" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
            {/* Ürün Detay Modalı */}
            <Modal
                visible={productDetailModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setProductDetailModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '80%', alignItems: 'center' }}>
                        {productDetail && (
                            <>
                                <Image
                                    source={productDetail.imageLink ? { uri: productDetail.imageLink } : require('../../assets/coffee.jpg')}
                                    style={{ width: 150, height: 150, borderRadius: 12, marginBottom: 12 }}
                                    resizeMode="contain"
                                />
                                <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>{productDetail.name}</Text>
                                <Text style={{ color: '#666', fontSize: 15, marginBottom: 8 }}>{productDetail.description || 'Açıklama yok.'}</Text>
                                <Text style={{ color: '#275636', fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>{productDetail.price} TL</Text>
                            </>
                        )}
                        <TouchableOpacity onPress={() => setProductDetailModalVisible(false)} style={{ marginTop: 8, padding: 8 }}>
                            <Text style={{ color: '#275636', fontWeight: 'bold', fontSize: 16 }}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default HomeScreen; 