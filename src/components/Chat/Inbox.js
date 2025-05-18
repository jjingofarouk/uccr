import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getMessages, getUsers, sendMessage } from '../../firebase/firestore';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { Search, Plus, Send, X } from 'lucide-react';
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
  const [error, setError] = useState('');

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
      console.log('Filtered users:', filteredUsers); // Debug log
      setUsers(filteredUsers);
      setFilteredUsers(filteredUsers);
    };
    fetchUsers();
  }, [user]);

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = users.filter(u => 
        u.displayName?.toLowerCase().includes(lowerQuery) || 
        u.email?.toLowerCase().includes(lowerQuery)
      );
      console.log('Search query:', searchQuery, 'Filtered users:', filtered); // Debug log
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.displayName);
    setFilteredUsers([]);
    setError('');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !selectedUser || !messageText.trim()) {
      setError('Please select a user and enter a message.');
      return;
    }

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
      setError('');
      const messages = await getMessages(user.uid);
      setThreads(messages);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>
          <Search size={24} />
          Inbox
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className={styles.newMessageButton}
          disabled={!user}
        >
          <Plus size={20} />
          New Message
        </button>
        {threads.length === 0 ? (
          <p className={styles.noMessages}>No messages yet</p>
        ) : (
          <div className={styles.threadList}>
            {threads.map((thread) => (
              <Link key={thread.id} href={`/inbox/${thread.id}`} className={styles.thread}>
                <p className={styles.threadName}>{thread.otherUserName}</p>
                <p className={styles.threadMessage}>{thread.lastMessage}</p>
              </Link>
            ))}
          </div>
        )}
        {isModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSearchQuery('');
                  setSelectedUser(null);
                  setFilteredUsers(users);
                  setError('');
                }} 
                className={styles.closeButton}
              >
                <X size={20} />
              </button>
              <h3 className={styles.modalTitle}>
                <Plus size={24} />
                Compose Message
              </h3>
              <form onSubmit={handleSendMessage}>
                <div className={styles.searchContainer}>
                  <Search className={styles.searchIcon} size={20} />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                    autoFocus
                  />
                  {searchQuery && filteredUsers.length > 0 && (
                    <ul className={styles.userList}>
                      {filteredUsers.map((u) => (
                        <li
                          key={u.uid}
                          onClick={() => handleSelectUser(u)}
                          className={styles.userItem}
                        >
                          <span className={styles.userName}>{u.displayName || 'User'}</span>
                          <span className={styles.userEmail}>{u.email}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {searchQuery && filteredUsers.length === 0 && (
                    <p className={styles.noResults}>No users found</p>
                  )}
                </div>
                {selectedUser && (
                  <p className={styles.selectedUser}>
                    Sending to: {selectedUser.displayName} ({selectedUser.email})
                  </p>
                )}
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className={styles.textarea}
                  required
                />
                {error && <p className={styles.error}>{error}</p>}
                <button 
                  type="submit" 
                  className={styles.sendButton}
                  disabled={!selectedUser || !messageText.trim()}
                >
                  <Send size={20} />
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}