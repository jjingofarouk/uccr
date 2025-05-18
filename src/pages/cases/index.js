import CaseCard from '../../components/Case/CaseCard';
import { useCases } from '../../hooks/useCases';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from '../../styles/globals.css';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

export default function Cases() {
  const { cases } = useCases();

  return (
    <ProtectedRoute>
      <div className="container">
        <Navbar />
        <h1>All Cases</h1>
        <div className="case-list">
          {cases.map((caseData) => (
            <CaseCard key={caseData.id} caseData={caseData} />
          ))}
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
