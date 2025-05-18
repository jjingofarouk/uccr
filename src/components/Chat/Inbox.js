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
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
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

  // Fetch users
  useEffect(() => {
    if (!user) return;
    const fetchUsers = async () => {
      const allUsers = await getUsers();
      const filteredUsers = allUsers.filter(u => u.uid !== user.uid);
      setUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
    };
    fetchUsers();
  }, [user]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(u => u.displayName.toLowerCase().includes(lowerQuery))
      );
    }
  }, [searchQuery, users]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.displayName);
    setFilteredUsers([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !selectedUser || !messageText.trim()) return;

    try {
      await sendMessage({
        senderId: user.uid,
        recipientId: selectedUser.uid,
        senderName: user.displayName || 'User',
        recipientName: selectedUser.displayName || 'User',
        text: messageText.trim(),
      });
      setMessageText('');
      setSelectedUser(null);
      setSearchQuery('');
      setIsModalOpen(false);
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
                <div className={styles.searchContainer}>
                  <input
                    type="text"
                    placeholder="Search users by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  {filteredUsers.length > 0 && (
                    <ul className={styles.userList}>
                      {filteredUsers.map((u) => (
                        <li
                          key={u.uid}
                          onClick={() => handleSelectUser(u)}
                          className={styles.userItem}
                        >
                          {u.displayName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {selectedUser && (
                  <p className={styles.selectedUser}>
                    Sending to: {selectedUser.displayName}
                  </p>
                )}
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className={styles.textarea}
                  required
                />
                <div className={styles.modalActions}>
                  <button 
                    type="submit" 
                    className={styles.sendButton}
                    disabled={!selectedUser}
                  >
                    Send
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsModalOpen(false);
                      setSearchQuery('');
                      setSelectedUser(null);
                    }} 
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