import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getMessages, getUsers, sendMessage } from '../../firebase/firestore';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import styles from './inbox.module.css';

export default function Inbox() {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [messageText, setMessageText] = useState('');

  // Fetch message threads
  useEffect(() => {
    if (!user) return;
    const fetchThreads = async () => {
      const messages = await getMessages(user.uid);
      setThreads(messages);
    };
    fetchThreads();
  }, [user]);

  // Fetch users for recipient selection
  useEffect(() => {
    if (!user) return;
    const fetchUsers = async () => {
      const allUsers = await getUsers();
      // Exclude current user
      const filteredUsers = allUsers.filter(u => u.uid !== user.uid);
      setUsers(filteredUsers);
    };
    fetchUsers();
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !selectedUser || !messageText.trim()) return;

    try {
      await sendMessage({
        senderId: user.uid,
        recipientId: selectedUser,
        senderName: user.displayName || 'User',
        recipientName: users.find(u => u.uid === selectedUser)?.displayName || 'User',
        text: messageText.trim(),
      });
      setMessageText('');
      setSelectedUser('');
      setIsModalOpen(false);
      // Refresh threads
      const messages = await getMessages(user.uid);
      setThreads(messages);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2>Inbox</h2>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className={styles.newMessageButton}
          disabled={!user}
        >
          New Message
        </button>
        {threads.length === 0 ? (
          <p>No messages</p>
        ) : (
          threads.map((thread) => (
            <Link key={thread.id} href={`/inbox/${thread.id}`}>
              <div className={styles.thread}>
                <p>{thread.otherUserName}</p>
                <small>{thread.lastMessage}</small>
              </div>
            </Link>
          ))
        )}
        {isModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>Compose Message</h3>
              <form onSubmit={handleSendMessage}>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className={styles.select}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.displayName || 'User'}
                    </option>
                  ))}
                </select>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className={styles.textarea}
                  required
                />
                <div className={styles.modalActions}>
                  <button type="submit" className={styles.sendButton}>
                    Send
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}