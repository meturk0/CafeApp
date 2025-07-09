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
    try {
        const response = await fetch('http://10.0.2.2:8080/rest/api/user/all');
        if (!response.ok) throw new Error('Kullanıcılar alınamadı');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userId, data) => {
    try {
        const response = await fetch(`http://10.0.2.2:8080/rest/api/user/update/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Kullanıcı güncellenemedi');
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await fetch(`http://10.0.2.2:8080/rest/api/user/delete/${userId}`, {
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