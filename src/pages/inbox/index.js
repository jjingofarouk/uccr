import Inbox from '../../components/Chat/Inbox';
import Navbar from '../../components/Navbar';

import ProtectedRoute from '../../components/Auth/ProtectedRoute';


export default function InboxPage() {
  return (
    <ProtectedRoute>
      <div className="container">
        <Inbox />
      </div>
    </ProtectedRoute>
  );
}
