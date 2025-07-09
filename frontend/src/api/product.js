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

// Yeni ürün ekleme API fonksiyonu
export const createProduct = async (productData) => {
    try {
        const response = await fetch('http://10.0.2.2:8080/rest/api/product/add', {
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
        const response = await fetch(`http://10.0.2.2:8080/rest/api/product/update/${productId}`, {
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
        const response = await fetch(`http://10.0.2.2:8080/rest/api/product/delete/${productId}`, {
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