import { useState, useEffect } from 'react';
import { fetchAllCampaigns } from '../api/campaign';

export const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
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

    return { campaigns, loading, error };
}; 