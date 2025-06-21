// components/HeroSection.jsx
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { trackClick } from '../../utils/analytics';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  const words = [
    'medical case studies',
    'clinical reports',
    'healthcare research',
    'clinical trials'
  ];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    if (isTyping) {
      // Typing forward
      if (currentText.length < currentWord.length) {
        const timer = setTimeout(() => {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        }, 100);
        return () => clearTimeout(timer);
      } else {
        // Finished typing, wait then start erasing
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } else {
      // Erasing backward
      if (currentText.length > 0) {
        const timer = setTimeout(() => {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        }, 50);
        return () => clearTimeout(timer);
      } else {
        // Finished erasing, move to next word
        const timer = setTimeout(() => {
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setIsTyping(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentText, currentWordIndex, isTyping, words]);

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
          content="Explore Uganda Clinical Case Reports, a leading archive of medical case studies, clinical research, healthcare insights, and clinical trials from Uganda. Contribute to medical education, public health, and clinical studies for healthcare professionals, researchers, and students."
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
        <div className={styles.heroContent}>
          <h1 id="hero-title" className={styles.heroTitle}>
            Uganda Clinical Case Reports
          </h1>
          <p className={styles.heroSubtitle}>
            Discover and contribute to a leading archive of{' '}
            <strong>
              <span className={styles.typedText}>
                {currentText}
                <span className={styles.cursor}>|</span>
              </span>
            </strong>{' '}
            from Uganda. Access valuable <strong>medical research</strong>,{' '}
            <strong>healthcare insights</strong>, and <strong>clinical data</strong> for{' '}
            <strong>healthcare professionals</strong>, <strong>medical researchers</strong>,
            and <strong>students</strong> in <strong>Uganda</strong> and{' '}
            <strong>East Africa</strong>.
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