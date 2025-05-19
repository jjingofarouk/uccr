import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import CaseCard from '../components/Case/CaseCard';
import { useCases } from '../hooks/useCases';
import styles from './Home.module.css';

export default function Home() {
  const { cases } = useCases();

  return (
    <>
      <Navbar />
      <Marquee />
      <main className={styles.container}>
        <h1 className={styles.title}>Uganda Medical Cases</h1>
        <div className={styles.caseList}>
          {cases.map((caseData) => (
            <CaseCard key={caseData.id} caseData={caseData} />
          ))}
        </div>
      </main>
    </>
  );
}