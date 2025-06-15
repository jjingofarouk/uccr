// Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
import { getMessages } from '../firebase/firestore';
import { Home, Briefcase, PlusCircle, Grid, Info, User, Inbox, LogOut, LogIn, Menu, Moon, Sun, Bell, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/navbar.module.css';
import SearchModal from './SearchModal';
import NotificationsDropdown from './NotificationsDropdown';
import Sidebar from './Sidebar';

export default function Navbar() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [unreadThreads, setUnreadThreads] = useState([]);
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
    const handleClickOutside = (event) => {
      const clickedElement = event.target;
      const isOutsideSidebar = sidebarRef.current && !sidebarRef.current.contains(clickedElement);
      const isOutsideNotifications = notificationsRef.current && !notificationsRef.current.contains(clickedElement);
      const isOutsideUserAvatar = userAvatarRef.current && !userAvatarRef.current.contains(clickedElement);
      
      if (isOutsideSidebar && isOutsideNotifications && isOutsideUserAvatar) {
        setIsSidebarOpen(false);
        setIsNotificationsOpen(false);
        setIsSearchModalOpen(false);
        setLogoutError('');
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
        setIsNotificationsOpen(false);
        setIsSearchModalOpen(false);
        setLogoutError('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

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
                {unreadThreads.length > 0 && (
                  <span className={styles.notificationBadge}>{unreadThreads.length}</span>
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