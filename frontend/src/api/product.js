// Ürünleri getiren API fonksiyonu
export const fetchAllProducts = async () => {
    try {
        const response = await fetch('http://10.0.2.2:8080/rest/api/product/all');
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.log('Ürünler alınamadı:', error);
        throw error;
    }
}; 