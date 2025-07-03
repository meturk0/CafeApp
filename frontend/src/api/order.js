export const fetchAllOrders = async () => {
    try {
        const response = await fetch('http://10.0.2.2:8080/rest/api/order/all');
        if (!response.ok) throw new Error('Siparişler alınamadı');
        return await response.json();
    } catch (error) {
        throw error;
    }
}; 