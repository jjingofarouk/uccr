// pages/cases/[id].jsx
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react'; // Added useState and useEffect imports
import { useCases } from '../../hooks/useCases';
import CaseDetail from '../../components/Case/CaseDetail';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import styles from '../../styles/casePage.module.css';

export default function CasePage() {
  const router = useRouter();
  const { id } = router.query;
  const { getCaseById } = useCases();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchCase = async () => {
        const data = await getCaseById(id);
        setCaseData(data);
        setLoading(false);
      };
      fetchCase();
    }
  }, [id, getCaseById]);

  if (loading) return <div>Loading...</div>;
  if (!caseData) return <div>Case not found</div>;

  return (
    <ProtectedRoute>
      <div className={styles.container}>

        <CaseDetail caseData={caseData} />
      </div>
    </ProtectedRoute>
  );
}