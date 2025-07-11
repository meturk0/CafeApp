import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: { flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 16, backgroundColor: '#275636' },
    logoCircle: { width: 35, height: 35, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    headerLogo: { width: 25, height: 25, resizeMode: 'contain' },
    label: { color: '#fff', fontSize: 20, fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: 1 },
    categoryScroll: { marginHorizontal: 8, marginBottom: 8 },
    categoryButton: { height: 40, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 18, paddingVertical: 8, marginHorizontal: 5, marginVertical: 10, borderWidth: 1, borderColor: '#e0e0e0' },
    categoryButtonActive: { backgroundColor: '#275636', borderColor: '#275636' },
    categoryText: { color: '#333', fontWeight: '500', },
    categoryTextActive: { color: '#ffff', fontWeight: 'bold' },
    productList: { paddingHorizontal: 8, paddingBottom: 80 },
    productCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, margin: 8, alignItems: 'center', width: cardWidth, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    productImage: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 4 },
    productName: { fontWeight: 'bold', fontSize: 15, textAlign: 'center', marginBottom: 4 },
    productPrice: { color: '#275636', fontWeight: 'bold', marginBottom: 8 },
    addButton: { backgroundColor: '#275636', borderRadius: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 12, right: 12 },
    addButtonText: { color: '#fff', fontSize: 22, fontWeight: 'bold', alignItems: 'center', justifyContent: 'center', },
});

export default styles; 