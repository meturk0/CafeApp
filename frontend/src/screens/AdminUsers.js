import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminUsers = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Kullanıcılar</Text>
            <Text style={styles.subtitle}>Burada kullanıcılar listelenecek.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7fa' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 16 },
    subtitle: { fontSize: 18, color: '#222' },
});

export default AdminUsers; 