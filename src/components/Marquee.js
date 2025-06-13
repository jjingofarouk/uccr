'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Marquee.module.css';

export default function Marquee() {
  const marqueeRef = useRef(null);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShow(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const marquee = marqueeRef.current;
    if (!marquee) return;

    fetch('/api/medical-headlines')
      .then(res => res.json())
      .then(data => {
        const shuffled = [...data.headlines].sort(() => Math.random() - 0.5);
        marquee.innerHTML = [...shuffled, ...shuffled]
          .map(msg => `<span>${msg}</span>`)
          .join('');

        const totalWidth = shuffled.length * 300;
        marquee.style.setProperty('--marquee-width', `${totalWidth}px`);
        marquee.style.setProperty('--marquee-duration', `${totalWidth / 60}s`);
      })
      .catch(err => {
        console.error('Failed to load headlines:', err);
      });
  }, []);

  return (
    <div
      className={`${styles.marqueeContainer} ${show ? styles.visible : styles.hidden}`}
    >
      <div className={styles.marquee} ref={marqueeRef}></div>
    </div>
  );
}