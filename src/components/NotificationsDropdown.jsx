import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import styles from '../styles/navbar.module.css';

export default function NotificationsModal({ isOpen, toggleModal, unreadThreads, unreadNotifications, handleNavigationClick }) {
  const clearNotifications = async () => {
    try {
      const notificationPromises = unreadNotifications.map(notification =>
        updateDoc(doc(db, 'notifications', notification.id), { read: true })
      );
      await Promise.all(notificationPromises);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.searchModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={toggleModal}
        >
          <motion.div
            className={styles.searchModalContent}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={toggleModal}
              className={styles.closeSearchButton}
              aria-label="Close notifications"
            >
              <X size={24} />
            </button>
            <div className={styles.notificationHeader}>
              <h3 className={styles.searchSection}>Notifications</h3>
              {(unreadThreads.length > 0 || unreadNotifications.length > 0) && (
                <button
                  onClick={clearNotifications}
                  className={styles.clearNotificationsButton}
                  aria-label="Clear all notifications"
                >
                  Clear All
                </button>
              )}
            </div>
            {unreadThreads.length === 0 && unreadNotifications.length === 0 ? (
              <p className={styles.noNotifications}>No new notifications</p>
            ) : (
              <div className={styles.searchResults}>
                {unreadNotifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={`/cases/${notification.caseId}`}
                    className={styles.searchResult}
                    onClick={() => {
                      handleNavigationClick('notification_case');
                      markNotificationAsRead(notification.id);
                      toggleModal();
                    }}
                  >
                    <span>{notification.title}</span>
                    <small>{notification.message.replace(/<p>|<\/p>/g, '')}</small>
                  </Link>
                ))}
                {unreadThreads.map((thread) => (
                  <Link
                    key={thread.id}
                    href={`/messages/${thread.id}`}
                    className={styles.searchResult}
                    onClick={() => {
                      handleNavigationClick('notification_message');
                      toggleModal();
                    }}
                  >
                    <span>New message from {thread.otherUserName}</span>
                    <small>{thread.lastMessage}</small>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}