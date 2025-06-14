// src/context/ThemeContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize theme state, ensuring SSR compatibility
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        return 'light'; // Fallback to light theme
      }
    }
    return 'light'; // Default theme for SSR
  });

  // Effect to apply theme and save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark-mode');
          document.documentElement.classList.remove('light-mode');
        } else {
          document.documentElement.classList.add('light-mode');
          document.documentElement.classList.remove('dark-mode');
        }
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.error('Error saving theme to localStorage:', error);
      }
    }
  }, [theme]);

  // Effect to handle system preference changes dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemPreferenceChange = (event) => {
        if (!localStorage.getItem('theme')) {
          setTheme(event.matches ? 'dark' : 'light');
        }
      };

      mediaQuery.addEventListener('change', handleSystemPreferenceChange);
      return () => mediaQuery.removeEventListener('change', handleSystemPreferenceChange);
    }
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}