import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
import { getMessages } from '../firebase/firestore';
import { Home, Briefcase, PlusCircle, User, Inbox, LogOut, LogIn, Menu, Moon, Sun, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/navbar.module.css';

export default function Navbar() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadThreads, setUnreadThreads] = useState([]);
  const [logoutError, setLogoutError] = useState('');
  const sidebarRef = useRef(null);
  const userAvatarRef = useRef(null);
  const notificationsRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
    setIsNotificationsOpen(false);
    setLogoutError('');
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsSidebarOpen(false);
    setLogoutError('');
  };

  const handleLogout = async () => {
    console.log('handleLogout triggered');
    try {
      const result = await logout();
      if (result.success) {
        setIsSidebarOpen(false);
        router.push('/auth');
      } else {
        setLogoutError(result.error);
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      setLogoutError(error.message || 'Failed to log out. Please try again.');
      console.error('Unexpected logout error:', error);
    }
  };

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
        const unread = threads.filter(thread => thread.lastMessage && !thread.read);
        setUnreadThreads(unread);
      } catch (err) {
        console.error('Fetch unread messages error:', err);
      }
    };
    fetchUnreadMessages();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        userAvatarRef.current &&
        !userAvatarRef.current.contains(event.target) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
        setIsNotificationsOpen(false);
        setLogoutError('');
      }
    };

    if (isSidebarOpen || isNotificationsOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen, isNotificationsOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <span>UCCR</span>
        </Link>
        <div className={styles.headerControls}>
          <button
            onClick={toggleTheme}
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
                {unreadThreads.length > 0 && (
                  <span className={styles.notificationBadge}>{unreadThreads.length}</span>
                )}
              </button>
              <AnimatePresence>
                {isNotificationsOpen && (
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
                      unreadThreads.map(thread => (
                        <Link
                          key={thread.id}
                          href={`/messages/${thread.id}`}
                          className={styles.notificationItem}
                          onClick={() => setIsNotificationsOpen(false)}
                        >
                          <span>New message from {thread.otherUserName}</span>
                          <small>{thread.lastMessage}</small>
                        </Link>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            ref={sidebarRef}
            className={styles.sidebar}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={styles.sidebarHeader}>
              {user && (
                <div className={styles.userInfo}>
                  <Image
                    src={user.photoURL || '/images/doctor-avatar.jpeg'}
                    alt="User profile"
                    width={48}
                    height={48}
                    className={styles.sidebarAvatar}
                  />
                  <span className={styles.userName}>{user.displayName || 'User'}</span>
                </div>
              )}
            </div>
            <nav className={styles.sidebarNav}>
              <Link href="/" onClick={toggleSidebar} className={styles.navLink}>
                <Home size={20} className={styles.navIcon} />
                Home
              </Link>
              <Link href="/cases" onClick={toggleSidebar} className={styles.navLink}>
                <Briefcase size={20} className={styles.navIcon} />
                Cases
              </Link>
              {user && (
                <Link href="/cases/new" onClick={toggleSidebar} className={styles.navLink}>
                  <PlusCircle size={20} className={styles.navIcon} />
                  Add Case
                </Link>
              )}
              {user && (
                <Link href="/profile" onClick={toggleSidebar} className={styles.navLink}>
                  <User size={20} className={styles.navIcon} />
                  Profile
                </Link>
              )}
              {user && (
                <Link href="/inbox" onClick={toggleSidebar} className={styles.navLink}>
                  <Inbox size={20} className={styles.navIcon} />
                  Inbox
                </Link>
              )}
              {user ? (
                <button
                  onClick={handleLogout}
                  className={`${styles.navLink} ${styles.logoutButton}`}
                  disabled={loading}
                >
                  <LogOut size={20} className={styles.navIcon} />
                  Logout
                </button>
              ) : (
                <Link href="/auth" onClick={toggleSidebar} className={styles.navLink}>
                  <LogIn size={20} className={styles.navIcon} />
                  Log In / Sign Up
                </Link>
              )}
            </nav>
            <AnimatePresence>
              {logoutError && (
                <motion.div
                  className={styles.error}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{logoutError}</span>
                  <button
                    onClick={clearError}
                    className={styles.closeError}
                    aria-label="Dismiss error"
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}