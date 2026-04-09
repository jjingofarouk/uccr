import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { trackClick } from '../../utils/analytics';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const archiveWords = [
    'medical case studies',
    'clinical reports',
    'healthcare research',
    'clinical trials',
    'diagnostic cases',
    'surgical procedures',
    'patient outcomes',
    'treatment protocols',
    'ECG cases',
    'X-ray collections',
    'pathology reports',
    'radiology findings',
    'laboratory analyses',
    'case series',
    'disease registries'
  ];
  const researchWords = [
    'medical research',
    'clinical data',
    'healthcare insights',
    'evidence-based studies',
    'peer-reviewed cases',
    'diagnostic findings',
    'treatment outcomes',
    'research publications'
  ];
  const professionals = [
    'doctors',
    'nurses',
    'medical students',
    'researchers',
    'surgeons',
    'specialists',
    'pediatricians',
    'cardiologists',
    'neurologists',
    'oncologists',
    'radiologists',
    'pathologists',
    'anesthesiologists',
    'gynecologists',
    'psychiatrists',
    'dermatologists',
    'orthopedic surgeons',
    'emergency physicians',
    'family medicine doctors',
    'public health experts',
    'clinical pharmacists',
    'medical educators'
  ];
  const locations = [
    'Uganda',
    'East Africa',
    'West Africa',
    'Central Africa',
    'Southern Africa',
    'Sub-Saharan Africa',
    'Kenya',
    'Tanzania',
    'Rwanda',
    'Ghana',
    'Nigeria',
    'South Africa',
    'Ethiopia',
    'Malawi',
    'Zambia',
    'developing nations',
    'emerging markets',
    'global health communities'
  ];

  const [archiveState, setArchiveState] = useState({ index: 0, text: '', isTyping: true });
  const [researchState, setResearchState] = useState({ index: 0, text: '', isTyping: true });
  const [professionalsState, setProfessionalsState] = useState({ index: 0, text: '', isTyping: true });
  const [locationsState, setLocationsState] = useState({ index: 0, text: '', isTyping: true });

  const useTypingEffect = (words, state, setState, speed = 80, pauseTime = 2000, eraseSpeed = 40) => {
    useEffect(() => {
      let timer;
      const currentWord = words[state.index];

      if (state.isTyping) {
        if (state.text.length < currentWord.length) {
          timer = setTimeout(() => {
            setState(prev => ({
              ...prev,
              text: currentWord.substring(0, prev.text.length + 1)
            }));
          }, speed);
        } else {
          timer = setTimeout(() => {
            setState(prev => ({ ...prev, isTyping: false }));
          }, pauseTime);
        }
      } else {
        if (state.text.length > 0) {
          timer = setTimeout(() => {
            setState(prev => ({
              ...prev,
              text: prev.text.substring(0, prev.text.length - 1)
            }));
          }, eraseSpeed);
        } else {
          timer = setTimeout(() => {
            setState(prev => ({
              index: (prev.index + 1) % words.length,
              text: '',
              isTyping: true
            }));
          }, 300);
        }
      }

      return () => clearTimeout(timer);
    }, [state.text, state.isTyping, state.index, words, speed, pauseTime, eraseSpeed]);
  };

  useTypingEffect(archiveWords, archiveState, setArchiveState, 80, 2500, 40);
  useTypingEffect(researchWords, researchState, setResearchState, 90, 2000, 45);
  useTypingEffect(professionals, professionalsState, setProfessionalsState, 70, 1800, 35);
  useTypingEffect(locations, locationsState, setLocationsState, 85, 2200, 50);

  return (
    <>
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 id="hero-title" className={styles.heroTitle}>
            Uganda Clinical Case Reports
          </h1>
          <p className={styles.heroSubtitle}>
            Discover and contribute to a growing archive of{' '}
            <strong>
              <span className={styles.typedTextArchive}>
                {archiveState.text}
                <span className={styles.cursor}>|</span>
              </span>
            </strong>{' '}
            from Uganda. Access valuable{' '}
            <strong>
              <span className={styles.typedTextResearch}>
                {researchState.text}
                <span className={styles.cursorResearch}>|</span>
              </span>
            </strong>{' '}
            for{' '}
            <strong>
              <span className={styles.typedTextProfessionals}>
                {professionalsState.text}
                <span className={styles.cursorProfessionals}>|</span>
              </span>
            </strong>{' '}
            in{' '}
            <strong>
              <span className={styles.typedTextLocations}>
                {locationsState.text}
                <span className={styles.cursorLocations}>|</span>
              </span>
            </strong>.
          </p>
          <div className={styles.heroButtons}>
            <Link
              href="/cases"
              className={styles.ctaButtonPrimary}
              onClick={() => trackClick('browse_cases_button', 'hero')}
              title="Browse Uganda Medical Case Studies and Clinical Reports"
              aria-label="Browse Uganda Medical Case Studies and Clinical Reports"
            >
              Browse Medical Case Studies
            </Link>
            <Link
              href="/cases/new"
              className={styles.ctaButtonSecondary}
              onClick={() => trackClick('share_case_button', 'hero')}
              title="Contribute a Clinical Case Report or Medical Study"
              aria-label="Contribute a Clinical Case Report or Medical Study"
            >
              Share a Clinical Case
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;