import { useState } from 'react';
import { registerUser } from '../api/user';

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async ({ name, surname, email, phone_number, password, role = 'müşteri' }) => {
        setError('');
        setLoading(true);
        try {
            await registerUser({ name, surname, email, phone_number, password, role });
            setLoading(false);
            return true;
        } catch (err) {
            setLoading(false);
            setError('Kayıt başarısız: ' + (err.message || 'Bilinmeyen hata'));
            return false;
        }
    };

    return { handleRegister, loading, error };
}; 