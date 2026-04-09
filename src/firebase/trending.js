// src/firebase/trending.js - HIJACKED FOR SUPABASE BRIDGE
import { getCases } from './firestore';

export const getTrendingCases = async () => {
    // For now, just return latest cases as trending
    const cases = await getCases();
    return cases.slice(0, 5);
};