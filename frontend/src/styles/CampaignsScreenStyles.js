import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#e8e8e8' },
    header: { alignItems: 'center', justifyContent: 'center', paddingVertical: 8, backgroundColor: '#275636', marginBottom: 5 },
    headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 1, paddingVertical: 12 },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginHorizontal: 16, marginVertical: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, },
    iconWrap: { backgroundColor: '#e8e8e8', borderRadius: 32, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    name: { fontWeight: 'bold', fontSize: 18, marginBottom: 4 },
    desc: { color: '#222', fontSize: 15, marginBottom: 4 },
    price: { color: '#e53935', fontWeight: 'bold', fontSize: 16, marginTop: 4 },
    backIcon: { position: 'absolute', left: 12, top: 17, zIndex: 2 },
    addButton: { position: 'absolute', right: 12, top: 12, backgroundColor: '#fff', borderRadius: 8, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }
});

export default styles; 