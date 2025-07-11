import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7fa' },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 32 },
    button: { backgroundColor: '#275636', borderRadius: 10, paddingVertical: 16, paddingHorizontal: 40, marginVertical: 10, alignItems: 'center', width: 220 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 24, width: 320, alignItems: 'center' },
    dateBtn: { backgroundColor: '#f3f3f3', borderRadius: 8, padding: 10, marginVertical: 6, width: 220, alignItems: 'center' },
});

export default styles; 