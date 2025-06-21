import Head from 'next.js/head';
import React from 'react';
import { motion } from 'framer-motion';
import { Container, Box, Typography } from '@mui/material';
import styles from './About.module.css';

const About = () => {
  // Structured data for MedicalStudy, Person, and Organization
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'MedicalStudy',
      name: 'Uganda Clinical Case Reports',
      description:
        'UCCR is a collaborative platform for sharing medical case studies, clinical reports, and healthcare research in Uganda, empowering healthcare professionals, medical students, and researchers.',
      studySubject: 'Clinical Case Reports, Medical Case Studies, Healthcare Collaboration',
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
        founder: {
          '@type': 'Person',
          name: 'Farouk Jjingo',
          jobTitle: 'Medical Doctor and Full Stack Developer',
          description:
            'Farouk Jjingo, a medical doctor and full-stack developer, created UCCR to bridge medical knowledge sharing and healthcare collaboration in Uganda.',
        },
      },
      keywords: [
        'Uganda clinical case reports',
        'medical case studies Uganda',
        'healthcare research Uganda',
        'clinical research platform',
        'medical collaboration Uganda',
        'healthcare professionals Uganda',
        'clinical trials Uganda',
        'medical education platform',
        'Uganda medical research',
        'clinical case archive',
        'healthcare innovation Uganda',
        'medical case reports Africa',
        'clinical data sharing',
        'Uganda health studies',
        'medical research East Africa',
        'healthcare collaboration platform',
        'clinical case studies Uganda',
        'medical journals Uganda',
        'public health Uganda',
        'healthcare technology Uganda',
        'medical case study database',
        'clinical insights Uganda',
        'health research Africa',
        'Uganda clinical trials',
        'medical education Uganda',
        'healthcare case studies',
        'Farouk Jjingo medical developer',
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Farouk Jjingo',
      jobTitle: 'Medical Doctor and Full Stack Developer',
      description:
        'Farouk Jjingo is a medical doctor and full-stack developer specializing in clinical diagnostics and healthcare technology, founder of Uganda Clinical Case Reports.',
      worksFor: {
        '@type': 'Organization',
        name: 'Uganda Clinical Case Reports',
      },
      url: 'https://jjingofarouk.xyz',
      sameAs: [
        'https://ug.linkedin.com/in/farouk-jjingo-0341b01a5',
        'https://wa.me/256751360385',
      ],
    },
  ];

  const contactLinks = [
    {
      href: 'https://ug.linkedin.com/in/farouk-jjingo-0341b01a5',
      icon: '💼',
      label: 'LinkedIn',
      value: 'Farouk Jjingo',
      ariaLabel: 'Farouk Jjingo LinkedIn Profile for Medical and Tech Collaboration',
      title: 'Connect with Farouk Jjingo on LinkedIn for Healthcare Collaboration'
    },
    {
      href: 'https://wa.me/256751360385',
      icon: '📱',
      label: 'WhatsApp',
      value: '+256751360385',
      ariaLabel: 'Contact Farouk Jjingo via WhatsApp for Medical Research',
      title: 'WhatsApp Farouk Jjingo for Clinical Research Discussions'
    },
    {
      href: 'https://jjingofarouk.xyz',
      icon: '🌐',
      label: 'Website',
      value: 'jjingofarouk.xyz',
      ariaLabel: 'Farouk Jjingo\'s Website for Healthcare Technology Insights',
      title: 'Visit Farouk Jjingo\'s Website for Medical and Tech Projects'
    },
    {
      href: '/cases',
      icon: '📋',
      label: 'Case Studies',
      value: 'Browse Medical Cases',
      ariaLabel: 'Browse Uganda Medical Case Studies',
      title: 'Explore Medical Case Studies on UCCR'
    }
  ];

  return (
    <>
      <Head>
        <title>
          About Uganda Clinical Case Reports | Medical Case Studies & Healthcare Collaboration
        </title>
        <meta
          name="description"
          content="Learn about Uganda Clinical Case Reports (UCCR), a platform for medical case studies, clinical research, and healthcare collaboration in Uganda. Founded by Farouk Jjingo, a medical doctor and full-stack developer, UCCR empowers healthcare professionals and students."
        />
        <meta
          name="keywords"
          content="Uganda clinical case reports, medical case studies Uganda, healthcare research Uganda, clinical research platform, medical collaboration Uganda, healthcare professionals Uganda, clinical trials Uganda, medical education platform, Uganda medical research, clinical case archive, healthcare innovation Uganda, medical case reports Africa, clinical data sharing, Uganda health studies, medical research East Africa, healthcare collaboration platform, clinical case studies Uganda, medical journals Uganda, public health Uganda, healthcare technology Uganda, medical case study database, clinical insights Uganda, health research Africa, Uganda clinical trials, medical education Uganda, healthcare case studies, Farouk Jjingo, medical doctor developer"
        />
        <meta name="author" content="Farouk Jjingo, Uganda Clinical Case Reports" />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="About Uganda Clinical Case Reports | Medical Case Studies & Healthcare Collaboration"
        />
        <meta
          property="og:description"
          content="Discover Uganda Clinical Case Reports (UCCR), a platform for sharing medical case studies, clinical research, and healthcare collaboration in Uganda, founded by Farouk Jjingo, a medical doctor and full-stack developer."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/about" />
        <meta
          property="og:image"
          content="https://yourwebsite.com/images/uganda-clinical-case-reports-founder.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About Uganda Clinical Case Reports | Medical Case Studies & Healthcare Collaboration"
        />
        <meta
          name="twitter:description"
          content="Explore Uganda Clinical Case Reports (UCCR), a platform for medical case studies and healthcare collaboration in Uganda, founded by Farouk Jjingo."
        />
        <meta
          name="twitter:image"
          content="https://yourwebsite.com/images/uganda-clinical-case-reports-founder.jpg"
        />
        <link rel="canonical" href="https://yourwebsite.com/about" />
      </Head>
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className={styles.aboutContainer}>
          <div className={styles.backgroundSurface} />
          
          <Container maxWidth="lg">
            <h1 className={styles.aboutTitle}>
              About Uganda Clinical Case Reports
            </h1>

            <p className={styles.introText}>
              Uganda Clinical Case Reports (UCCR) is a leading <strong>medical collaboration platform</strong> designed to empower <strong>healthcare professionals</strong>, <strong>medical students</strong>, and <strong>doctors</strong> in Uganda. Share, discuss, and learn from <strong>medical case studies</strong>, <strong>clinical reports</strong>, and <strong>healthcare research</strong> in a secure, structured environment. UCCR promotes <strong>medical education</strong>, <strong>clinical data sharing</strong>, and <strong>healthcare innovation</strong> across <strong>Uganda</strong> and <strong>East Africa</strong>.
            </p>

            <div className={styles.cardGrid}>
              <motion.div 
                whileHover={{ scale: 1.03 }} 
                transition={{ duration: 0.3 }}
                className={styles.missionCard}
              >
                <h2 className={styles.cardTitle}>Our Mission</h2>
                <p className={styles.cardContent}>
                  To provide a secure, accessible <strong>clinical research platform</strong> for <strong>healthcare professionals</strong> to share <strong>clinical knowledge</strong>, collaborate on <strong>medical case studies</strong>, and advance <strong>medical education</strong> and <strong>healthcare innovation</strong> in Uganda.
                </p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.03 }} 
                transition={{ duration: 0.3 }}
                className={styles.visionCard}
              >
                <h2 className={styles.cardTitle}>Our Vision</h2>
                <p className={styles.cardContent}>
                  To bridge the gap in <strong>medical knowledge sharing</strong> by creating a digital <strong>healthcare collaboration platform</strong> where <strong>clinical expertise</strong> and <strong>medical case reports</strong> are accessible to all <strong>healthcare professionals</strong> in <strong>Uganda</strong> and <strong>East Africa</strong>.
                </p>
              </motion.div>
            </div>

            <section className={styles.founderSection}>
              <h2 className={styles.founderTitle}>
                Meet the Founder: Farouk Jjingo
              </h2>
              <p className={styles.founderDescription}>
                Farouk Jjingo is a visionary <strong>medical doctor</strong> and <strong>full-stack developer</strong> with expertise in <strong>clinical diagnostics</strong>, <strong>healthcare technology</strong>, and <strong>medical research</strong>. He founded UCCR to enhance <strong>medical collaboration</strong>, <strong>clinical case sharing</strong>, and <strong>healthcare education</strong> in Uganda. Combining his skills in <strong>healthcare innovation</strong> and software development, Farouk drives solutions for real-world <strong>healthcare challenges</strong> in <strong>East Africa</strong>.
              </p>
            </section>

            <section className={styles.connectSection}>
              <h2 className={styles.connectTitle}>
                Connect for Healthcare Collaboration
              </h2>
              
              <div className={styles.connectContent}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <img
                    src="/farouk.png"
                    alt="Farouk Jjingo, Medical Doctor and Full Stack Developer, Founder of Uganda Clinical Case Reports"
                    loading="lazy"
                    className={styles.founderImage}
                  />
                </motion.div>
                
                <div className={styles.connectInfo}>
                  <p className={styles.connectDescription}>
                    Farouk Jjingo is available for <strong>healthcare collaboration</strong>, <strong>medical research discussions</strong>, and <strong>clinical platform feedback</strong>. Connect with him to explore <strong>medical case studies</strong>, <strong>healthcare technology</strong>, or <strong>clinical research opportunities</strong>:
                  </p>
                  
                  <div className={styles.contactCard}>
                    <h3 className={styles.contactCardTitle}>
                      Get in Touch
                    </h3>
                    
                    <ul className={styles.contactList}>
                      {contactLinks.map((link, index) => (
                        <li key={index} className={styles.contactItem}>
                          <a
                            href={link.href}
                            target={link.href.startsWith('http') ? '_blank' : undefined}
                            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className={styles.contactLink}
                            aria-label={link.ariaLabel}
                            title={link.title}
                          >
                            <span className={styles.contactIcon}>{link.icon}</span>
                            <div className={styles.contactText}>
                              <span className={styles.contactLabel}>{link.label}</span>
                              <span className={styles.contactValue}>{link.value}</span>
                            </div>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </Container>
        </div>
      </motion.div>
    </>
  );
};

export default About;