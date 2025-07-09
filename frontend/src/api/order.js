export const fetchAllOrders = async () => {
    try {
        const response = await fetch('http://10.0.2.2:8080/rest/api/order/all');
        if (!response.ok) throw new Error('Siparişler alınamadı');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const response = await fetch('http://10.0.2.2:8080/rest/api/order/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error('Sipariş oluşturulamadı');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const fetchOrderById = async (orderId) => {
    try {
        const response = await fetch(`http://10.0.2.2:8080/rest/api/order/${orderId}`);
        if (!response.ok) throw new Error('Sipariş alınamadı');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateOrder = async (orderId, data) => {
    try {
        const response = await fetch(`http://10.0.2.2:8080/rest/api/order/update/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Sipariş güncellenemedi');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteOrder = async (orderId) => {
    try {
        const response = await fetch(`http://10.0.2.2:8080/rest/api/order/delete/${orderId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Sipariş silinemedi');
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