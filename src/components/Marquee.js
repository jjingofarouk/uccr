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

// List of fallback medical quotes
const quotes = [
  "The art of medicine consists in amusing the patient while nature cures the disease. – Voltaire",
  "Wherever the art of medicine is loved, there is also a love of humanity. – Hippocrates",
  "Medicine is a science of uncertainty and an art of probability. – William Osler",
  "An ounce of prevention is worth a pound of cure. – Benjamin Franklin",
  "The good physician treats the disease; the great physician treats the patient who has the disease. – William Osler",
  "In nothing do men more nearly approach the gods than in giving health to men. – Cicero",
  "It is far more important to know what person the disease has than what disease the person has. – Hippocrates",
  "The physician should not treat the disease but the patient who is suffering from it. – Maimonides",
  "The greatest medicine of all is to teach people how not to need it. – Hippocrates",
  "The doctor of the future will give no medicine but will interest his patients in the care of the human frame, in diet, and in the cause and prevention of disease. – Thomas Edison",
  "Health is a state of complete harmony of the body, mind, and spirit. – B.K.S. Iyengar",
  "Healing is a matter of time, but it is sometimes also a matter of opportunity. – Hippocrates",
  "Cure sometimes, treat often, comfort always. – Hippocrates",
  "Time is generally the best doctor. – Ovid",
  "A physician is obligated to consider more than a diseased organ, more than even the whole man – he must view the man in his world. – Harvey Cushing",
  "The best doctor gives the least medicines. – Benjamin Franklin",
  "Walking is man’s best medicine. – Hippocrates",
  "Your health is an investment, not an expense. – Unknown",
  "The greatest wealth is health. – Virgil",
  "A cheerful heart is good medicine. – Proverbs 17:22",
  "Prevention is better than cure. – Desiderius Erasmus",
  "Medicine is not only a science; it is also an art. – Paracelsus",
  "Good health and good sense are two of life's greatest blessings. – Publilius Syrus",
  "Every patient carries their own doctor inside them. – Norman Cousins",
];

export default function Marquee() {
  const marqueeRef = useRef(null);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [headlines, setHeadlines] = useState([]);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasTrackedView, setHasTrackedView] = useState(false);

  const isLoading = headlines.length === 0 && !error;

  // Scroll-based visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const shouldShow = currentScrollY < lastScrollY || currentScrollY < 100;

      if (shouldShow !== show) {
        trackMarqueeInteraction(shouldShow ? 'show_marquee' : 'hide_marquee', `scroll_${currentScrollY}`);
      }

      setShow(shouldShow);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, show]);

  // Navbar height adjustment
  useEffect(() => {
    const navbar = document.querySelector('.header');
    if (navbar && marqueeRef.current) {
      marqueeRef.current.style.top = `${navbar.offsetHeight}px`;
    }
  }, []);

  // Fetch news
  useEffect(() => {
    const fetchHeadlines = async () => {
      try {
        const res = await fetch('/api/medical-headlines');
        if (!res.ok) throw new Error('Failed to fetch headlines');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        const shuffled = [...data.headlines].sort(() => Math.random() - 0.5);
        setHeadlines(shuffled);
        trackEvent('fetch_headlines', 'Medical News', 'API Success', shuffled.length);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Unable to load medical news at this time.');
        trackEvent('fetch_headlines_error', 'Medical News', err.message, 1);
      }
    };

    fetchHeadlines();
  }, []);

  useEffect(() => {
    if (headlines.length > 0 && !hasTrackedView) {
      trackMarqueeView(headlines.length);
      setHasTrackedView(true);
    }
  }, [headlines, hasTrackedView]);

  // Animate content: fallback or real
  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    let contentArray;

    if (headlines.length > 0) {
      contentArray = [...headlines, ...headlines].map(
        (h, index) => `
        <span>
          <a href="${h.url}" 
             target="_blank" 
             rel="noopener noreferrer" 
             class="${styles.headlineLink}" 
             data-headline-index="${index % headlines.length}"
             data-headline-source="${h.source}" 
             data-headline-title="${h.title.substring(0, 50)}...">
            ${h.title} (${h.source})
          </a>
        </span>
      `
      );
    } else {
      // Use quotes as fallback
      const shuffledQuotes = [...quotes].sort(() => Math.random() - 0.5).slice(0, 10);
      contentArray = [...shuffledQuotes, ...shuffledQuotes].map((quote) => `<span>${quote}</span>`);
    }

    marquee.innerHTML = contentArray.join(' ');

    // Add tracking for real headlines
    if (headlines.length > 0) {
      const links = marquee.querySelectorAll('a[data-headline-index]');
      links.forEach((link) => {
        link.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-headline-index'));
          const clicked = headlines[idx];
          if (clicked) trackHeadlineClick(clicked);
        });
      });
    }

    // Calculate total width and duration
    const spans = marquee.querySelectorAll('span');
    let totalWidth = 0;
    spans.forEach((span) => {
      totalWidth += span.offsetWidth + 48; // margin approx.
    });

    marquee.style.setProperty('--marquee-width', `${totalWidth / 2}px`);
    marquee.style.setProperty('--marquee-duration', `${totalWidth / 120}s`);
  }, [headlines]);

  // Pause/resume
  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((p) => {
          const newState = !p;
          trackMarqueeInteraction(newState ? 'pause_marquee' : 'resume_marquee', 'keyboard_spacebar');
          return newState;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (marqueeRef.current) {
      marqueeRef.current.style.animationPlayState = isPaused ? 'paused' : 'running';
    }
  }, [isPaused]);

  return (
    <div
      className={`${styles.marqueeContainer} ${show ? styles.visible : styles.hidden}`}
      role="region"
      aria-live="polite"
      aria-label="Medical news ticker"
      onMouseEnter={() => {
        setIsPaused(true);
        trackMarqueeInteraction('pause_marquee', 'mouse_hover');
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        trackMarqueeInteraction('resume_marquee', 'mouse_leave');
      }}
    >
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div
          className={styles.marquee}
          ref={marqueeRef}
          style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
        />
      )}
    </div>
  );
}