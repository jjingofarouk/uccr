import ProfileEdit from '../../components/Profile/ProfileEdit';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <div className="container">
        <Navbar />
        <ProfileEdit />
      </div>
    </ProtectedRoute>
  );
}
