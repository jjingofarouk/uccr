// pages/profile/view.jsx
import { useAuth } from '../../hooks/useAuth';
import ProfileCard from '../../components/Profile/ProfileCard';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import styles from '../../styles/profile.module.css';

export default function ProfileView() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Navbar />
        {user && <ProfileCard userData={user} />}
      </div>
    </ProtectedRoute>
  );
}