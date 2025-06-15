// NotificationsDropdown.jsx
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from '../styles/navbar.module.css';

export default function NotificationsDropdown({ isOpen, toggleNotifications, unreadThreads, handleNavigationClick }) {
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
          {unreadThreads.length === 0 ? (
            <p className={styles.noNotifications}>No new messages</p>
          ) : (
            unreadThreads.map((thread) => (
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
            ))
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}