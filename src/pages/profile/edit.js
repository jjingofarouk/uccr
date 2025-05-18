import ProfileEdit from '../../components/Profile/ProfileEdit';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import styles from '../../styles/globals.css';

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <div className="container">
        <Navbar />
        <ProfileEdit />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
