import { useState, useEffect } from 'react';
import { getECGs, getECGById } from '../firebase/firestore';

export const useECGs = () => {
    const [ecgs, setEcgs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchECGs = async () => {
        setLoading(true);
        try {
            const fetchedECGs = await getECGs();
            setEcgs(fetchedECGs);
        } catch (error) {
            console.error('Error fetching ECGs:', error);
            setEcgs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchECGs();
    }, []);

    return { ecgs, getECGById, loading, refetch: fetchECGs };
};
