import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f7fa', padding: 16 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 10, textAlign: 'center' },
    infoCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 16, marginTop: 15, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    infoLabel: { color: '#888', fontSize: 15, flex: 1 },
    infoValue: { color: '#222', fontWeight: 'bold', fontSize: 15, flex: 1, textAlign: 'right' },
    subtitle: { fontWeight: 'bold', fontSize: 16, marginTop: 16, marginBottom: 4, color: '#275636' },
    productItem: { backgroundColor: '#fff', borderRadius: 8, padding: 10, marginVertical: 4, flexDirection: 'row', alignItems: 'center' },
    productName: { fontSize: 15, color: '#222', flex: 1 },
    productCount: { color: '#888', fontWeight: 'bold', fontSize: 15, marginHorizontal: 8 },
    productTotal: { color: '#e53935', fontWeight: 'bold', fontSize: 15, minWidth: 70, textAlign: 'right' },
    info: { color: '#222', fontSize: 15, marginBottom: 2 },
    orderTotalWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 15, backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    orderTotalLabel: { fontSize: 18, color: '#888', fontWeight: 'bold' },
    orderTotalValue: { fontSize: 22, color: '#e53935', fontWeight: 'bold' },
    statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, marginTop: 10 },
    statusEditBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e8f5e9', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12 },
    statusEditText: { color: '#275636', fontWeight: 'bold', fontSize: 15, marginLeft: 6 },
    currentStatus: { color: '#222', fontWeight: 'bold', fontSize: 15 },
    inlineStatusBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        marginTop: 0,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        alignItems: 'center'
    },
    modalOption: { paddingVertical: 10, paddingHorizontal: 16, width: '100%', alignItems: 'center', borderRadius: 8, marginBottom: 6 },
    modalOptionText: { fontSize: 16, color: '#222' },
    modalCancel: { marginTop: 10 },
    modalCancelText: { color: '#e53935', fontWeight: 'bold', fontSize: 16 },
    backBtn: { position: 'absolute', top: 16, left: 10, zIndex: 10, backgroundColor: '#fff', borderRadius: 20, padding: 4, elevation: 2 },
    deleteBtn: {
        backgroundColor: '#e53935',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    deleteBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default styles; 