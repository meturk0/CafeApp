import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, TextInput, Dimensions, Modal, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useProducts } from '../hooks/useProducts';
import { useAddToCart } from '../hooks/useAddToCart';
import { useUser } from '../context/UserContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createProduct, updateProduct, deleteProduct } from '../api/product';

const SearchScreen = () => {
    const [search, setSearch] = useState('');
    const navigation = useNavigation();
    const { cart, setCart } = useCart();
    const { products, loading, error, refetch } = useProducts();
    const { addToCart } = useAddToCart();
    const { user } = useUser();

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

    useFocusEffect(
        React.useCallback(() => {
            if (refetch) refetch();
        }, [refetch])
    );

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
            await deleteProduct(productId);
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
                        <View style={styles.productCard}>
                            <Image source={require('../../assets/coffee.jpg')} style={styles.productImage} />
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
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '75%' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#275636', marginBottom: 18 }}>Ürün İşlemleri</Text>
                        <TouchableOpacity
                            style={{ paddingVertical: 12 }}
                            onPress={() => {
                                setActionModalVisible(false);
                                Alert.alert('Emin misiniz?', 'Bu ürünü silmek istediğinize emin misiniz?', [
                                    { text: 'Vazgeç', style: 'cancel' },
                                    { text: 'Sil', style: 'destructive', onPress: () => handleDeleteProduct(selectedProduct.id) },
                                ]);
                            }}
                        >
                            <Text style={{ color: 'red', fontSize: 16 }}>Ürünü Sil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ paddingVertical: 12 }}
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
                            <Text style={{ color: '#275636', fontSize: 16 }}>Ürünü Güncelle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ paddingVertical: 12, alignItems: 'flex-end' }}
                            onPress={() => setActionModalVisible(false)}
                        >
                            <Text style={{ color: '#888', fontSize: 15 }}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        paddingVertical: 20,
        backgroundColor: '#275636',
    },
    backIcon: {
        position: 'absolute',
        left: 12,
        top: 15,
        zIndex: 2,
        padding: 4,
    },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, },
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
    modalInput: {
        height: 40,
        paddingHorizontal: 12,
        backgroundColor: '#f7f7fa',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 12,
        fontSize: 16,
        color: '#222',
    },
});

export default SearchScreen; 