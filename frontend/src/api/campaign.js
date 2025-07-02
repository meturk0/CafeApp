export const fetchAllCampaigns = async () => {
    try {
        const response = await fetch('http://10.0.2.2:8080/rest/api/campaign/all');
        if (!response.ok) throw new Error('Kampanyalar alınamadı');
        return await response.json();
    } catch (error) {
        throw error;
    }
}; 