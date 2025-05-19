// components/Navbar.jsx
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
import { Home, Briefcase, PlusCircle, User, Inbox, LogOut, LogIn, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import styles from './navbar.module.css';

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toggleSidebar();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>
          <span>UCCR</span>
        </Link>
        <div className={styles.headerControls}>
          <button
            onClick={toggleDarkMode}
            className={styles.themeToggle}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={toggleSidebar}
            className={styles.userButton}
            aria-label="User menu"
            disabled={loading}
          >
            <Image
              src={user?.photoURL || '/images/doctor-avatar.jpeg'}
              alt="User profile"
              width={36}
              height={36}
              className={styles.userAvatar}
            />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            className={styles.sidebar}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
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
                <button onClick={handleLogout} className={styles.sidebarButton}>
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