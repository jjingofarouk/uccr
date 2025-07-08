import Head from 'next/head';
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@mui/material';
import {
  Target,
  Eye,
  Stethoscope,
  Linkedin,
  MessageCircle,
  Globe,
  FileText,
  Users,
  BookOpen,
  Award,
} from 'lucide-react';
import styles from './About.module.css';

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalStudy",
      name: "Uganda Clinical Case Reports",
      description:
        "UCCR is a collaborative platform for sharing medical case studies, clinical reports, and healthcare research in Uganda, empowering healthcare professionals, medical students, and researchers.",
      studySubject: "Clinical Case Reports, Medical Case Studies, Healthcare Collaboration",
      studyLocation: {
        "@type": "Place",
        name: "Uganda",
        address: {
          "@type": "PostalAddress",
          addressCountry: "UG",
        },
      },
      publisher: {
        "@type": "Organization",
        name: "Uganda Clinical Case Reports",
        founder: {
          "@type": "Person",
          name: "Farouk Jjingo",
          jobTitle: "Medical Doctor and Full Stack Developer",
          description:
            "Farouk Jjingo, a medical doctor and full-stack developer, created UCCR to bridge medical knowledge sharing and healthcare collaboration in Uganda.",
        },
      },
      keywords: [
        "Uganda clinical case reports",
        "medical case studies Uganda",
        "healthcare research Uganda",
        "clinical research platform",
        "medical collaboration Uganda",
        "medical education platform",
        "Farouk Jjingo medical developer"
      ]
    },
    {
      "@type": "Person",
      name: "Farouk Jjingo",
      jobTitle: "Medical Doctor and Full Stack Developer",
      description:
        "Farouk Jjingo is a medical doctor and full-stack developer specializing in clinical diagnostics and healthcare technology.",
      worksFor: {
        "@type": "Organization",
        name: "Uganda Clinical Case Reports"
      },
      url: "https://jjingofarouk.xyz",
      sameAs: [
        "https://ug.linkedin.com/in/farouk-jjingo-0341b01a5",
        "https://wa.me/256751360385"
      ]
    }
  ]
};

const contactLinks = [
  {
    href: 'https://ug.linkedin.com/in/farouk-jjingo-0341b01a5',
    Icon: Linkedin,
    label: 'LinkedIn',
    value: 'Farouk Jjingo',
  },
  {
    href: 'https://wa.me/256751360385',
    Icon: MessageCircle,
    label: 'WhatsApp',
    value: '+256751360385',
  },
  {
    href: 'https://jjingofarouk.xyz',
    Icon: Globe,
    label: 'Website',
    value: 'jjingofarouk.xyz',
  },
  {
    href: '/cases',
    Icon: FileText,
    label: 'Case Studies',
    value: 'Browse Medical Cases',
  },
];

const platformFeatures = [
  {
    Icon: Stethoscope,
    title: 'Clinical Excellence',
    description: 'Advanced diagnostic tools and case management systems',
  },
  {
    Icon: Users,
    title: 'Collaboration',
    description: 'Connect with healthcare professionals across Uganda',
  },
  {
    Icon: BookOpen,
    title: 'Education',
    description: 'Comprehensive medical education and training resources',
  },
  {
    Icon: Award,
    title: 'Research',
    description: 'Cutting-edge medical research and case studies',
  },
];

const About = () => {
  return (
    <>
      <Head>
        <title>About Uganda Clinical Case Reports | Medical Case Studies & Healthcare Collaboration</title>
        <meta
          name="description"
          content="Learn about Uganda Clinical Case Reports (UCCR), a platform for medical case studies, clinical research, and healthcare collaboration in Uganda."
        />
        <meta name="author" content="Farouk Jjingo" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yourwebsite.com/about" />

        {/* OpenGraph */}
        <meta property="og:title" content="About Uganda Clinical Case Reports" />
        <meta property="og:description" content="Discover Uganda Clinical Case Reports (UCCR), a platform for medical collaboration and clinical case sharing in Uganda." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/about" />
        <meta property="og:image" content="https://yourwebsite.com/images/uganda-clinical-case-reports-founder.jpg" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Uganda Clinical Case Reports" />
        <meta name="twitter:description" content="Explore UCCR, a platform for medical case studies and healthcare collaboration." />
        <meta name="twitter:image" content="https://yourwebsite.com/images/uganda-clinical-case-reports-founder.jpg" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className={styles.aboutContainer}>
          <div className={styles.backgroundSurface} />

          <Container maxWidth="lg">
            <h1 className={styles.aboutTitle}>About Uganda Clinical Case Reports</h1>
            <p className={styles.introText}>
              UCCR empowers healthcare professionals and students in Uganda to share and learn from clinical cases. Built by Farouk Jjingo, UCCR strengthens medical knowledge sharing, education, and innovation.
            </p>

            {/* Mission & Vision Cards */}
            <div className={styles.cardGrid}>
              <motion.div className={styles.missionCard} whileHover={{ scale: 1.03 }}>
                <Target size={32} className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>Our Mission</h2>
                <p className={styles.cardContent}>
                  To offer a secure platform for clinical case sharing and foster collaboration among healthcare workers in Uganda.
                </p>
              </motion.div>

              <motion.div className={styles.visionCard} whileHover={{ scale: 1.03 }}>
                <Eye size={32} className={styles.cardIcon} />
                <h2 className={styles.cardTitle}>Our Vision</h2>
                <p className={styles.cardContent}>
                  To bridge gaps in medical knowledge and foster healthcare collaboration across East Africa.
                </p>
              </motion.div>
            </div>

            {/* Platform Features */}
            <section className={styles.featuresSection}>
              <h2 className={styles.sectionTitle}>Platform Features</h2>
              <div className={styles.featuresGrid}>
                {platformFeatures.map((feature, i) => (
                  <motion.div key={i} className={styles.featureCard} whileHover={{ scale: 1.05 }}>
                    <feature.Icon size={24} className={styles.featureIcon} />
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDescription}>{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Founder Section */}
            <section className={styles.founderSection}>
              <h2 className={styles.founderTitle}>Meet the Founder: Farouk Jjingo</h2>
              <p className={styles.founderDescription}>
                Farouk is a medical doctor and full-stack developer. His vision combines medicine and tech to address real challenges in Uganda’s healthcare system.
              </p>
            </section>

            {/* Contact / Connect Section */}
            <section className={styles.connectSection}>
              <h2 className={styles.connectTitle}>Connect for Collaboration</h2>
              <div className={styles.connectContent}>
                <motion.img
                  src="/farouk.png"
                  alt="Farouk Jjingo"
                  className={styles.founderImage}
                  whileHover={{ scale: 1.03 }}
                />
                <div className={styles.contactCard}>
                  <h3 className={styles.contactCardTitle}>Get in Touch</h3>
                  <ul className={styles.contactList}>
                    {contactLinks.map((link, i) => (
                      <li key={i} className={styles.contactItem}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.contactLink}
                        >
                          <link.Icon size={24} />
                          <div className={styles.contactText}>
                            <span>{link.label}</span>
                            <span>{link.value}</span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
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