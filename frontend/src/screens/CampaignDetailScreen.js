import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAddToCart } from '../hooks/useAddToCart';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { Modal } from 'react-native';
import { deleteCampaign } from '../api/campaign';
import { Alert } from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { updateCampaign } from '../api/campaign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useCart } from '../context/CartContext';

const CampaignDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { campaign } = route.params;
    const { addToCart, addToCartMany } = useAddToCart();
    const { user } = useUser();
    const [actionModalVisible, setActionModalVisible] = React.useState(false);
    const { products: allProducts } = useProducts();
    const [editModalVisible, setEditModalVisible] = React.useState(false);
    const [editCampaign, setEditCampaign] = React.useState(null);
    const [saving, setSaving] = React.useState(false);
    const [productSearch, setProductSearch] = React.useState('');
    const [selectedProducts, setSelectedProducts] = React.useState([]);
    const [datePickerVisible, setDatePickerVisible] = React.useState(false);
    const [dateType, setDateType] = React.useState('start');
    const { cart, setCart } = useCart();

    const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
    const toggleProduct = (product) => {
        setSelectedProducts(prev => prev.some(p => p.id === product.id)
            ? prev.filter(p => p.id !== product.id)
            : [...prev, product]
        );
    };
    const showDatePicker = (type) => {
        setDateType(type);
        setDatePickerVisible(true);
    };
    const hideDatePicker = () => setDatePickerVisible(false);
    const handleDateConfirm = (date) => {
        const formatted = date.toISOString().slice(0, 10);
        setEditCampaign(p => ({ ...p, [dateType === 'start' ? 'start_date' : 'end_date']: formatted }));
        hideDatePicker();
    };



    const handleAddCampaignToCart = () => {
        setCart(prevCart => {
            const found = prevCart.find(item => item.type === 'campaign' && item.id === campaign.id);
            if (found) {
                return prevCart.map(item =>
                    item.type === 'campaign' && item.id === campaign.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
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
    };

    const handleEdit = () => {
        setActionModalVisible(false);
        setEditCampaign({
            name: campaign.name,
            start_date: campaign.start_date,
            end_date: campaign.end_date,
            description: campaign.description,
            price: String(campaign.price),
        });
        setSelectedProducts(campaign.products || []);
        setProductSearch('');
        setEditModalVisible(true);
    };
    const handleUpdateCampaign = async () => {
        if (!editCampaign.name || !editCampaign.price || selectedProducts.length === 0) {
            Alert.alert('Gerekli alanları doldurun ve en az bir ürün seçin.');
            return;
        }
        setSaving(true);
        try {
            await updateCampaign(campaign.id, {
                name: editCampaign.name,
                start_date: editCampaign.start_date,
                end_date: editCampaign.end_date,
                description: editCampaign.description,
                price: Number(editCampaign.price),
                products: selectedProducts.map(p => ({ id: p.id })),
            });
            setEditModalVisible(false);
            Alert.alert('Başarılı', 'Kampanya güncellendi!');
            navigation.goBack();
        } catch (err) {
            Alert.alert('Hata', err.message || 'Kampanya güncellenemedi');
        } finally {
            setSaving(false);
        }
    };
    const handleDelete = () => {
        setActionModalVisible(false);
        Alert.alert('Emin misiniz?', 'Bu kampanyayı silmek istediğinize emin misiniz?', [
            { text: 'Vazgeç', style: 'cancel' },
            {
                text: 'Sil', style: 'destructive', onPress: async () => {
                    try {
                        await deleteCampaign(campaign.id);
                        Alert.alert('Başarılı', 'Kampanya silindi!');
                        navigation.goBack();
                    } catch (err) {
                        Alert.alert('Hata', err.message || 'Kampanya silinemedi');
                    }
                }
            },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                    <Icon name="arrow-left" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{campaign.name}</Text>
                {user?.role === 'admin' && (
                    <TouchableOpacity onPress={() => setActionModalVisible(true)}>
                        <Icon name="pencil" size={24} color="#fff" style={{ marginLeft: 12 }} />
                    </TouchableOpacity>
                )}
            </View>

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
            {user?.role !== 'admin' && (
                <TouchableOpacity style={styles.addButton} onPress={handleAddCampaignToCart}>
                    <Text style={styles.addButtonText}>Sepete Ekle</Text>
                </TouchableOpacity>
            )}
            <Modal
                visible={actionModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setActionModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '75%' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#275636', marginBottom: 18 }}>Kampanya İşlemleri</Text>
                        <TouchableOpacity style={{ paddingVertical: 12 }} onPress={handleEdit}>
                            <Text style={{ color: '#275636', fontSize: 16 }}>Düzenle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingVertical: 12 }} onPress={handleDelete}>
                            <Text style={{ color: 'red', fontSize: 16 }}>Sil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ paddingVertical: 12, alignItems: 'flex-end' }} onPress={() => setActionModalVisible(false)}>
                            <Text style={{ color: '#888', fontSize: 15 }}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#275636', marginBottom: 16 }}>Kampanyayı Düzenle</Text>
                        <TextInput
                            style={{ height: 40, paddingHorizontal: 12, backgroundColor: '#f7f7fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 12, fontSize: 16, color: '#222' }}
                            placeholder="Kampanya Adı"
                            value={editCampaign?.name || ''}
                            onChangeText={text => setEditCampaign(p => ({ ...p, name: text }))}
                        />
                        <TouchableOpacity onPress={() => showDatePicker('start')} style={{ marginBottom: 12 }}>
                            <View style={{ height: 40, justifyContent: 'center', backgroundColor: '#f7f7fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 12 }}>
                                <Text style={{ color: editCampaign?.start_date ? '#222' : '#aaa', fontSize: 16 }}>
                                    {editCampaign?.start_date ? editCampaign.start_date : 'Başlangıç Tarihi Seç'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => showDatePicker('end')} style={{ marginBottom: 12 }}>
                            <View style={{ height: 40, justifyContent: 'center', backgroundColor: '#f7f7fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 12 }}>
                                <Text style={{ color: editCampaign?.end_date ? '#222' : '#aaa', fontSize: 16 }}>
                                    {editCampaign?.end_date ? editCampaign.end_date : 'Bitiş Tarihi Seç'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={datePickerVisible}
                            mode="date"
                            onConfirm={handleDateConfirm}
                            onCancel={hideDatePicker}
                        />
                        <TextInput
                            style={{ height: 40, paddingHorizontal: 12, backgroundColor: '#f7f7fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 12, fontSize: 16, color: '#222' }}
                            placeholder="Açıklama"
                            value={editCampaign?.description || ''}
                            onChangeText={text => setEditCampaign(p => ({ ...p, description: text }))}
                        />
                        <TextInput
                            style={{ height: 40, paddingHorizontal: 12, backgroundColor: '#f7f7fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 12, fontSize: 16, color: '#222' }}
                            placeholder="Fiyat"
                            value={editCampaign?.price || ''}
                            onChangeText={text => setEditCampaign(p => ({ ...p, price: text.replace(/[^0-9.]/g, '') }))}
                            keyboardType="numeric"
                        />
                        <Text style={{ fontWeight: 'bold', marginBottom: 6, marginTop: 8 }}>Ürün Seç</Text>
                        <TextInput
                            style={{ height: 38, paddingHorizontal: 10, backgroundColor: '#f3f3f3', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 8, fontSize: 15, color: '#222' }}
                            placeholder="Ürün ismine göre ara"
                            value={productSearch}
                            onChangeText={setProductSearch}
                        />
                        <View style={{ maxHeight: 120, marginBottom: 10 }}>
                            <ScrollView>
                                {filteredProducts.map(product => (
                                    <TouchableOpacity key={product.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }} onPress={() => toggleProduct(product)}>
                                        <Icon name={selectedProducts.some(p => p.id === product.id) ? 'checkbox-marked' : 'checkbox-blank-outline'} size={22} color="#275636" />
                                        <Text style={{ marginLeft: 8 }}>{product.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
                            {selectedProducts.map(p => (
                                <View key={p.id} style={{ backgroundColor: '#e0f2e9', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, margin: 2 }}>
                                    <Text style={{ color: '#275636' }}>{p.name}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ marginRight: 18 }} disabled={saving}>
                                <Text style={{ color: '#888', fontSize: 16 }}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUpdateCampaign} style={{ backgroundColor: '#275636', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8 }} disabled={saving}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Kaydet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#275636', paddingHorizontal: 16, paddingVertical: 19 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    detailTitle: { fontWeight: 'bold', fontSize: 22, marginTop: 16, marginBottom: 4, color: '#275636', marginHorizontal: 8 },
    description: { color: '#222', fontWeight: 'bold', fontSize: 18, marginVertical: 8, marginHorizontal: 8 },
    price: { color: '#e53935', fontWeight: 'bold', fontSize: 18, marginBottom: 8, marginHorizontal: 15 },
    productItem: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginVertical: 4, marginHorizontal: 8 },
    productName: { fontSize: 15, color: '#222' },
    addButton: { backgroundColor: '#275636', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 7, alignItems: 'center', marginTop: 24, marginHorizontal: 60, marginBottom: 30 },
    addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    backIcon: { position: 'absolute', left: 12, top: 17, zIndex: 2 },
});

export default CampaignDetailScreen; 