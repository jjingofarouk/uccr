import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './navbar.module.css';

export default function Navbar() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  const userInitials = user ? 
    (user.displayName ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U') : 'G';

  return (
    <header className="navbar-header">
      <div className="navbar-content">
        <Link href="/" className="navbar-logo">UCCR</Link>
        <nav className="navbar-controls">
          <Link href="/" className="navbar-link">Home</Link>
          {user && (
            <Link href="/cases/new" className="navbar-link">Add Case</Link>
          )}
          <button 
            onClick={toggleDarkMode} 
            className="navbar-theme-toggle"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={toggleSidebar} 
            className="navbar-user-button"
            aria-label="User menu"
          >
            {userInitials}
          </button>
        </nav>
      </div>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            className="navbar-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <nav className="navbar-sidebar-nav">
              <Link 
                href="/" 
                onClick={toggleSidebar} 
                className="navbar-sidebar-link"
              >
                Home
              </Link>
              <Link 
                href="/cases" 
                onClick={toggleSidebar} 
                className="navbar-sidebar-link"
              >
                Cases
              </Link>
              {user && (
                <>
                  <Link 
                    href="/cases/new" 
                    onClick={toggleSidebar} 
                    className="navbar-sidebar-link"
                  >
                    Add Case
                  </Link>
                  <Link 
                    href="/profile" 
                    onClick={toggleSidebar} 
                    className="navbar-sidebar-link"
                  >
                    Profile
                  </Link>
                  <Link 
                    href="/inbox" 
                    onClick={toggleSidebar} 
                    className="navbar-sidebar-link"
                  >
                    Inbox
                  </Link>
                  <button 
                    onClick={() => { logout(); toggleSidebar(); }} 
                    className="navbar-sidebar-button"
                  >
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <>
                  <Link 
                    href="/login" 
                    onClick={toggleSidebar} 
                    className="navbar-sidebar-link"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup" 
                    onClick={toggleSidebar} 
                    className="navbar-sidebar-link"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}