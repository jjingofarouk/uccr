import ProfileCard from '../../components/Profile/ProfileCard';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

export default function Profile() {
  const { user } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <ProtectedRoute>
      <div className="container">
        <Navbar />
        <ProfileCard userData={user} />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
