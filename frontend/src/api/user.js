export const registerUser = async ({ name, surname, email, password, role = 'admin' }) => {
    try {
        const response = await fetch('http://10.0.2.2:8080/rest/api/user/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, surname, email, password, role }),
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