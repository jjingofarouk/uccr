// Sidebar.jsx
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Home, Briefcase, PlusCircle, Grid, Info, User, Inbox, LogOut, LogIn, Shield, BookOpen, Heart } from 'lucide-react';
import styles from '../styles/navbar.module.css';

export default function Sidebar({ isOpen, toggleSidebar, user, loading, handleNavigationClick, handleLogout, logoutError, clearError }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
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
            <Link 
              href="/about" 
              onClick={() => {
                handleNavigationClick('about');
                toggleSidebar();
              }} 
              className={styles.navLink}
            >
              <Info size={20} className={styles.navIcon} />
              About
            </Link>
            <Link 
              href="/how-it-works" 
              onClick={() => {
                handleNavigationClick('how_it_works');
                toggleSidebar();
              }} 
              className={styles.navLink}
            >
              <BookOpen size={20} className={styles.navIcon} />
              How It Works
            </Link>
            <Link 
              href="/privacy" 
              onClick={() => {
                handleNavigationClick('privacy');
                toggleSidebar();
              }} 
              className={styles.navLink}
            >
              <Shield size={20} className={styles.navIcon} />
              Privacy
            </Link>
            <Link 
              href="/apps" 
              onClick={() => {
                handleNavigationClick('apps');
                toggleSidebar();
              }} 
              className={styles.navLink}
            >
              <Grid size={20} className={styles.navIcon} />
              Other Apps
            </Link>
{/*
  <Link 
    href="/support" 
    onClick={() => {
      handleNavigationClick('support');
      toggleSidebar();
    }} 
    className={styles.navLink}
  >
    <Heart size={20} className={styles.navIcon} />
    Support This Project
  </Link>
*/}
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
  );
}