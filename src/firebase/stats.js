// src/firebase/stats.js - HIJACKED FOR SUPABASE BRIDGE
import { createClient } from '../utils/supabase/client';

const supabase = createClient();

export const getUserStats = async (uid) => {
  // Simple count of cases for now
  const { count } = await supabase
    .from('cases')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', uid);
    
  return {
    casesCount: count || 0,
    awardsCount: 0,
    contributionScore: (count || 0) * 10
  };
};

export const subscribeUserStats = (uid, callback) => {
  getUserStats(uid).then(callback);
  return () => {};
};

export const getCaseStatistics = async () => {
  return { totalCases: 0, clinicalCases: 0, ecgCases: 0 };
};