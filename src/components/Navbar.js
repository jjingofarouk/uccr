import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
import { getMessages, searchCasesAndUsers } from '../firebase/firestore';
import { Home, Briefcase, PlusCircle, User, Inbox, LogOut, LogIn, Menu, Moon, Sun, Bell, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/navbar.module.css';

// Google Analytics tracking function
const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export default function Navbar() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [unreadThreads, setUnreadThreads] = useState([]);
  const [logoutError, setLogoutError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ cases: [], users: [] });
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const sidebarRef = useRef(null);
  const notificationsRef = useRef(null);
  const searchModalRef = useRef(null);
  const userAvatarRef = useRef(null);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    setIsNotificationsOpen(false);
    setIsSearchModalOpen(false);
    setLogoutError('');
    
    // Track sidebar toggle
    trackEvent('sidebar_toggle', 'navigation', newState ? 'open' : 'close');
  };

  const toggleNotifications = () => {
    const newState = !isNotificationsOpen;
    setIsNotificationsOpen(newState);
    setIsSidebarOpen(false);
    setIsSearchModalOpen(false);
    setLogoutError('');
    
    // Track notifications toggle
    trackEvent('notifications_toggle', 'navigation', newState ? 'open' : 'close');
  };

  const toggleSearchModal = () => {
    const newState = !isSearchModalOpen;
    setIsSearchModalOpen(newState);
    setIsSidebarOpen(false);
    setIsNotificationsOpen(false);
    setSearchQuery('');
    setSearchResults({ cases: [], users: [] });
    setSearchError('');
    setLogoutError('');
    
    // Track search modal toggle
    trackEvent('search_modal_toggle', 'navigation', newState ? 'open' : 'close');
  };

  const handleLogout = async () => {
    try {
      // Track logout attempt
      trackEvent('logout_attempt', 'authentication', 'user_initiated');
      
      const result = await logout();
      if (result.success) {
        setIsSidebarOpen(false);
        trackEvent('logout_success', 'authentication', 'completed');
        router.push('/auth');
      } else {
        setLogoutError(result.error);
        trackEvent('logout_error', 'authentication', result.error);
      }
    } catch (error) {
      const errorMessage = 'Failed to log out. Please try again.';
      setLogoutError(errorMessage);
      trackEvent('logout_error', 'authentication', errorMessage);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    // Track theme toggle
    trackEvent('theme_toggle', 'user_preference', theme === 'light' ? 'to_dark' : 'to_light');
  };

  const handleSearchResultClick = (type, itemId, itemTitle) => {
    // Track search result clicks
    trackEvent('search_result_click', 'search', `${type}_${itemId}`, 1);
    trackEvent('search_conversion', 'search', `query: ${searchQuery} -> ${type}: ${itemTitle}`);
    toggleSearchModal();
  };

  const handleNavigationClick = (destination) => {
    // Track navigation clicks
    trackEvent('navigation_click', 'navigation', destination);
  };

  const clearError = () => {
    setLogoutError('');
    setSearchError('');
  };

  // Fetch unread messages
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
        
        // Track unread message count
        if (unread.length > 0) {
          trackEvent('unread_messages', 'messaging', 'count', unread.length);
        }
      } catch (err) {
        console.error('Fetch unread messages error:', err);
        trackEvent('fetch_messages_error', 'messaging', err.message);
      }
    };
    fetchUnreadMessages();
  }, [user]);

  // Handle search with debouncing
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults({ cases: [], users: [] });
        setSearchError('');
        setIsSearchLoading(false);
        return;
      }
      
      try {
        setIsSearchLoading(true);
        setSearchError('');
        
        // Track search query
        trackEvent('search_query', 'search', searchQuery);
        
        const results = await searchCasesAndUsers(searchQuery);
        console.log('Search results:', results); // Debug log
        setSearchResults(results);
        
        // Track search results
        trackEvent('search_results', 'search', 'results_found', results.cases.length + results.users.length);
        
        if (results.cases.length === 0 && results.users.length === 0) {
          setSearchError('No results found. Try a different keyword.');
          trackEvent('search_no_results', 'search', searchQuery);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchError('Failed to fetch results. Please try again.');
        setSearchResults({ cases: [], users: [] });
        trackEvent('search_error', 'search', error.message);
      } finally {
        setIsSearchLoading(false);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Enhanced outside click handler with better performance
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedElement = event.target;
      
      // Check if click is outside all modals and their triggers
      const isOutsideSidebar = sidebarRef.current && !sidebarRef.current.contains(clickedElement);
      const isOutsideNotifications = notificationsRef.current && !notificationsRef.current.contains(clickedElement);
      const isOutsideSearch = searchModalRef.current && !searchModalRef.current.contains(clickedElement);
      const isOutsideUserAvatar = userAvatarRef.current && !userAvatarRef.current.contains(clickedElement);
      
      // Close modals if click is outside all of them
      if (isOutsideSidebar && isOutsideNotifications && isOutsideSearch && isOutsideUserAvatar) {
        if (isSidebarOpen || isNotificationsOpen || isSearchModalOpen) {
          // Track outside clicks
          trackEvent('outside_click_close', 'navigation', 'modal_closed');
        }
        
        setIsSidebarOpen(false);
        setIsNotificationsOpen(false);
        setIsSearchModalOpen(false);
        setLogoutError('');
        setSearchError('');
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        if (isSidebarOpen || isNotificationsOpen || isSearchModalOpen) {
          trackEvent('escape_key_close', 'navigation', 'modal_closed');
        }
        
        setIsSidebarOpen(false);
        setIsNotificationsOpen(false);
        setIsSearchModalOpen(false);
        setLogoutError('');
        setSearchError('');
      }
    };

    // Add event listeners only when modals are open for better performance
    if (isSidebarOpen || isNotificationsOpen || isSearchModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isSidebarOpen, isNotificationsOpen, isSearchModalOpen]);

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
                      unreadThreads.map((thread) => (
                        <Link
                          key={thread.id}
                          href={`/messages/${thread.id}`}
                          className={styles.notificationItem}
                          onClick={() => {
                            handleNavigationClick('notification_message');
                            setIsNotificationsOpen(false);
                          }}
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
        {isSearchModalOpen && (
          <motion.div
            className={styles.searchModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div ref={searchModalRef} className={styles.searchModalContent}>
              <button
                onClick={toggleSearchModal}
                className={styles.closeSearchButton}
                aria-label="Close search"
              >
                <X size={24} />
              </button>
              <div className={styles.searchInputWrapper}>
                <Search size={20} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search cases or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  autoFocus
                />
              </div>
              <div className={styles.searchResults}>
                {isSearchLoading ? (
                  <p className={styles.searchLoading}>Loading...</p>
                ) : searchQuery.trim().length < 2 ? (
                  <p className={styles.noResults}>Enter at least 2 characters to search</p>
                ) : searchError ? (
                  <div className={styles.noResults}>
                    {searchError}
                    <div style={{ marginTop: '1rem' }}>
                      <p>Suggestions:</p>
                      <ul>
                        <li>
                          <Link 
                            href="/cases" 
                            onClick={() => {
                              handleNavigationClick('browse_all_cases');
                              toggleSearchModal();
                            }}
                          >
                            Browse all cases
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href="/cases?specialty=Cardiology" 
                            onClick={() => {
                              handleNavigationClick('browse_cardiology');
                              toggleSearchModal();
                            }}
                          >
                            Explore Cardiology cases
                          </Link>
                        </li>
                        <li>
                          <Link 
                            href="/cases?specialty=Pediatrics" 
                            onClick={() => {
                              handleNavigationClick('browse_pediatrics');
                              toggleSearchModal();
                            }}
                          >
                            Explore Pediatrics cases
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <>
                    {searchResults.cases.length > 0 && (
                      <div className={styles.searchSection}>
                        <h3>Cases</h3>
                        {searchResults.cases.map((caseData) => (
                          <Link
                            key={caseData.id}
                            href={`/cases/${caseData.id}`}
                            className={styles.searchResult}
                            onClick={() => handleSearchResultClick('case', caseData.id, caseData.title)}
                          >
                            <span>{caseData.title || 'Untitled Case'}</span>
                            <small>{caseData.specialty || 'No specialty'}</small>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.users.length > 0 && (
                      <div className={styles.searchSection}>
                        <h3>Users</h3>
                        {searchResults.users.map((user) => (
                          <Link
                            key={user.uid}
                            href={`/profile/view/${user.uid}`}
                            className={styles.searchResult}
                            onClick={() => handleSearchResultClick('user', user.uid, user.displayName)}
                          >
                            <span>{user.displayName || 'Anonymous'}</span>
                            <small>{user.specialty || 'No specialty'}</small>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchResults.cases.length === 0 && searchResults.users.length === 0 && (
                      <div className={styles.noResults}>
                        No results found for "{searchQuery}"
                        <div style={{ marginTop: '1rem' }}>
                          <p>Suggestions:</p>
                          <ul>
                            <li>
                              <Link 
                                href="/cases" 
                                onClick={() => {
                                  handleNavigationClick('browse_all_cases_fallback');
                                  toggleSearchModal();
                                }}
                              >
                                Browse all cases
                              </Link>
                            </li>
                            <li>
                              <Link 
                                href="/cases?specialty=Cardiology" 
                                onClick={() => {
                                  handleNavigationClick('browse_cardiology_fallback');
                                  toggleSearchModal();
                                }}
                              >
                                Explore Cardiology cases
                              </Link>
                            </li>
                            <li>
                              <Link 
                                href="/cases?specialty=Pediatrics" 
                                onClick={() => {
                                  handleNavigationClick('browse_pediatrics_fallback');
                                  toggleSearchModal();
                                }}
                              >
                                Explore Pediatrics cases
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
              <Link 
                href="/" 
                onClick={() => {
                  handleNavigationClick('home');
                  toggleSidebar();
                }} 
                className={styles.navLink}
              >
                <Home size={20} className={styles.navIcon} />
                Home
              </Link>
              <Link 
                href="/cases" 
                onClick={() => {
                  handleNavigationClick('cases');
                  toggleSidebar();
                }} 
                className={styles.navLink}
              >
                <Briefcase size={20} className={styles.navIcon} />
                Cases
              </Link>
              {user && (
                <Link 
                  href="/cases/new" 
                  onClick={() => {
                    handleNavigationClick('add_case');
                    toggleSidebar();
                  }} 
                  className={styles.navLink}
                >
                  <PlusCircle size={20} className={styles.navIcon} />
                  Add Case
                </Link>
              )}
              {user && (
                <Link 
                  href="/profile/cases" 
                  onClick={() => {
                    handleNavigationClick('my_cases');
                    toggleSidebar();
                  }} 
                  className={styles.navLink}
                >
                  <Briefcase size={20} className={styles.navIcon} />
                  My Cases
                </Link>
              )}
              {user && (
                <Link 
                  href="/profile" 
                  onClick={() => {
                    handleNavigationClick('profile');
                    toggleSidebar();
                  }} 
                  className={styles.navLink}
                >
                  <User size={20} className={styles.navIcon} />
                  Profile
                </Link>
              )}
              {user && (
                <Link 
                  href="/inbox" 
                  onClick={() => {
                    handleNavigationClick('inbox');
                    toggleSidebar();
                  }} 
                  className={styles.navLink}
                >
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
                <Link 
                  href="/auth" 
                  onClick={() => {
                    handleNavigationClick('login');
                    toggleSidebar();
                  }} 
                  className={styles.navLink}
                >
                  <LogIn size={20} className={styles.navIcon} />
                  Log In / Sign Up
                </Link>
                <Link 
  href="/about" 
  onClick={() => {
    handleNavigationClick('about');
    toggleSidebar();
  }} 
  className={styles.navLink}
>
  <User size={20} className={styles.navIcon} />
  About
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