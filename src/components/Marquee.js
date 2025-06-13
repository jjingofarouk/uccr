'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Marquee.module.css';

export default function Marquee() {
  const marqueeRef = useRef(null);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState(null);

  // Handle scroll to show/hide marquee
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShow(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Fetch headlines from the API
  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const res = await fetch('/api/medical-headlines');
        if (!res.ok) {
          throw new Error('Failed to fetch headlines');
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        // Shuffle headlines and store them
        const shuffled = [...data.headlines].sort(() => Math.random() - 0.5);
        setHeadlines(shuffled);
      } catch (err) {
        console.error('Failed to load headlines:', err);
        setError('Unable to load medical news at this time.');
      }
    };

    fetchHeadlines();
  }, []);

  // Update marquee content when headlines change
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee || headlines.length === 0) return;

    // Create marquee content with headline title, source, and link
    const marqueeContent = [...headlines, ...headlines] // Duplicate for seamless looping
      .map(
        (headline) => `
          <span>
            <a href="${headline.url}" target="_blank" rel="noopener noreferrer" class="${styles.headlineLink}">
              ${headline.title} (${headline.source})
            </a>
          </span>
        `
      )
      .join(' ');

    marquee.innerHTML = marqueeContent;

    // Calculate total width based on content (approximate per headline)
    const avgHeadlineWidth = 400; // Adjust based on average headline length (in pixels)
    const totalWidth = headlines.length * avgHeadlineWidth;
    marquee.style.setProperty('--marquee-width', `${totalWidth}px`);
    marquee.style.setProperty('--marquee-duration', `${totalWidth / 60}s`); // Adjust speed as needed
  }, [headlines]);

  return (
    <div
      className={`${styles.marqueeContainer} ${show ? styles.visible : styles.hidden}`}
      role="region"
      aria-live="polite"
      aria-label="Medical news ticker"
    >
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.marquee} ref={marqueeRef}>
          {/* Fallback content while loading */}
          {headlines.length === 0 && !error && (
            <span>Loading medical news...</span>
          )}
        </div>
      )}
    </div>
  );
}