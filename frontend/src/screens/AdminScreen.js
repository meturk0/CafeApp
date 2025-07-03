import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AdminScreen = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Paneli</Text>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminUsers')}>
                <Text style={styles.buttonText}>Kullanıcılar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminProducts')}>
                <Text style={styles.buttonText}>Ürünler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AdminCampaigns')}>
                <Text style={styles.buttonText}>Kampanyalar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7fa' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 32 },
    button: { backgroundColor: '#275636', borderRadius: 10, paddingVertical: 16, paddingHorizontal: 40, marginVertical: 10, alignItems: 'center', width: 220 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
});

export default AdminScreen; 