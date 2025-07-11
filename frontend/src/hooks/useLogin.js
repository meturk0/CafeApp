import { useState } from 'react';
import { loginUser } from '../api/user';

export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (email, password) => {
        setError('');
        setLoading(true);
        try {
            const result = await loginUser(email, password); // { token, user }
            setLoading(false);
            if (result && result.token) {
                return result;
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