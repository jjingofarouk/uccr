import ProfileEdit from '../../components/Profile/ProfileEdit';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

export default function ProfileEditPage() {
  return (
    <ProtectedRoute>
      <div className="container">
        <ProfileEdit />
      </div>
    </ProtectedRoute>
  );
}
