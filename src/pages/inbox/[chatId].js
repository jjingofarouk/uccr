// src/pages/messages/[chatId].js
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getProfile } from '../../firebase/firestore';
import MessageThread from '../../components/Chat/MessageThread';
import Navbar from '../../components/Navbar';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';

export default function MessageThreadPage() {
  const router = useRouter();
  const { chatId } = router.query;
  const { user } = useAuth();
  const [otherUserName, setOtherUserName] = useState('User');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!chatId || !user) return;
    const fetchRecipientName = async () => {
      try {
        const [user1, user2] = chatId.split('_');
        const recipientId = user1 === user.uid ? user2 : user1;
        const profile = await getProfile(recipientId);
        setOtherUserName(profile.displayName || 'User');
      } catch (err) {
        setError('Failed to load recipient name.');
        console.error('Fetch recipient name error:', err);
      }
    };
    fetchRecipientName();
  }, [chatId, user]);

  if (error) {
    return (
      <ProtectedRoute>
        <div className="container">
          <p>{error}</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container">
        <Navbar />
        <MessageThread threadId={chatId} otherUserName={otherUserName} />
      </div>
    </ProtectedRoute>
  );
}