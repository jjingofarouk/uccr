'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Marquee.module.css';

// Google Analytics tracking functions
const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

const trackHeadlineClick = (headline) => {
  trackEvent('click_headline', 'Medical News', `${headline.source}: ${headline.title}`, 1);
};

const trackMarqueeInteraction = (action, detail) => {
  trackEvent(action, 'Marquee Interaction', detail, 1);
};

const trackMarqueeView = (headlineCount) => {
  trackEvent('view_marquee', 'Medical News', 'Headlines Loaded', headlineCount);
};

export default function Marquee() {
  const marqueeRef = useRef(null);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  // Handle scroll to show/hide marquee
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const shouldShow = currentScrollY < lastScrollY || currentScrollY < 100;
      
      // Track marquee visibility changes
      if (shouldShow !== show) {
        trackMarqueeInteraction(shouldShow ? 'show_marquee' : 'hide_marquee', `scroll_${currentScrollY}`);
      }
      
      setShow(shouldShow);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, show]);

  // Dynamically set marquee position below navbar
  useEffect(() => {
    const navbar = document.querySelector('.header');
    if (navbar && marqueeRef.current) {
      const navbarHeight = navbar.offsetHeight;
      marqueeRef.current.style.top = `${navbarHeight}px`;
    }
  }, []);

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
        
        // Track successful headline fetch
        trackEvent('fetch_headlines', 'Medical News', 'API Success', shuffled.length);
        
      } catch (err) {
        console.error('Failed to load headlines:', err);
        setError('Unable to load medical news at this time.');
        
        // Track headline fetch error
        trackEvent('fetch_headlines_error', 'Medical News', err.message, 1);
      }
    };

    fetchHeadlines();
  }, []);

  // Track marquee view when headlines are loaded
  useEffect(() => {
    if (headlines.length > 0 && !hasTrackedView) {
      trackMarqueeView(headlines.length);
      setHasTrackedView(true);
    }
  }, [headlines, hasTrackedView]);

  // Update marquee content and animation
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee || headlines.length === 0) return;

    // Create marquee content with headline title, source, and link
    const marqueeContent = [...headlines, ...headlines] // Duplicate for seamless looping
      .map(
        (headline, index) => `
          <span>
            <a href="${headline.url}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="${styles.headlineLink}"
               data-headline-index="${index % headlines.length}"
               data-headline-source="${headline.source}"
               data-headline-title="${headline.title.substring(0, 50)}...">
              ${headline.title} (${headline.source})
            </a>
          </span>
        `
      )
      .join(' ');

    marquee.innerHTML = marqueeContent;

    // Add click event listeners to all headline links
    const headlineLinks = marquee.querySelectorAll('a[data-headline-index]');
    headlineLinks.forEach((link, linkIndex) => {
      link.addEventListener('click', (e) => {
        const headlineIndex = parseInt(e.target.getAttribute('data-headline-index'));
        const headline = headlines[headlineIndex];
        if (headline) {
          trackHeadlineClick(headline);
        }
      });
    });

    // Calculate total width more accurately
    const spans = marquee.querySelectorAll('span');
    let totalWidth = 0;
    spans.forEach((span) => {
      totalWidth += span.offsetWidth + 48; // Include margin (1.5rem * 2 = 24px * 2)
    });
    marquee.style.setProperty('--marquee-width', `${totalWidth / 2}px`); // Divide by 2 since content is duplicated
    marquee.style.setProperty('--marquee-duration', `${totalWidth / 120}s`); // Adjusted speed for smoother scrolling
  }, [headlines]);

  // Handle keyboard pause/resume for accessibility
  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault(); // Prevent page scroll
        const newPausedState = !isPaused;
        setIsPaused(newPausedState);
        
        // Track pause/resume actions
        trackMarqueeInteraction(
          newPausedState ? 'pause_marquee' : 'resume_marquee', 
          'keyboard_spacebar'
        );
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [isPaused]);

  // Apply pause state to animation
  useEffect(() => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = isPaused ? 'paused' : 'running';
    }
  }, [isPaused]);

  // Handle mouse hover pause/resume
  const handleMouseEnter = () => {
    setIsPaused(true);
    trackMarqueeInteraction('pause_marquee', 'mouse_hover');
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    trackMarqueeInteraction('resume_marquee', 'mouse_leave');
  };

  return (
    <div
      className={`${styles.marqueeContainer} ${show ? styles.visible : styles.hidden}`}
      role="region"
      aria-live="polite"
      aria-label="Medical news ticker"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div
          className={styles.marquee}
          ref={marqueeRef}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        >
          {/* Fallback content while loading */}
          {headlines.length === 0 && !error && (
            <span>Loading medical news...</span>
          )}
        </div>
      )}
    </div>
  );
}