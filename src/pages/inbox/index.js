import Inbox from '../../components/Chat/Inbox';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';


export default function InboxPage() {
  return (
    <ProtectedRoute>
      <div className="container">
        <Navbar />
        <Inbox />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
