import { useState, useEffect, useRef, memo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../lib/supabase/auth';
// import { getMessages } from '../firebase/firestore'; // Removed Firebase Legacy
import { Menu, Moon, Sun, Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import styles from '../styles/navbar.module.css';

import NotificationsModal from './NotificationsDropdown';
import Sidebar from './Sidebar';
// import { subscribeToNotifications } from '../firebase/notifications'; // Removed Firebase Legacy
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

/* ═══════════════════════════════════════════════════════════════════
   MarqueeBand
   ───────────────────────────────────────────────────────────────────
   Headlines are fetched once and rendered TWICE inside .marqueeTrack.
   The keyframe animates translateX(0) → translateX(-50%), which moves
   the track by exactly one copy-width — creating a perfect seamless
   loop with zero stutter or jump.
   ═══════════════════════════════════════════════════════════════════ */

const MarqueeBand = memo(function MarqueeBand() {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchHeadlines = async () => {
      try {
        const res = await fetch('/api/medical-headlines');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (cancelled) return;

        // Shuffle and pick a reasonable count — enough to fill any screen
        // at ≈2× width so the seamless duplication always covers the viewport.
        const shuffled = [...data.headlines]
          .sort(() => Math.random() - 0.5)
          .slice(0, 20);

        setHeadlines(shuffled);
      } catch (err) {
        console.error('[MarqueeBand] fetch error:', err);
      }
    };

    fetchHeadlines();
    return () => { cancelled = true; };
  }, []);

  // Nothing to render until data arrives — band height is preserved by CSS.
  if (headlines.length === 0) return <div className={styles.marqueeBand} aria-hidden />;

  return (
    <div className={styles.marqueeBand} aria-label="Medical news ticker" role="marquee">
      <div className={styles.marqueeInner}>
        {/*
          Two identical copies of the list, side-by-side inside inline-flex.
          Total track width = 2N.  Animation moves -50% = exactly N.
          At that point the visual is identical to the start → seamless.
        */}
        <div className={styles.marqueeTrack} aria-hidden="true">
          {[0, 1].map((copyIndex) =>
            headlines.map((headline) => (
              <span
                key={`${copyIndex}-${headline.id}`}
                className={styles.headlineItem}
              >
                <a
                  href={headline.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.headlineLink}
                  tabIndex={-1} /* decorative ticker — not in tab order */
                >
                  {headline.title}
                  <span className={styles.headlineSource}>{headline.source}</span>
                </a>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════════
   Navbar
   ═══════════════════════════════════════════════════════════════════ */

export default function Navbar() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [unreadThreads, setUnreadThreads] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [logoutError, setLogoutError] = useState('');

  const notificationsButtonRef = useRef(null);
  const userAvatarRef = useRef(null);

  /* ── Panel toggles — only one open at a time ── */
  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true);
    setIsNotificationsOpen(false);
    setLogoutError('');
  }, []);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => {
      if (!prev) {
        setIsNotificationsOpen(false);
        setLogoutError('');
      }
      return !prev;
    });
  }, []);

  const toggleNotifications = useCallback(() => {
    setIsNotificationsOpen((prev) => {
      if (!prev) {
        setIsSidebarOpen(false);
      }
      return !prev;
    });
  }, []);


  /* ── Keyboard shortcut: Cmd/Ctrl+K opens search ── */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        router.push('/search');
      }
      if (e.key === 'Escape') {
        setIsNotificationsOpen(false);
        setIsSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  /* ── Logout ── */
  const handleLogout = useCallback(async () => {
    try {
      const result = await logout();
      if (result.success) {
        setIsSidebarOpen(false);
        router.push('/auth');
      } else {
        setLogoutError(result.error || 'Logout failed.');
      }
    } catch {
      setLogoutError('Failed to log out. Please try again.');
    }
  }, [router]);

  const handleThemeToggle = useCallback(() => toggleTheme(), [toggleTheme]);
  const handleNavigationClick = useCallback((_navType) => { }, []);
  const clearError = useCallback(() => setLogoutError(''), []);

  /* ── Unread messages (Supabase Integration Pending) ── */
  useEffect(() => {
    // Placeholder for Supabase Notifications
    setUnreadThreads([]);
    setUnreadNotifications([]);
  }, [user]);

  const unreadCount = 0; // Temporarily zeroed after Firebase Exorcism

  return (
    <>
      {/* ── Single fixed block: top bar + marquee, no gap between them ── */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <Link
            href="/"
            className={styles.logo}
            onClick={() => handleNavigationClick('home_logo')}
          >
            <Image src="/logo.png" alt="UCCR Logo" width={36} height={36} priority />
            <span>UCCR</span>
          </Link>

          {/* Controls */}
          <div className={styles.headerControls}>
            {/* Search */}
            <Link
              href="/search"
              className={styles.searchButton}
              aria-label="Open search (⌘K)"
            >
              <Search size={20} />
            </Link>

            {/* Theme toggle */}
            <button
              onClick={handleThemeToggle}
              className={styles.themeToggleButton}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'light' ? (
                  <motion.span
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex' }}
                  >
                    <Moon size={20} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="sun"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex' }}
                  >
                    <Sun size={20} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Notifications — only when signed in */}
            {user && (
              <div ref={notificationsButtonRef} className={styles.notificationWrapper}>
                <button
                  onClick={toggleNotifications}
                  className={styles.notificationButton}
                  aria-label={`View notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                  aria-expanded={isNotificationsOpen}
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className={styles.notificationBadge} aria-hidden>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Avatar / hamburger */}
            <div ref={userAvatarRef} className={styles.menuButtonWrapper}>
              {loading ? (
                <SkeletonTheme
                  baseColor="var(--skeleton-base)"
                  highlightColor="var(--skeleton-highlight)"
                >
                  <Skeleton circle width={36} height={36} />
                </SkeletonTheme>
              ) : user ? (
                <Image
                  src={user.photoURL || '/images/doctor-avatar.jpeg'}
                  alt="Open user menu"
                  width={36}
                  height={36}
                  className={styles.userAvatar}
                  onClick={toggleSidebar}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleSidebar()}
                  priority
                />
              ) : (
                <button
                  onClick={toggleSidebar}
                  className={styles.menuButton}
                  aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isSidebarOpen}
                  disabled={loading}
                >
                  <Menu size={24} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Marquee sits directly inside <header> — no extra wrapper, no gap */}
        <MarqueeBand />
      </header>

      {/* ── Modals / overlays ── */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <NotificationsModal
            isOpen={isNotificationsOpen}
            toggleModal={toggleNotifications}
            unreadThreads={unreadThreads}
            unreadNotifications={unreadNotifications}
            handleNavigationClick={handleNavigationClick}
          />
        )}
      </AnimatePresence>


      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={closeSidebar}
        user={user}
        loading={loading}
        handleNavigationClick={handleNavigationClick}
        handleLogout={handleLogout}
        logoutError={logoutError}
        clearError={clearError}
      />
    </>
  );
}