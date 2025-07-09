import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { fetchAllProducts, deleteProduct } from '../api/product';
import { useFocusEffect } from '@react-navigation/native';

const AdminProductScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchAllProducts();
            setProducts(data);
            setError('');
        } catch (err) {
            setError('Ürünler alınamadı.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadProducts();
        }, [])
    );

    const handleDelete = async (id) => {
        Alert.alert('Ürünü Sil', 'Bu ürünü silmek istediğinize emin misiniz?', [
            { text: 'Vazgeç', style: 'cancel' },
            {
                text: 'Sil', style: 'destructive', onPress: async () => {
                    try {
                        await deleteProduct(id);
                        loadProducts(); // Silme sonrası güncelle
                    } catch (err) {
                        Alert.alert('Hata', err.message || 'Ürün silinemedi');
                    }
                }
            }
        ]);
    };

    if (loading) {
        return <View style={styles.container}><ActivityIndicator size="large" color="#275636" /></View>;
    }
    if (error) {
        return <View style={styles.container}><Text style={{ color: 'red' }}>{error}</Text></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ürünler</Text>
            <FlatList
                data={products}
                keyExtractor={item => item.id?.toString()}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <Text style={styles.productName}>{item.name}</Text>
                        <Text style={styles.productPrice}>{item.price} TL</Text>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                            <Text style={{ color: '#fff' }}>Sil</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text>Ürün bulunamadı.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#f7f7fa', paddingTop: 32 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 16 },
    productItem: {
        width: 320,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 1,
    },
    productName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
    productPrice: { fontSize: 16, color: '#275636', marginLeft: 8 },
    deleteBtn: {
        backgroundColor: '#e53935',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginLeft: 8,
    },
});

export default AdminProductScreen; 