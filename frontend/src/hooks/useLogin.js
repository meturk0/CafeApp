import { useState } from 'react';
import { fetchAllUsers } from '../api/user';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (email, password) => {
        setError('');
        setLoading(true);
        try {
            const users = await fetchAllUsers();
            const found = users.find(user => user.email === email && user.password === password);
            setLoading(false);
            if (found) {
                return found;
            } else {
                setError('Geçerli bir mail veya şifre giriniz.');
                return null;
            }
        } catch (err) {
            setLoading(false);
            setError('Giriş başarısız: ' + (err.message || 'Bilinmeyen hata'));
            return null;
        }
    };

    return { handleLogin, loading, error };
}; 