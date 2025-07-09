import { useState, useEffect, useCallback } from 'react';
import { fetchAllCampaigns } from '../api/campaign';

export const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCampaigns = useCallback(() => {
        setLoading(true);
        fetchAllCampaigns()
            .then(data => {
                setCampaigns(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    return { campaigns, loading, error, refetch: fetchCampaigns };
}; 