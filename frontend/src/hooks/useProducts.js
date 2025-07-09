import { useState, useEffect, useCallback } from 'react';
import { fetchAllProducts } from '../api/product';

export const useProducts = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(() => {
        setLoading(true);
        fetchAllProducts()
            .then(data => {
                setProducts(data);
                const uniqueCategories = Array.from(new Set(data.map(item => item.category))).filter(Boolean);
                setCategories(uniqueCategories);
                if (uniqueCategories.length > 0) setSelectedCategory(uniqueCategories[0]);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        selectedCategory,
        setSelectedCategory,
        products,
        categories,
        loading,
        error,
        refetch: fetchProducts
    };
}; 