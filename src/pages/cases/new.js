import CaseForm from '../../components/Case/CaseForm';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

export default function NewCase() {
  return (
    <ProtectedRoute>
      <div className="container">
        <Navbar />
        <CaseForm />
      </div>
    </ProtectedRoute>
  );
}
