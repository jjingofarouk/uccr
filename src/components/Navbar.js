import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
import { getMessages, notifyUsersOfCaseChange } from '../firebase/firestore';
import { Home, Briefcase, PlusCircle, Grid, Info, User, Inbox, LogOut, LogIn, Menu, Moon, Sun, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/navbar.module.css';
import SearchModal from './SearchModal';
import NotificationsDropdown from './NotificationsDropdown';
import Sidebar from './Sidebar';
import { onSnapshot, collection, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Navbar() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [unreadThreads, setUnreadThreads] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [logoutError, setLogoutError] = useState('');
  const sidebarRef = useRef(null);
  const notificationsRef = useRef(null);
  const userAvatarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsNotificationsOpen(false);
    setIsSearchModalOpen(false);
    setLogoutError('');
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsSidebarOpen(false);
    setIsSearchModalOpen(false);
    setLogoutError('');
  };

  const toggleSearchModal = () => {
    setIsSearchModalOpen(!isSearchModalOpen);
    setIsSidebarOpen(false);
    setIsNotificationsOpen(false);
    setLogoutError('');
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        setIsSidebarOpen(false);
        router.push('/auth');
      } else {
        setLogoutError(result.error);
      }
    } catch (error) {
      setLogoutError('Failed to log out. Please try again.');
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleNavigationClick = (navType) => {};

  const clearError = () => {
    setLogoutError('');
  };

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (!user) {
        setUnreadThreads([]);
        return;
      }
      try {
        const threads = await getMessages(user.uid);
        const unread = threads.filter((thread) => thread.lastMessage && !thread.read);
        setUnreadThreads(unread);
      } catch (err) {
        console.error('Fetch unread messages error:', err);
      }
    };
    fetchUnreadMessages();
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUnreadNotifications([]);
      return;
    }

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setUnreadNotifications(notifications);
    }, (error) => {
      console.error('Error fetching notifications:', error);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'cases'), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const caseData = change.doc.data();
        const caseId = change.doc.id;
        const caseTitle = caseData.title || 'Untitled Case';
        const action = change.type === 'added' ? 'Added' : change.type === 'modified' ? 'Updated' : null;

        if (action && user) {
          notifyUsersOfCaseChange(caseId, caseTitle, action).catch((error) => {
            console.error(`Error notifying users of case ${action.toLowerCase()}:`, error);
          });
        }
      });
    }, (error) => {
      console.error('Error listening to cases:', error);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link 
          href="/" 
          className={styles.logo}
          onClick={() => handleNavigationClick('home_logo')}
        >
          <Image src="/logo.jpg" alt="UCCR Logo" width={40} height={40} />
          <span>UCCR</span>
        </Link>
        <div className={styles.headerControls}>
          <button
            onClick={toggleSearchModal}
            className={styles.searchButton}
            aria-label="Open search"
          >
            <Search size={20} />
          </button>
          <button
            onClick={handleThemeToggle}
            className={styles.themeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Moon size={20} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: -360 }}
                transition={{ duration: 0.5 }}
              >
                <Sun size={20} />
              </motion.div>
            )}
          </button>
          {user && (
            <div ref={notificationsRef} className={styles.notificationWrapper}>
              <button
                onClick={toggleNotifications}
                className={styles.notificationButton}
                aria-label="View notifications"
              >
                <Bell size={20} />
                {(unreadThreads.length + unreadNotifications.length) > 0 && (
                  <span className={styles.notificationBadge}>{unreadThreads.length + unreadNotifications.length}</span>
                )}
              </button>
              <NotificationsDropdown
                isOpen={isNotificationsOpen}
                toggleNotifications={toggleNotifications}
                unreadThreads={unreadThreads}
                handleNavigationClick={handleNavigationClick}
              />
            </div>
          )}
          <div ref={userAvatarRef} className={styles.menuButtonWrapper}>
            {user ? (
              <Image
                src={user.photoURL || '/images/doctor-avatar.jpeg'}
                alt="User profile"
                width={36}
                height={36}
                className={styles.userAvatar}
                onClick={toggleSidebar}
              />
            ) : (
              <button
                onClick={toggleSidebar}
                className={styles.menuButton}
                aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
                disabled={loading}
              >
                <Menu size={24} />
              </button>
            )}
          </div>
        </div>
      </div>
      <SearchModal
        isOpen={isSearchModalOpen}
        toggleModal={toggleSearchModal}
        handleNavigationClick={handleNavigationClick}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        user={user}
        loading={loading}
        handleNavigationClick={handleNavigationClick}
        handleLogout={handleLogout}
        logoutError={logoutError}
        clearError={clearError}
      />
    </header>
  );
}