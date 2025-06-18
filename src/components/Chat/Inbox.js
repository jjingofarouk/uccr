import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { getMessages, sendMessage, getThreadMessages, getProfile, searchCasesAndUsers } from '../../firebase/firestore';
import Navbar from '../../components/Navbar';
import { Search, Send, AlertCircle } from 'lucide-react';
import styles from './inbox.module.css';

export default function Inbox() {
  const { user } = useAuth();
  const router = useRouter();
  const { recipient: recipientId } = router.query;
  const [threads, setThreads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      setError('Please log in to view messages.');
      return;
    }
    console.log('Authenticated user:', user.uid, user.displayName);

    const fetchThreads = async () => {
      try {
        const fetchedThreads = await getMessages(user.uid);
        setThreads(fetchedThreads);
      } catch (err) {
        setError('Failed to load message threads.');
        console.error('Fetch threads error:', err);
      }
    };
    fetchThreads();
  }, [user]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const searchUsers = async () => {
      try {
        const results = await searchCasesAndUsers(searchQuery, 'users');
        const filtered = results.filter(u => u.uid !== user.uid);
        console.log('Search query:', searchQuery, 'Filtered users:', filtered);
        setSearchResults(filtered);
      } catch (err) {
        setError('Failed to search users.');
        console.error('Search users error:', err);
      }
    };
    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, user]);

  useEffect(() => {
    if (!selectedThread) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        const threadMessages = await getThreadMessages(selectedThread.id);
        setMessages(threadMessages);
      } catch (err) {
        setError('Failed to load messages.');
        console.error('Fetch messages error:', err);
      }
    };
    fetchMessages();
  }, [selectedThread]);

  useEffect(() => {
    if (!user || !recipientId) return;

    const selectRecipient = async () => {
      try {
        const profile = await getProfile(recipientId);
        if (profile.displayName) {
          const recipientData = {
            uid: recipientId,
            displayName: profile.displayName,
            email: profile.email || '',
            photoURL: profile.photoURL,
          };
          handleSelectUser(recipientData);
        } else {
          setError('User not found.');
        }
      } catch (err) {
        setError('Failed to load recipient profile.');
        console.error('Fetch profile error:', err);
      }
    };
    selectRecipient();
  }, [recipientId, user]);

  const handleSelectUser = async (recipient) => {
    const threadId = [user.uid, recipient.uid].sort().join('_');
    const existingThread = threads.find(t => t.id === threadId);
    if (existingThread) {
      setSelectedThread(existingThread);
    } else {
      setSelectedThread({
        id: threadId,
        otherUserName: recipient.displayName || 'User',
        lastMessage: '',
      });
      setMessages([]);
    }
    setSearchQuery('');
    setSearchResults([]);
    setError('');
    setSuccess('');
    router.replace('/inbox', undefined, { shallow: true });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!user || !selectedThread || !messageText.trim()) {
      setError('Please select a user and enter a message.');
      return;
    }

    try {
      const recipientId = selectedThread.id.split('_').find(id => id !== user.uid);
      console.log('Sending message:', { senderId: user.uid, recipientId, text: messageText });
      await sendMessage({
        senderId: user.uid,
        recipientId,
        senderName: user.displayName || 'User',
        recipientName: selectedThread.otherUserName || 'User',
        text: messageText.trim(),
      });
      setMessageText('');
      setSuccess('Message sent!');
      setError('');
      setTimeout(() => setSuccess(''), 2000);
      const updatedThreads = await getMessages(user.uid);
      setThreads(updatedThreads);
      const updatedMessages = await getThreadMessages(selectedThread.id);
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Send message error:', error);
      setError(error.message || 'Failed to send message. Please try again.');
      setSuccess('');
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.inbox}>
          <div className={styles.userList}>
            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} size={20} />
              <input
                type="text"
                placeholder="Search users to chat..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.users}>
              {searchResults.map(u => (
                <div
                  key={u.uid}
                  onClick={() => handleSelectUser(u)}
                  className={`${styles.user} ${selectedThread?.id.includes(u.uid) ? styles.selected : ''}`}
                >
                  <span className={styles.userName}>{u.displayName}</span>
                  <span className={styles.userEmail}>{u.email}</span>
                </div>
              ))}
              {searchResults.length === 0 && searchQuery && (
                <p className={styles.noResults}>No users found</p>
              )}
            </div>
          </div>
          <div className={styles.chatArea}>
            {selectedThread ? (
              <>
                <div className={styles.chatHeader}>
                  <h3 className={styles.chatTitle}>{selectedThread.otherUserName}</h3>
                </div>
                <div className={styles.messages}>
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`${styles.message} ${msg.senderId === user?.uid ? styles.sent : styles.received}`}
                    >
                      <p>{msg.text}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className={styles.messageForm}>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className={styles.messageInput}
                    required
                  />
                  <button type="submit" className={styles.sendButton}>
                    <Send size={20} />
                  </button>
                </form>
                {error && (
                  <div className={styles.error}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className={styles.success}>
                    <span>{success}</span>
                  </div>
                )}
              </>
            ) : (
              <p className={styles.noChat}>Search for a user to start chatting</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}