import { useRouter } from 'next/router';
import { useCases } from '../../hooks/useCases';
import CaseDetail from '../../components/Case/CaseDetail';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import styles from '../../styles/globals.css';

export default function CasePage() {
  const router = useRouter();
  const { id } = router.query;
  const { getCaseById } = useCases();
  const caseData = getCaseById(id);

  if (!caseData) return <div>Loading...</div>;

  return (
    <ProtectedRoute>
      <div className="container">
        <Navbar />
        <CaseDetail caseData={caseData} />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
