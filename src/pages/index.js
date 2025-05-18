import CaseCard from '../components/Case/CaseCard';
import { useCases } from '../hooks/useCases';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


export default function Home() {
  const { cases } = useCases();

  return (
    <div className="container">
      <Navbar />
      <h1>Uganda Medical Cases</h1>
      <div className="case-list">
        {cases.map((caseData) => (
          <CaseCard key={caseData.id} caseData={caseData} />
        ))}
      </div>
      <Footer />
    </div>
  );
}
