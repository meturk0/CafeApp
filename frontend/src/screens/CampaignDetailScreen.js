import React from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styles from '../styles/CampaignDetailScreenStyles';

// Kampanya detay ekranı: Bir kampanyanın detaylarını ve ürünlerini gösterir.
const CampaignDetailScreen = () => {
    // Navigasyon ve route parametreleri
    const navigation = useNavigation();
    const route = useRoute();
    const { campaign } = route.params;
    // Kullanıcı ve sepet contextleri
    const userContext = typeof useUser === 'function' ? useUser() : {};
    const authContext = typeof useAuth === 'function' ? useAuth() : {};
    const user = authContext?.user || userContext?.user;
    const { cart, setCart } = useCart();
    const [showAddedMessage, setShowAddedMessage] = React.useState(false);

    // Eğer kullanıcı yoksa veya müşteri değilse, uyarı göster
    if (!user) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Kullanıcı bilgisi bulunamadı.</Text>
            </View>
        );
    }
    if (user?.role?.toLowerCase() !== 'müşteri') {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Bu ekranı sadece müşteri görebilir.</Text>
            </View>
        );
    }

    // Sepete kampanya ekleme fonksiyonu
    const handleAddCampaignToCart = () => {
        setCart(prevCart => {
            const found = prevCart.find(item => item.type === 'campaign' && item.id === campaign.id);
            if (found) {
                // Eğer kampanya zaten sepette varsa, miktarını artır
                return prevCart.map(item =>
                    item.type === 'campaign' && item.id === campaign.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Sepette yoksa yeni olarak ekle
                return [
                    ...prevCart,
                    {
                        id: campaign.id,
                        type: 'campaign',
                        name: campaign.name,
                        price: campaign.price,
                        quantity: 1,
                        products: campaign.products,
                    },
                ];
            }
        });
        setShowAddedMessage(true);
        setTimeout(() => setShowAddedMessage(false), 1500);
    };

    // Ekran arayüzü
    return (
        <View style={styles.container}>
            {/* Header ve geri butonu */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                    <Icon name="arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.headerTitle}>{campaign.name}</Text>
                </View>
            </View>

            {/* Kampanya açıklaması ve fiyatı */}
            <Text style={styles.description}>{campaign.description}</Text>
            <Text style={styles.detailTitle}>Fiyat</Text>
            <Text style={styles.price}>{campaign.price} TL</Text>
            <Text style={styles.detailTitle}>Kampanya Ürünleri</Text>
            {/* Kampanyaya dahil ürünler listesi */}
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
            {/* Sepete ekle butonu */}
            <TouchableOpacity style={styles.addButton} onPress={handleAddCampaignToCart}>
                <Text style={styles.addButtonText}>Sepete Ekle</Text>
            </TouchableOpacity>
            {/* Sepete eklendi mesajı */}
            {showAddedMessage && (
                <View style={{ position: 'absolute', bottom: 110, alignSelf: 'center', backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 }}>
                    <Text>Sepete eklendi</Text>
                </View>
            )}
        </View>
    );
};

export default CampaignDetailScreen; 