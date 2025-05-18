import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/navbar.module.css';

export default function Navbar() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/" className={styles.logo}>UCCR</Link>
        <div className={styles.headerControls}>
          <button onClick={toggleDarkMode} className={styles.themeToggle} aria-label="Toggle theme">
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button onClick={toggleSidebar} className={styles.hamburger} aria-label="Toggle menu">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
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
              {user && <span className={styles.userName}>{user.displayName || 'User'}</span>}
            </div>
            <nav className={styles.sidebarNav}>
              <Link href="/" onClick={toggleSidebar} className={styles.navLink}>Home</Link>
              <Link href="/cases" onClick={toggleSidebar} className={styles.navLink}>Cases</Link>
              {user && <Link href="/cases/new" onClick={toggleSidebar} className={styles.navLink}>Add Case</Link>}
              {user && <Link href="/profile" onClick={toggleSidebar} className={styles.navLink}>Profile</Link>}
              {user && <Link href="/inbox" onClick={toggleSidebar} className={styles.navLink}>Inbox</Link>}
              {user ? (
                <button onClick={() => { logout(); toggleSidebar(); }} className={styles.sidebarButton}>Logout</button>
              ) : (
                <>
                  <Link href="/login" onClick={toggleSidebar} className={styles.navLink}>Login</Link>
                  <Link href="/signup" onClick={toggleSidebar} className={styles.navLink}>Sign Up</Link>
                </>
              )}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}