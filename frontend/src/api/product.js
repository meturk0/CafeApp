import AsyncStorage from '@react-native-async-storage/async-storage';

// Token'lı fetch helper
const authFetch = async (url, options = {}) => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...options, headers });
};

// Ürünleri getiren API fonksiyonu
export const fetchAllProducts = async () => {
    const response = await authFetch('http://10.0.2.2:8080/rest/api/product/all');
    if (!response.ok) throw new Error('Ürünler alınamadı');
    return response.json();
};

// Yeni ürün ekleme API fonksiyonu
export const createProduct = async (productData) => {
    try {
        const response = await authFetch('http://10.0.2.2:8080/rest/api/product/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error('Ürün eklenemedi');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// Ürün güncelleme API fonksiyonu
export const updateProduct = async (productId, productData) => {
    try {
        const response = await authFetch(`http://10.0.2.2:8080/rest/api/product/update/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error('Ürün güncellenemedi');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// Ürün silme API fonksiyonu
export const deleteProduct = async (productId) => {
    try {
        const response = await authFetch(`http://10.0.2.2:8080/rest/api/product/delete/${productId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Ürün silinemedi');
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

import { fetchAllCampaigns, deleteCampaign } from './campaign';


export const deleteProductAndRelatedCampaigns = async (productId) => {
    try {

        const campaigns = await fetchAllCampaigns();


        const campaignsToDelete = campaigns.filter(campaign =>
            Array.isArray(campaign.products) &&
            campaign.products.some(p => (typeof p === 'object' ? p.id == productId : p == productId))
        );


        for (const campaign of campaignsToDelete) {
            await deleteCampaign(campaign.id);
        }

        await deleteProduct(productId);

        return true;
    } catch (error) {
        console.error('Silme hatası:', error);
        Alert.alert('Hata', error.message || 'Ürün silinemedi');
        throw error;
    }
}; 