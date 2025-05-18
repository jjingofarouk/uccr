import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/navbar.css';

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
    <header className="header">
      <div className="header-content">
        <Link href="/" className="logo">UCCR</Link>
        <div className="header-controls">
          <button onClick={toggleDarkMode} className="theme-toggle" aria-label="Toggle theme">
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button onClick={toggleSidebar} className="hamburger" aria-label="Toggle menu">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            className="sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="sidebar-header">
              {user && <span className="user-name">{user.displayName || 'User'}</span>}
            </div>
            <nav className="sidebar-nav">
              <Link href="/" onClick={toggleSidebar}>Home</Link>
              <Link href="/cases" onClick={toggleSidebar}>Cases</Link>
              {user && <Link href="/cases/new" onClick={toggleSidebar}>Add Case</Link>}
              {user && <Link href="/profile" onClick={toggleSidebar}>Profile</Link>}
              {user && <Link href="/inbox" onClick={toggleSidebar}>Inbox</Link>}
              {user ? (
                <button onClick={() => { logout(); toggleSidebar(); }} className="sidebar-button">Logout</button>
              ) : (
                <>
                  <Link href="/login" onClick={toggleSidebar}>Login</Link>
                  <Link href="/signup" onClick={toggleSidebar}>Sign Up</Link>
                </>
              )}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}