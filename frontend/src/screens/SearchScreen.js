import React, { useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView, TextInput, Dimensions, Modal, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useAddToCart';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createProduct, updateProduct, deleteProductAndRelatedCampaigns } from '../api/product';
import styles from '../styles/SearchScreenStyles';

// Arama ekranı: Ürün arama, sepete ekleme ve admin işlemleri
const SearchScreen = () => {
    // State ve contextler
    const [search, setSearch] = useState('');
    const navigation = useNavigation();
    const { cart, setCart } = useCart();
    const { products, loading, error, refetch } = useProducts();
    const { addToCart } = useAddToCart();
    const userContext = typeof useUser === 'function' ? useUser() : {};
    const authContext = typeof useAuth === 'function' ? useAuth() : {};
    const user = authContext?.user || userContext?.user;

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', imageLink: '', category: '' });
    const [saving, setSaving] = useState(false);

    // Admin ürün işlemleri için state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [actionModalVisible, setActionModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Arama filtresi
    const filteredProducts = products.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    // Ürün detay modalı için state
    const [productDetailModalVisible, setProductDetailModalVisible] = useState(false);
    const [productDetail, setProductDetail] = useState(null);

    // Ürünleri güncelle
    useFocusEffect(
        React.useCallback(() => {
            if (refetch) refetch();
        }, [refetch])
    );

    // Ürün ekleme fonksiyonu
    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.category) {
            Alert.alert('Hata', 'Gerekli Alanları doldurunuz.');
            return;
        }
        setSaving(true);
        try {
            await createProduct({
                name: newProduct.name,
                price: Number(newProduct.price),
                description: newProduct.description || null,
                imageLink: newProduct.imageLink || null,
                category: newProduct.category,
            });
            setModalVisible(false);
            setNewProduct({ name: '', price: '', description: '', imageLink: '', category: '' });
            if (refetch) refetch(); // Ürünleri güncelle
            Alert.alert('Başarılı', 'Ürün eklendi!');
        } catch (err) {
            Alert.alert('Hata', err.message || 'Ürün eklenemedi');
        } finally {
            setSaving(false);
        }
    };

    // Ürün silme fonksiyonu
    const handleDeleteProduct = async (productId) => {
        try {
            await deleteProductAndRelatedCampaigns(productId);
            setActionModalVisible(false);
            if (refetch) refetch(); // Ürünleri güncelle
            Alert.alert('Başarılı', 'Ürün silindi!');
        } catch (err) {
            Alert.alert('Hata', err.message || 'Ürün silinemedi');
        }
    };

    // Ürün güncelleme fonksiyonu
    const handleUpdateProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.category) {
            Alert.alert('Hata', 'Gerekli Alanları doldurunuz.');
            return;
        }
        setSaving(true);
        try {
            await updateProduct(selectedProduct.id, {
                name: newProduct.name,
                price: Number(newProduct.price),
                description: newProduct.description || null,
                imageLink: newProduct.imageLink || null,
                category: newProduct.category,
            });
            setEditMode(false);
            setModalVisible(false);
            setSelectedProduct(null);
            setNewProduct({ name: '', price: '', description: '', imageLink: '', category: '' });
            if (refetch) refetch(); // Ürünleri güncelle
            Alert.alert('Başarılı', 'Ürün güncellendi!');
        } catch (err) {
            Alert.alert('Hata', err.message || 'Ürün güncellenemedi');
        } finally {
            setSaving(false);
        }
    };

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
                    <TouchableOpacity style={styles.addProductButton} onPress={() => setModalVisible(true)}>
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
                        <TouchableOpacity onPress={() => { setProductDetail(item); setProductDetailModalVisible(true); }}>
                            <View style={styles.productCard}>
                                <Image source={item.imageLink ? { uri: item.imageLink } : require('../../assets/coffee.jpg')} style={styles.productImage} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.productName}>{item.name}</Text>
                                    <Text style={styles.productPrice}>{item.price} TL</Text>
                                </View>
                                {user?.role === 'admin' ? (
                                    <TouchableOpacity style={styles.adminIcon} onPress={() => {
                                        setSelectedProduct(item);
                                        setActionModalVisible(true);
                                    }}>
                                        <Icon name="pencil" size={22} color="#275636" />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
                                        <FontAwesome name="plus" size={15} color="white" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
            {/* Ürün Ekle Modalı */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => { setModalVisible(false); setEditMode(false); }}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#275636', marginBottom: 16 }}>{editMode ? 'Ürünü Güncelle' : 'Yeni Ürün Ekle'}</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Ürün Adı "
                            value={newProduct.name}
                            onChangeText={text => setNewProduct(p => ({ ...p, name: text }))}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Fiyat (örn: 120.5)"
                            value={newProduct.price}
                            onChangeText={text => setNewProduct(p => ({ ...p, price: text.replace(/[^0-9.]/g, '') }))}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Açıklama "
                            value={newProduct.description}
                            onChangeText={text => setNewProduct(p => ({ ...p, description: text }))}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Resim Linki (opsiyonel)"
                            value={newProduct.imageLink}
                            onChangeText={text => setNewProduct(p => ({ ...p, imageLink: text }))}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Kategori "
                            value={newProduct.category}
                            onChangeText={text => setNewProduct(p => ({ ...p, category: text }))}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { setModalVisible(false); setEditMode(false); }} style={{ marginRight: 18 }} disabled={saving}>
                                <Text style={{ color: '#888', fontSize: 16 }}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={editMode ? handleUpdateProduct : handleAddProduct} style={{ backgroundColor: '#275636', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8 }} disabled={saving}>
                                {saving ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{editMode ? 'Güncelle' : 'Kaydet'}</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Admin ürün işlemleri için seçenek modalı */}
            <Modal
                visible={actionModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setActionModalVisible(false)}
            >
                <View style={styles.actionModalOverlay}>
                    <View style={styles.actionModalContent}>
                        <Text style={styles.actionModalTitle}>Ürün İşlemleri</Text>
                        <TouchableOpacity
                            style={styles.actionUpdateBtn}
                            onPress={() => {
                                setActionModalVisible(false);
                                setEditMode(true);
                                setModalVisible(true);
                                setNewProduct({
                                    name: selectedProduct.name,
                                    price: String(selectedProduct.price),
                                    description: selectedProduct.description || '',
                                    imageLink: selectedProduct.imageLink || '',
                                    category: selectedProduct.category || '',
                                });
                            }}
                        >
                            <Text style={styles.actionUpdateBtnText}>Düzenle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionDeleteBtn}
                            onPress={() => {
                                setActionModalVisible(false);
                                Alert.alert('Emin misiniz?', 'Bu ürünü silmek istediğinize emin misiniz?', [
                                    { text: 'Vazgeç', style: 'cancel' },
                                    { text: 'Sil', style: 'destructive', onPress: () => handleDeleteProduct(selectedProduct.id) },
                                ]);
                            }}
                        >
                            <Text style={styles.actionDeleteBtnText}>Sil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.actionCancelBtn}
                            onPress={() => setActionModalVisible(false)}
                        >
                            <Text style={styles.actionCancelBtnText}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
                            <Text style={{ color: 'red', fontSize: 16 }}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SearchScreen; 