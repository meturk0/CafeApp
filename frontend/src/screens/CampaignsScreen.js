import React from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, TextInput, Modal, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCampaigns } from '../hooks/useCampaigns';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createCampaign } from '../api/campaign';
import { updateCampaign } from '../api/campaign';
import { deleteCampaign } from '../api/campaign';
import styles from '../styles/CampaignsScreenStyles';

// Kampanyalar ekranı: Tüm kampanyaları listeler, admin için ekleme/düzenleme/silme işlemleri sağlar.
const CampaignsScreen = () => {
    // Context ve state tanımlamaları
    const { campaigns, loading, error, refetch } = useCampaigns();
    const navigation = useNavigation();
    const userContext = typeof useUser === 'function' ? useUser() : {};
    const authContext = typeof useAuth === 'function' ? useAuth() : {};
    const user = authContext?.user || userContext?.user;
    const [search, setSearch] = React.useState('');
    const [modalVisible, setModalVisible] = React.useState(false);
    const [newCampaign, setNewCampaign] = React.useState({ name: '', start_date: '', end_date: '', description: '', price: '', products: [] });
    const [saving, setSaving] = React.useState(false);
    const [productSearch, setProductSearch] = React.useState('');
    const [selectedProducts, setSelectedProducts] = React.useState([]);
    const { products: allProducts } = useProducts();
    const [datePickerVisible, setDatePickerVisible] = React.useState(false);
    const [dateType, setDateType] = React.useState('start'); // 'start' veya 'end'
    const [editModalVisible, setEditModalVisible] = React.useState(false);
    const [editCampaign, setEditCampaign] = React.useState(null);
    const [savingEdit, setSavingEdit] = React.useState(false);
    const [selectedEditProducts, setSelectedEditProducts] = React.useState([]);
    const [actionModalVisible, setActionModalVisible] = React.useState(false);
    const [selectedCampaign, setSelectedCampaign] = React.useState(null);

    // Tarih seçici açma/kapama fonksiyonları
    const showDatePicker = (type) => {
        setDateType(type);
        setDatePickerVisible(true);
    };
    const hideDatePicker = () => setDatePickerVisible(false);
    const handleDateConfirm = (date) => {
        const formatted = date.toISOString().slice(0, 10);
        if (editModalVisible) {
            // Düzenleme modunda
            if (dateType === 'start') setEditCampaign(p => ({ ...p, start_date: formatted }));
            else setEditCampaign(p => ({ ...p, end_date: formatted }));
        } else {
            // Yeni kampanya ekleme modunda
            if (dateType === 'start') setNewCampaign(p => ({ ...p, start_date: formatted }));
            else setNewCampaign(p => ({ ...p, end_date: formatted }));
        }
        hideDatePicker();
    };

    // Ürün arama ve seçim işlemleri
    const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
    const toggleProduct = (product) => {
        setSelectedProducts(prev => prev.some(p => p.id === product.id)
            ? prev.filter(p => p.id !== product.id)
            : [...prev, product]
        );
    };

    // Yeni kampanya ekleme fonksiyonu
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

    // Kampanya düzenleme işlemleri
    const handleEdit = (campaign) => {
        setEditCampaign({
            ...campaign,
            price: String(campaign.price),
        });
        setSelectedEditProducts(campaign.products || []);
        setEditModalVisible(true);
    };
    const handleActionModal = (campaign) => {
        setSelectedCampaign(campaign);
        setActionModalVisible(true);
    };
    const handleUpdateCampaign = async () => {
        if (!editCampaign.name || !editCampaign.price || selectedEditProducts.length === 0) {
            alert('Gerekli alanları doldurun ve en az bir ürün seçin.');
            return;
        }
        setSavingEdit(true);
        try {
            await updateCampaign(editCampaign.id, {
                name: editCampaign.name,
                start_date: editCampaign.start_date,
                end_date: editCampaign.end_date,
                description: editCampaign.description,
                price: Number(editCampaign.price),
                products: selectedEditProducts.map(p => ({ id: p.id })),
            });
            setEditModalVisible(false);
            if (refetch) refetch();
            alert('Kampanya güncellendi!');
        } catch (err) {
            alert('Kampanya güncellenemedi');
        } finally {
            setSavingEdit(false);
        }
    };

    // Kampanya silme işlemi
    const handleDelete = async () => {
        setActionModalVisible(false);
        Alert.alert('Emin misiniz?', 'Bu kampanyayı silmek istediğinize emin misiniz?', [
            { text: 'Vazgeç', style: 'cancel' },
            {
                text: 'Sil', style: 'destructive', onPress: async () => {
                    try {
                        await deleteCampaign(selectedCampaign.id);
                        if (refetch) refetch();
                        Alert.alert('Başarılı', 'Kampanya silindi!');
                    } catch (err) {
                        Alert.alert('Hata', err.message || 'Kampanya silinemedi');
                    }
                }
            },
        ]);
    };

    // Kampanya kartı render fonksiyonu
    const renderItem = ({ item }) => {
        const isAdmin = user?.role.toLowerCase() === 'admin';
        const isCustomer = user?.role?.toLowerCase() === 'müşteri';
        const cardContent = (
            <View style={styles.card}>
                <View style={styles.iconWrap}>
                    <Icon name="gift-outline" size={36} color="#275636" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.desc}>{item.description}</Text>
                    <Text style={styles.price}>{item.price} TL</Text>
                </View>
                {isAdmin && (
                    <TouchableOpacity onPress={() => handleActionModal(item)} style={{ backgroundColor: '#e0f2e9', borderRadius: 8, padding: 6, }}>
                        <Icon name="pencil" size={22} color="#275636" />
                    </TouchableOpacity>
                )}
            </View>
        );
        if (isCustomer) {
            return (
                <TouchableOpacity onPress={() => navigation.navigate('CampaignDetail', { campaign: item })}>
                    {cardContent}
                </TouchableOpacity>
            );
        }
        return cardContent;
    };

    // Arama filtresi
    const filteredCampaigns = user?.role === 'admin' && search
        ? campaigns.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        : campaigns;

    // Kampanyalar ekranı arayüzü
    useFocusEffect(
        React.useCallback(() => {
            if (refetch) refetch();
        }, [refetch])
    );

    return (
        <View style={styles.container}>
            {/* Header ve ekle butonu */}
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
            {/* Arama barı */}
            {(
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
            {/* Kampanya listesi */}
            {loading ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Yükleniyor...</Text>
            ) : error ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Kampanyalar alınamadı.</Text>
            ) : (
                <FlatList
                    data={search ? campaigns.filter(item => item.name.toLowerCase().includes(search.toLowerCase())) : campaigns}
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
            {/* Kampanya Düzenle Modalı */}
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
                                    <TouchableOpacity key={product.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6 }} onPress={() => {
                                        setSelectedEditProducts(prev => prev.some(p => p.id === product.id)
                                            ? prev.filter(p => p.id !== product.id)
                                            : [...prev, product]
                                        );
                                    }}>
                                        <Icon name={selectedEditProducts.some(p => p.id === product.id) ? 'checkbox-marked' : 'checkbox-blank-outline'} size={22} color="#275636" />
                                        <Text style={{ marginLeft: 8 }}>{product.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
                            {selectedEditProducts.map(p => (
                                <View key={p.id} style={{ backgroundColor: '#e0f2e9', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4, margin: 2 }}>
                                    <Text style={{ color: '#275636' }}>{p.name}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)} style={{ marginRight: 18 }} disabled={savingEdit}>
                                <Text style={{ color: '#888', fontSize: 16 }}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUpdateCampaign} style={{ backgroundColor: '#275636', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 8 }} disabled={savingEdit}>
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Kaydet</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Kampanya İşlemleri Modalı */}
            <Modal
                visible={actionModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setActionModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '65%' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#222', marginBottom: 18, textAlign: 'center' }}>Kampanya İşlemleri</Text>
                        <TouchableOpacity style={{ backgroundColor: '#275636', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 10 }} onPress={() => { setActionModalVisible(false); handleEdit(selectedCampaign); }}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Düzenle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#e53935', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 10 }} onPress={handleDelete}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Sil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#f3f3f3', borderRadius: 8, paddingVertical: 10, marginHorizontal: 80, alignItems: 'center' }} onPress={() => setActionModalVisible(false)}>
                            <Text style={{ color: '#888', fontSize: 15 }}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default CampaignsScreen; 