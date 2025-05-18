import CaseForm from '../../components/Case/CaseForm';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import styles from '../../styles/globals.css';

export default function NewCase() {
  return (
    <ProtectedRoute>
      <div className="container">
        <Navbar />
        <CaseForm />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
