import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCampaigns } from '../hooks/useCampaigns';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { useProducts } from '../hooks/useProducts';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createCampaign } from '../api/campaign';

const CampaignsScreen = () => {
    const { campaigns, loading, error, refetch } = useCampaigns();
    const navigation = useNavigation();
    const { user } = useUser();
    const [search, setSearch] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [newCampaign, setNewCampaign] = React.useState({ name: '', start_date: '', end_date: '', description: '', price: '', products: [] });
    const [saving, setSaving] = React.useState(false);
    const [productSearch, setProductSearch] = React.useState('');
    const [selectedProducts, setSelectedProducts] = React.useState([]);
    const { products: allProducts } = useProducts();
    const [datePickerVisible, setDatePickerVisible] = React.useState(false);
    const [dateType, setDateType] = React.useState('start'); // 'start' veya 'end'

    const showDatePicker = (type) => {
        setDateType(type);
        setDatePickerVisible(true);
    };
    const hideDatePicker = () => setDatePickerVisible(false);
    const handleDateConfirm = (date) => {
        const formatted = date.toISOString().slice(0, 10);
        if (dateType === 'start') setNewCampaign(p => ({ ...p, start_date: formatted }));
        else setNewCampaign(p => ({ ...p, end_date: formatted }));
        hideDatePicker();
    };

    // Ürün arama ve seçim
    const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
    const toggleProduct = (product) => {
        setSelectedProducts(prev => prev.some(p => p.id === product.id)
            ? prev.filter(p => p.id !== product.id)
            : [...prev, product]
        );
    };

    const handleAddCampaign = async () => {
        if (!newCampaign.name || !newCampaign.price || selectedProducts.length === 0) {
            alert('Gerekli alanları doldurun ve en az bir ürün seçin.');
            return;
        }
        setSaving(true);
        try {
            const body = {
                name: newCampaign.name,
                start_date: newCampaign.start_date,
                end_date: newCampaign.end_date,
                description: newCampaign.description,
                price: Number(newCampaign.price),
                products: selectedProducts.map(p => ({ id: p.id })),
            };
            await createCampaign(body);
            setModalVisible(false);
            setNewCampaign({ name: '', start_date: '', end_date: '', description: '', price: '', products: [] });
            setSelectedProducts([]);
            if (refetch) refetch(); 
            alert('Kampanya eklendi!');
        } catch (err) {
            alert('Kampanya eklenemedi');
        } finally {
            setSaving(false);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('CampaignDetail', { campaign: item })}>
            <View style={styles.card}>
                <View style={styles.iconWrap}>
                    <Icon name="gift-outline" size={36} color="#275636" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.desc}>{item.description}</Text>
                    <Text style={styles.price}>{item.price} TL</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    // Arama filtresi
    const filteredCampaigns = user?.role === 'admin' && search
        ? campaigns.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        : campaigns;

    useFocusEffect(
        React.useCallback(() => {
            if (refetch) refetch();
        }, [refetch])
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {user?.role === 'admin' && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
                        <Icon name="arrow-left" size={28} color="#fff" />
                    </TouchableOpacity>
                )}
                <Text style={styles.headerTitle}>Kampanyalar</Text>
                {user?.role === 'admin' && (
                    <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                        <Icon name="plus" size={28} color="#275636" />
                    </TouchableOpacity>
                )}
            </View>
            {user?.role === 'admin' && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginTop: 8, marginBottom: 8 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f3f3', borderRadius: 16, paddingHorizontal: 8, height: 44, marginRight: 8 }}>
                        <Icon name="magnify" size={26} color="#888" style={{ marginLeft: 8 }} />
                        <TextInput
                            style={{ flex: 1, fontSize: 16, marginLeft: 8, color: '#222' }}
                            placeholder="Kampanya Ara"
                            placeholderTextColor="#aaa"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                </View>
            )}
            {loading ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Yükleniyor...</Text>
            ) : error ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Kampanyalar alınamadı.</Text>
            ) : (
                <FlatList
                    data={user?.role === 'admin' && search ? campaigns.filter(item => item.name.toLowerCase().includes(search.toLowerCase())) : campaigns}
                    keyExtractor={item => item.id?.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 24 }}
                />
            )}
            {/* Kampanya Ekle Modalı */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '90%' }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#275636', marginBottom: 16 }}>Yeni Kampanya Ekle</Text>
                        <TextInput
                            style={{ height: 40, paddingHorizontal: 12, backgroundColor: '#f7f7fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 12, fontSize: 16, color: '#222' }}
                            placeholder="Kampanya Adı"
                            value={newCampaign.name}
                            onChangeText={text => setNewCampaign(p => ({ ...p, name: text }))}
                        />
                        <TouchableOpacity onPress={() => showDatePicker('start')} style={{ marginBottom: 12 }}>
                            <View style={{ height: 40, justifyContent: 'center', backgroundColor: '#f7f7fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 12 }}>
                                <Text style={{ color: newCampaign.start_date ? '#222' : '#aaa', fontSize: 16 }}>
                                    {newCampaign.start_date ? newCampaign.start_date : 'Başlangıç Tarihi Seç'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => showDatePicker('end')} style={{ marginBottom: 12 }}>
                            <View style={{ height: 40, justifyContent: 'center', backgroundColor: '#f7f7fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', paddingHorizontal: 12 }}>
                                <Text style={{ color: newCampaign.end_date ? '#222' : '#aaa', fontSize: 16 }}>
                                    {newCampaign.end_date ? newCampaign.end_date : 'Bitiş Tarihi Seç'}
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
                            value={newCampaign.description}
                            onChangeText={text => setNewCampaign(p => ({ ...p, description: text }))}
                        />
                        <TextInput
                            style={{ height: 40, paddingHorizontal: 12, backgroundColor: '#f7f7fa', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 12, fontSize: 16, color: '#222' }}
                            placeholder="Fiyat"
                            value={newCampaign.price}
                            onChangeText={text => setNewCampaign(p => ({ ...p, price: text.replace(/[^0-9.]/g, '') }))}
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
                            <TouchableOpacity onPress={() => { setModalVisible(false); setNewCampaign({ name: '', start_date: '', end_date: '', description: '', price: '', products: [] }); setSelectedProducts([]); }} style={{ marginRight: 18 }} disabled={saving}>
                                <Text style={{ color: '#888', fontSize: 16 }}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAddCampaign} style={{ backgroundColor: '#275636', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8 }} disabled={saving}>
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
    header: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, backgroundColor: '#275636', marginBottom: 5 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, paddingVertical: 12 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 16, marginVertical: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, },
    iconWrap: { backgroundColor: '#e8e8e8', borderRadius: 32, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    name: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
    desc: { color: '#222', fontSize: 15, marginBottom: 4 },
    price: { color: '#e53935', fontWeight: 'bold', fontSize: 16, marginTop: 4 },
    backIcon: { position: 'absolute', left: 12, top: 17, zIndex: 2 },
    addButton: { position: 'absolute', right: 12, top: 12, backgroundColor: '#fff', borderRadius: 8, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }
});

export default CampaignsScreen; 