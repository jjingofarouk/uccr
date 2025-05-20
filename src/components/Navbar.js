// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
import { Home, Briefcase, PlusCircle, User, Inbox, LogOut, LogIn, Menu, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/navbar.module.css';

export default function Navbar() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const userAvatarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsSidebarOpen(false);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        userAvatarRef.current &&
        !userAvatarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSidebarOpen]);

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
          <button
            ref={userAvatarRef}
            onClick={toggleSidebar}
            className={styles.menuButton}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            disabled={loading}
          >
            {user ? (
              <Image
                src={user.photoURL || '/images/doctor-avatar.jpeg'}
                alt="User profile"
                width={36}
                height={36}
                className={styles.userAvatar}
              />
            ) : (
              <Menu size={24} />
            )}
          </button>
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
                <button onClick={handleLogout} className={styles.navLink}>
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
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}