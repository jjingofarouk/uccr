
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import styles from '../styles/navbar.module.css';

export default function NotificationsDropdown({ isOpen, toggleNotifications, unreadThreads, unreadNotifications, handleNavigationClick }) {
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
          {unreadThreads.length === 0 && unreadNotifications.length === 0 ? (
            <p className={styles.noNotifications}>No new notifications</p>
          ) : (
            <>
              {unreadNotifications.map((notification) => (
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