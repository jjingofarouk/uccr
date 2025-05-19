import { useCases } from '../../hooks/useCases';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import CaseCard from '../../components/Case/CaseCard';
import styles from './case.module.css'; // Import the CSS module

export default function Cases() {
  const { cases } = useCases();

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Navbar />
        <h1 className={styles.title}>All Cases</h1>
        <div className={styles['case-list']}>
          {cases.map((caseData) => (
            <CaseCard key={caseData.id} caseData={caseData} />
          ))}
        </div>

      </div>
    </ProtectedRoute>
  );
}