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

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'MedicalStudy',
    name: 'Uganda Clinical Case Reports',
    description:
      'A comprehensive archive of Uganda medical case studies, clinical reports, healthcare research, and clinical trials for healthcare professionals, medical researchers, and students.',
    studySubject: 'Clinical Case Reports, Medical Studies, Healthcare Research',
    studyLocation: {
      '@type': 'Place',
      name: 'Uganda',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'UG',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Uganda Clinical Case Reports',
    },
    keywords: [
      'Uganda clinical case reports',
      'medical case studies Uganda',
      'healthcare research Uganda',
      'clinical research Africa',
      'Uganda medical research',
      'clinical trials Uganda',
      'medical case reports',
      'healthcare studies Uganda',
      'medical journals Uganda',
      'clinical case studies',
      'Uganda health studies',
      'medical research Africa',
      'healthcare professionals Uganda',
      'clinical reports Uganda',
      'medical education Uganda',
      'public health Uganda',
      'medical case study database',
      'Uganda healthcare insights',
      'clinical case archive',
      'health research Uganda',
      'medical case reports Africa',
      'Uganda clinical trials',
      'healthcare case studies',
      'medical studies East Africa',
      'clinical data Uganda',
      'healthcare innovation Uganda',
    ],
  };

  return (
    <>
      <Head>
        <title>
          Uganda Clinical Case Reports | Medical Case Studies & Healthcare Research
        </title>
        <meta
          name="description"
          content="Explore Uganda Clinical Case Reports, a growing archive of medical case studies, clinical research, healthcare insights, and clinical trials from Uganda. Contribute to medical education, public health, and clinical studies for healthcare professionals, researchers, and students."
        />
        <meta
          name="keywords"
          content="Uganda clinical case reports, medical case studies Uganda, healthcare research Uganda, clinical research Africa, Uganda medical research, clinical trials Uganda, medical case reports, healthcare studies Uganda, medical journals Uganda, clinical case studies, Uganda health studies, medical research Africa, healthcare professionals Uganda, clinical reports Uganda, medical education Uganda, public health Uganda, medical case study database, Uganda healthcare insights, clinical case archive, health research Uganda, medical case reports Africa, Uganda clinical trials, healthcare case studies, medical studies East Africa, clinical data Uganda, healthcare innovation Uganda, medical research database, clinical insights Uganda, health studies Africa"
        />
        <meta name="author" content="Uganda Clinical Case Reports" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Uganda Clinical Case Reports | Medical Case Studies & Healthcare Research"
        />
        <meta
          property="og:description"
          content="Discover Uganda Clinical Case Reports, a comprehensive collection of medical case studies, clinical research, healthcare insights, and clinical trials from Uganda for healthcare professionals and researchers."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ugandacasereports.org" />
        <meta
          property="og:image"
          content="https://ugandacasereports.org/reports.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Uganda Clinical Case Reports | Medical Case Studies & Healthcare Research"
        />
        <meta
          name="twitter:description"
          content="Explore Uganda Clinical Case Reports for medical case studies, clinical research, healthcare insights, and clinical trials from Uganda."
        />
        <meta
          name="twitter:image"
          content="https://ugandacasereports.org/reports.jpg"
        />
        <link rel="canonical" href="https://ugandacasereports.org" />
      </Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className={styles.hero} aria-labelledby="hero-title">
        <video
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/hospital.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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