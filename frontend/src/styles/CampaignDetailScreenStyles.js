import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#275636', paddingHorizontal: 8, paddingVertical: 19 },
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

export default styles; 