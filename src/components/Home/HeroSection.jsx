import Head from 'next/head';
import Link from 'next/link';
import { trackClick } from '../../utils/analytics';
import styles from './HeroSection.module.css';

const HeroSection = () => {
  // Structured data with extensive keywords
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
        <meta property="og:url" content="https://yourwebsite.com" />
        <meta
          property="og:image"
          content="https://yourwebsite.com/images/uganda-clinical-case-reports.jpg"
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
          content="https://yourwebsite.com/images/uganda-clinical-case-reports.jpg"
        />
        <link rel="canonical" href="https://yourwebsite.com" />
      </Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className={styles.hero} aria-labelledby="hero-title">
        <h1 id="hero-title" className={styles.heroTitle}>
          Uganda Clinical Case Reports
        </h1>
        <p className={styles.heroSubtitle}>
          Discover and contribute to a leading archive of{' '}
          <strong>medical case studies</strong>, <strong>clinical reports</strong>,{' '}
          <strong>healthcare research</strong>, and <strong>clinical trials</strong> from
          Uganda. Access valuable <strong>medical research</strong>,{' '}
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
        {/* Optional hero image for visual appeal and SEO */}
        <img
          src="/images/uganda-clinical-case-reports.jpg"
          alt="Uganda Clinical Case Reports - Medical Case Studies and Healthcare Research"
          className={styles.heroImage}
          loading="lazy"
        />
      </section>
    </>
  );
};

export default HeroSection;