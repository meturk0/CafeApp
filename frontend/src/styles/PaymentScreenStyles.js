import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f7fa', padding: 24 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#275636', marginBottom: 32 },
    input: {
        width: '100%',
        minHeight: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
        marginBottom: 24,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#275636',
        borderRadius: 10,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default styles; 