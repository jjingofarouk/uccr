import CaseCard from '../components/Case/CaseCard';
import { useCases } from '../hooks/useCases';
import Navbar from '../components/Navbar';

export default function Home() {
  const { cases } = useCases();

  return (
    <>
      <Navbar />
      <div className="container">
        <h1>Uganda Medical Cases</h1>
        <div className="case-list">
          {cases.map((caseData) => (
            <CaseCard key={caseData.id} caseData={caseData} />
          ))}
        </div>
      </div>
    </>
  );
}