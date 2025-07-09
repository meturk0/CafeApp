import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { fetchAllCampaigns, deleteCampaign } from '../api/campaign';
import { useFocusEffect } from '@react-navigation/native';

const AdminCampaignScreen = ({ navigation }) => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadCampaigns = async () => {
        setLoading(true);
        try {
            const data = await fetchAllCampaigns();
            setCampaigns(data);
            setError('');
        } catch (err) {
            setError('Kampanyalar alınamadı.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCampaigns();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            loadCampaigns();
        }, [])
    );

    const handleDelete = async (id) => {
        Alert.alert('Kampanyayı Sil', 'Bu kampanyayı silmek istediğinize emin misiniz?', [
            { text: 'Vazgeç', style: 'cancel' },
            {
                text: 'Sil', style: 'destructive', onPress: async () => {
                    try {
                        await deleteCampaign(id);
                        loadCampaigns();
                    } catch (err) {
                        Alert.alert('Hata', err.message || 'Kampanya silinemedi');
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
            <Text style={styles.title}>Kampanyalar</Text>
            <FlatList
                data={campaigns}
                keyExtractor={item => item.id?.toString()}
                renderItem={({ item }) => (
                    <View style={styles.campaignItem}>
                        <Text style={styles.campaignName}>{item.name}</Text>
                        <Text style={styles.campaignPrice}>{item.price} TL</Text>
                        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                            <Text style={{ color: '#fff' }}>Sil</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text>Kampanya bulunamadı.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#f7f7fa', paddingTop: 32 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 16 },
    campaignItem: {
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
    campaignName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
    campaignPrice: { fontSize: 16, color: '#275636', marginLeft: 8 },
    deleteBtn: {
        backgroundColor: '#e53935',
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginLeft: 8,
    },
});

export default AdminCampaignScreen; 