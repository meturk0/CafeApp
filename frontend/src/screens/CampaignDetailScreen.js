import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAddToCart } from '../hooks/useAddToCart';
import { useNavigation, useRoute } from '@react-navigation/native';

const CampaignDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { campaign } = route.params;
    const { addToCart, addToCartMany } = useAddToCart();

    const handleAddCampaignToCart = () => {
        const products = campaign.products;
        const totalProductPrice = products.reduce((sum, p) => sum + (p.price || 0), 0);
        let remaining = campaign.price;
        let itemsToAdd = [];
        products.forEach((product, idx) => {
            let proportionalPrice;
            if (idx === products.length - 1) {
                // Son ürüne kalan tüm fiyatı ver (küsurat hatası olmasın)
                proportionalPrice = Number(remaining.toFixed(2));
            } else {
                const oran = (product.price || 0) / totalProductPrice;
                proportionalPrice = Number((campaign.price * oran).toFixed(2));
                remaining -= proportionalPrice;
            }
            itemsToAdd.push({
                id: `campaign${campaign.id}-product${product.id}`,
                name: product.name,
                price: proportionalPrice,
                quantity: 1,
                type: 'campaign-product',
            });
        });
        console.log('Sepete ekleniyor:', itemsToAdd);
        addToCartMany(itemsToAdd);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{campaign.name}</Text>
            </View>
            <Text style={styles.detailTitle}>Açıklama</Text>
            <Text style={styles.description}>{campaign.description}</Text>
            <Text style={styles.detailTitle}>Fiyat</Text>
            <Text style={styles.price}>{campaign.price} TL</Text>
            <Text style={styles.detailTitle}>Kampanya Ürünleri</Text>
            <FlatList
                data={campaign.products}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.productItem}>
                        <Text style={styles.productName}>{item.name}</Text>
                    </View>
                )}
                extraData={campaign.products}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddCampaignToCart}>
                <Text style={styles.addButtonText}>Kampanyayı Sepete Ekle</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8', padding: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#275636', paddingHorizontal: 16, paddingTop: 45, paddingBottom: 10 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    detailTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 16, marginBottom: 4, color: '#275636' },
    description: { color: '#222', fontSize: 15, marginBottom: 8 },
    price: { color: '#e53935', fontWeight: 'bold', fontSize: 18, marginBottom: 8 },
    productItem: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginVertical: 4 },
    productName: { fontSize: 15, color: '#222' },
    addButton: { backgroundColor: '#275636', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 24 },
    addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default CampaignDetailScreen; 