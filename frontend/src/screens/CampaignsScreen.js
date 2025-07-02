import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCampaigns } from '../hooks/useCampaigns';
import { useNavigation } from '@react-navigation/native';

const CampaignsScreen = () => {
    const { campaigns, loading, error } = useCampaigns();
    const navigation = useNavigation();
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kampanyalar</Text>
            </View>
            {loading ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Yükleniyor...</Text>
            ) : error ? (
                <Text style={{ textAlign: 'center', marginTop: 20 }}>Kampanyalar alınamadı.</Text>
            ) : (
                <FlatList
                    data={campaigns}
                    keyExtractor={item => item.id?.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 24 }}
                />
            )}
        </View>
    );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, backgroundColor: '#275636' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, paddingTop: 30 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 16, marginVertical: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    iconWrap: { backgroundColor: '#e8e8e8', borderRadius: 32, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    name: { fontWeight: 'bold', fontSize: 18, color: '#275636', marginBottom: 4 },
    desc: { color: '#222', fontSize: 15, marginBottom: 4 },
    price: { color: '#e53935', fontWeight: 'bold', fontSize: 16, marginTop: 4 },
});

export default CampaignsScreen; 