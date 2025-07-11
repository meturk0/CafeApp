import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        backgroundColor: '#275636',
        position: 'relative',
    },
    backIcon: {
        position: 'absolute',
        left: 12,
        top: 15,
        zIndex: 2,
        padding: 4,
    },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, paddingVertical: 15 },
    pickerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#e8e8e8',
        marginBottom: 8,
        marginTop: 12,
    },
    pickerWrapper: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 25,
        overflow: 'hidden',
        marginLeft: 15,
        marginRight: 260,
        height: 36,
        justifyContent: 'center',
    },
    picker: {
        height: 36,
        fontWeight: 'bold',
    },
    orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 12, margin: 10 },
    orderId: { fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
    orderState: {
        color: '#e53935',
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    productsTitle: { marginTop: 8, fontWeight: 'bold', color: '#275636' },
    productName: { marginLeft: 8, color: '#222' },
});

export default styles; 