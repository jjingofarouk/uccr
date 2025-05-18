import { useState, useEffect } from 'react';
import { getCases, getCaseById } from '../firebase/firestore';

export const useCases = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      const casesData = await getCases();
      setCases(casesData);
    };
    fetchCases();
  }, []);

  return {
    cases,
    getCaseById: async (id) => await getCaseById(id),
  };
};
