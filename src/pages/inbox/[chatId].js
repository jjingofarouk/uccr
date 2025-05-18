import { useRouter } from 'next/router';
import MessageThread from '../../components/Chat/MessageThread';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import styles from '../../styles/globals.css';

export default function MessageThreadPage() {
  const router = useRouter();
  const { chatId } = router.query;

  // Assume otherUserName is fetched from Firestore or passed via query
  return (
    <ProtectedRoute>
      <div className="container">
        <Navbar />
        <MessageThread threadId={chatId} otherUserName="User" />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
