import { useState, useCallback } from 'react';
import { fetchAllOrders } from '../api/order';

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(() => {
        setLoading(true);
        fetchAllOrders()
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    return { orders, loading, error, fetchOrders };
}; 