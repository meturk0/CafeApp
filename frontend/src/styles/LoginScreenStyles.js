import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f7f7fa', justifyContent: 'center' },
    logoContainer: { alignItems: 'center', marginBottom: 32 },
    logo: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 8 },
    title: { color: '#275636', fontSize: 25, fontFamily: 'sans-serif', fontWeight: 'bold', letterSpacing: 1 },
    form: { paddingHorizontal: 32 },
    input: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
    button: { backgroundColor: '#275636', borderRadius: 10, padding: 14, alignItems: 'center', marginTop: 8 },
    buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    error: { color: 'red', marginBottom: 8, textAlign: 'center' },
    registerLink: { marginTop: 18, alignItems: 'center' },
    registerText: { color: '#275636', fontWeight: 'bold' },
});

export default styles; 