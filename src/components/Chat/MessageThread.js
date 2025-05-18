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
    if (!threadId) return;
    const fetchMessages = async () => {
      try {
        const threadMessages = await getThreadMessages(threadId);
        setMessages(threadMessages);
      } catch (err) {
        setError('Failed to load messages');
      }
    };
    fetchMessages();
  }, [threadId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    try {
      // Find recipient ID from threadId (e.g., "uid1_uid2")
      const [user1, user2] = threadId.split('_');
      const recipientId = user1 === user.uid ? user2 : user1;
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
    } catch (err) {
      setError('Failed to send message');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h3>Chat with {otherUserName}</h3>
        <div className={styles.messages}>
          {messages.length === 0 ? (
            <p>No messages in this thread</p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.senderId === user.uid ? styles.sent : styles.received}`}
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
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </>
  );
}