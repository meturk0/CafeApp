import AsyncStorage from '@react-native-async-storage/async-storage';

const authFetch = async (url, options = {}) => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...options, headers });
};

export const registerUser = async ({ name, surname, email, phone_number, password, role = 'Müşteri' }) => {
    try {
        const response = await fetch('http://10.0.2.2:8080/rest/api/user/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, surname, email, phone_number, password, role }),
        });
        if (!response.ok) throw new Error('Kullanıcı oluşturulamadı');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const fetchAllUsers = async () => {
    const response = await authFetch('http://10.0.2.2:8080/rest/api/user/all');
    if (!response.ok) throw new Error('Kullanıcılar alınamadı');
    return response.json();
};

export const updateUser = async (userId, data) => {
    try {
        const response = await authFetch(`http://10.0.2.2:8080/rest/api/user/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Kullanıcı güncellenemedi');
        if (response.status === 204) return true;
        const text = await response.text();
        if (!text) return true;
        return JSON.parse(text);
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await authFetch(`http://10.0.2.2:8080/rest/api/user/delete/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Kullanıcı silinemedi');
        if (response.status === 204) return true;
        try {
            return await response.json();
        } catch {
            return true;
        }
    } catch (error) {
        throw error;
    }
};

export const fetchUserById = async (userId) => {
    try {
        const response = await fetch(`http://10.0.2.2:8080/rest/api/user/${userId}`);
        if (!response.ok) throw new Error('Kullanıcı alınamadı');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await fetch('http://10.0.2.2:8080/rest/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            if (!response.ok) {
                throw new Error(data.message || 'Giriş başarısız');
            }
            return data;
        } catch (jsonErr) {
            throw new Error(text);
        }
    } catch (error) {
        throw error;
    }
}; 