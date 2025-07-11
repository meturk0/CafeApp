import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fa' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#275636', paddingHorizontal: 16, paddingVertical: 19 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    emptyCart: { alignItems: 'center', marginVertical: 32 },
    emptyCartIconWrap: { backgroundColor: '#e8e8e8', borderRadius: 100, padding: 32, marginBottom: 16 },
    emptyCartText: { fontSize: 18, color: '#222', fontWeight: 'bold', marginBottom: 16 },
    cartItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 12, marginVertical: 6 },
    cartItemName: { fontWeight: 'bold', fontSize: 16, color: '#222' },
    cartItemPrice: { color: '#e53935', fontWeight: 'bold', fontSize: 16, marginTop: 4 },
    cartItemActions: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3f3f3', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, marginLeft: 8 },
    iconBtn: { padding: 4 },
    cartItemQty: { fontWeight: 'bold', fontSize: 16, marginHorizontal: 8 },
    suggestionTitle: { fontWeight: 'bold', fontSize: 16, marginLeft: 16, marginTop: 8, marginBottom: 4, color: '#222' },
    suggestionCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginHorizontal: 8, alignItems: 'center', width: width * 0.38, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    suggestionImage: { width: 70, height: 70, resizeMode: 'contain', marginBottom: 8 },
    suggestionName: { fontWeight: 'bold', fontSize: 15, textAlign: 'center', marginBottom: 4 },
    suggestionPrice: { color: '#222', fontWeight: 'bold', marginBottom: 8 },
    suggestionAddBtn: { backgroundColor: '#6ec6b3', borderRadius: 8, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 12, right: 12 },
    bottomBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderTopWidth: 1, borderColor: '#eee', position: 'absolute', left: 0, right: 0, bottom: 0 },
    totalWrap: { flex: 1, alignItems: 'flex-start' },
    totalText: { fontWeight: 'bold', fontSize: 22, color: '#222' },
    checkoutBtn: { backgroundColor: '#275636', borderRadius: 24, paddingHorizontal: 32, paddingVertical: 12 },
    checkoutBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default styles; 