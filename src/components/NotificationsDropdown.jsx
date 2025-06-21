
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';
import styles from '../styles/navbar.module.css';

export default function NotificationsModal({ isOpen, toggleModal, unreadThreads, unreadNotifications, handleNavigationClick }) {
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
            <h3 className={styles.searchSection}>Notifications</h3>
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
                      toggleModal();
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