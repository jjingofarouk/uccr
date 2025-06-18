import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from '../styles/navbar.module.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config';

export default function NotificationsDropdown({ isOpen, toggleNotifications, unreadThreads, handleNavigationClick }) {
  const fetchNotifications = async () => {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', auth.currentUser?.uid),
        where('read', '==', false)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  };

  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    if (isOpen && auth.currentUser) {
      fetchNotifications().then(setNotifications);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.notificationDropdown}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {notifications.length === 0 && unreadThreads.length === 0 ? (
            <p className={styles.noNotifications}>No new notifications</p>
          ) : (
            <>
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={`/cases/${notification.caseId}`}
                  className={styles.notificationItem}
                  onClick={() => {
                    handleNavigationClick('notification_case');
                    toggleNotifications();
                  }}
                >
                  <span>{notification.title}</span>
                  <small>{notification.message}</small>
                </Link>
              ))}
              {unreadThreads.map((thread) => (
                <Link
                  key={thread.id}
                  href={`/messages/${thread.id}`}
                  className={styles.notificationItem}
                  onClick={() => {
                    handleNavigationClick('notification_message');
                    toggleNotifications();
                  }}
                >
                  <span>New message from {thread.otherUserName}</span>
                  <small>{thread.lastMessage}</small>
                </Link>
              ))}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}