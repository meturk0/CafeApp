import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, backgroundColor: '#275636' },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, paddingVertical: 12 },
    editRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: -8 },
    editIconWrap: { padding: 8 },
    infoCard: { backgroundColor: '#fff', borderRadius: 16, margin: 15, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    infoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 7 },
    label: { color: '#888', fontWeight: 'bold', fontSize: 15, width: 80 },
    value: { color: '#222', fontWeight: 'bold', fontSize: 16 },
    input: { borderBottomWidth: 1, borderColor: '#275636', fontSize: 16, color: '#222', minWidth: width * 0.4, paddingVertical: 2 },
    saveBtn: { backgroundColor: '#bfc5cb', paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center', marginRight: 45, marginLeft: 290, borderRadius: 5, marginBottom: 20 },
    saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e53935', borderRadius: 24, paddingVertical: 14, marginHorizontal: 32, marginTop: 15 },
    logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    ordersBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#275636',
        borderRadius: 24,
        paddingVertical: 14,
        marginHorizontal: 32,
        marginTop: 30,
    },
    ordersBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    passwordTextBtn: {
        color: '#888',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 250
    },
});

export default styles; 