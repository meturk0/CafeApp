import AsyncStorage from '@react-native-async-storage/async-storage';

const authFetch = async (url, options = {}) => {
    const token = await AsyncStorage.getItem('token');
    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return fetch(url, { ...options, headers });
};

export const fetchAllCampaigns = async () => {
    const response = await authFetch('http://10.0.2.2:8080/rest/api/campaign/all');
    if (!response.ok) throw new Error('Kampanyalar alınamadı');
    return response.json();
};

export const createCampaign = async (campaignData) => {
    try {
        const response = await authFetch('http://10.0.2.2:8080/rest/api/campaign/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(campaignData),
        });
        if (!response.ok) throw new Error('Kampanya eklenemedi');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteCampaign = async (campaignId) => {
    try {
        const response = await authFetch(`http://10.0.2.2:8080/rest/api/campaign/delete/${campaignId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Kampanya silinemedi');
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

export const updateCampaign = async (campaignId, campaignData) => {
    try {
        const response = await authFetch(`http://10.0.2.2:8080/rest/api/campaign/update/${campaignId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(campaignData),
        });
        if (!response.ok) throw new Error('Kampanya güncellenemedi');
        return await response.json();
    } catch (error) {
        throw error;
    }
}; 