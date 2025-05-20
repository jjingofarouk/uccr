// src/components/Chat/MessageThread.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { sendMessage, getThreadMessages } from '../../firebase/firestore';
import Navbar from '../../components/Navbar';
import styles from './inbox.module.css';

export default function MessageThread({ threadId, otherUserName }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!threadId || !user) return;
    console.log('Fetching messages for thread:', threadId, 'User:', user.uid);
    const fetchMessages = async () => {
      try {
        const threadMessages = await getThreadMessages(threadId);
        setMessages(threadMessages);
      } catch (err) {
        setError('Failed to load messages');
        console.error('Fetch messages error:', err);
      }
    };
    fetchMessages();
  }, [threadId, user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) {
      setError('Please log in and enter a message.');
      return;
    }
    try {
      const [user1, user2] = threadId.split('_');
      const recipientId = user1 === user.uid ? user2 : user1;
      console.log('Sending message:', { senderId: user.uid, recipientId, text: newMessage });
      await sendMessage({
        senderId: user.uid,
        recipientId,
        senderName: user.displayName || 'User',
        recipientName: otherUserName || 'User',
        text: newMessage.trim(),
      });
      setNewMessage('');
      const updatedMessages = await getThreadMessages(threadId);
      setMessages(updatedMessages);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to send message');
      console.error('Send message error:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h3 className={styles.chatTitle}>Chat with {otherUserName}</h3>
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <p className={styles.noChat}>No messages in this thread</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.senderId === user?.uid ? styles.sent : styles.received}`}
              >
                <p>{msg.text}</p>
                <small>
                  {msg.timestamp?.toDate().toLocaleString() || 'Just now'}
                </small>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleSend} className={styles.messageForm}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={styles.messageInput}
            required
          />
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
        {error && (
          <div className={styles.error}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </>
  );
}