import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X } from 'lucide-react';
import styles from '../styles/navbar.module.css';

export default function NotificationsModal({ isOpen, toggleModal, unreadThreads, unreadNotifications, handleNavigationClick }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.modalOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={toggleModal}
        >
          <motion.div
            className={styles.notificationsModal}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Notifications</h2>
              <button
                onClick={toggleModal}
                className={styles.closeButton}
                aria-label="Close notifications"
              >
                <X size={24} />
              </button>
            </div>
            <div className={styles.modalContent}>
              {unreadThreads.length === 0 && unreadNotifications.length === 0 ? (
                <p className={styles.noNotifications}>No new notifications</p>
              ) : (
                <ul className={styles.notificationList}>
                  {unreadNotifications.map((notification) => (
                    <li key={notification.id} className={styles.notificationItem}>
                      <Link
                        href={`/cases/${notification.caseId}`}
                        className={styles.notificationLink}
                        onClick={() => {
                          handleNavigationClick('notification_case');
                          toggleModal();
                        }}
                      >
                        <span className={styles.notificationTitle}>{notification.title}</span>
                        <p className={styles.notificationMessage}>{notification.message}</p>
                        <small className={styles.notificationTime}>
                          {new Date(notification.createdAt).toLocaleTimeString()}
                        </small>
                      </Link>
                    </li>
                  ))}
                  {unreadThreads.map((thread) => (
                    <li key={thread.id} className={styles.notificationItem}>
                      <Link
                        href={`/messages/${thread.id}`}
                        className={styles.notificationLink}
                        onClick={() => {
                          handleNavigationClick('notification_message');
                          toggleModal();
                        }}
                      >
                        <span className={styles.notificationTitle}>New message from {thread.otherUserName}</span>
                        <p className={styles.notificationMessage}>{thread.lastMessage}</p>
                        <small className={styles.notificationTime}>
                          {new Date(thread.createdAt).toLocaleTimeString()}
                        </small>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}