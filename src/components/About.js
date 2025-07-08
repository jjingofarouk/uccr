'use client';

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
            Uganda Clinical Case Reports (UCCR) is a leading <strong>medical collaboration platform</strong> designed to empower <strong>healthcare professionals</strong>, <strong>medical students</strong>, and <strong>doctors</strong> in Uganda. Share, discuss, and learn from <strong>medical case studies</strong>, <strong>clinical reports</strong>, and <strong>healthcare research</strong> in a secure, structured environment. UCCR promotes <strong>medical education</strong>, <strong>clinical data sharing</strong>, and <strong>healthcare innovation</strong> across <strong>Uganda</strong> and <strong>East Africa</strong>.
          </p>

          <div className={styles.cardGrid}>
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }} className={styles.missionCard}>
              <div className={styles.cardIconWrapper}>
                <Target className={styles.cardIcon} size={32} />
              </div>
              <h2 className={styles.cardTitle}>Our Mission</h2>
              <p className={styles.cardContent}>
                To provide a secure, accessible <strong>clinical research platform</strong> for <strong>healthcare professionals</strong> to share <strong>clinical knowledge</strong>, collaborate on <strong>medical case studies</strong>, and advance <strong>medical education</strong> and <strong>healthcare innovation</strong> in Uganda.
              </p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }} className={styles.visionCard}>
              <div className={styles.cardIconWrapper}>
                <Eye className={styles.cardIcon} size={32} />
              </div>
              <h2 className={styles.cardTitle}>Our Vision</h2>
              <p className={styles.cardContent}>
                To bridge the gap in <strong>medical knowledge sharing</strong> by creating a digital <strong>healthcare collaboration platform</strong> where <strong>clinical expertise</strong> and <strong>medical case reports</strong> are accessible to all <strong>healthcare professionals</strong> in <strong>Uganda</strong> and <strong>East Africa</strong>.
              </p>
            </motion.div>
          </div>

          <section className={styles.featuresSection}>
            <h2 className={styles.sectionTitle}>Platform Features</h2>
            <div className={styles.featuresGrid}>
              {platformFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className={styles.featureCard}
                >
                  <div className={styles.featureIconWrapper}>
                    <feature.Icon className={styles.featureIcon} size={24} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className={styles.founderSection}>
            <h2 className={styles.founderTitle}>Meet the Founder: Farouk Jjingo</h2>
            <p className={styles.founderDescription}>
              Farouk Jjingo is a visionary <strong>medical doctor</strong> and <strong>full-stack developer</strong> with expertise in <strong>clinical diagnostics</strong>, <strong>healthcare technology</strong>, and <strong>medical research</strong>. He founded UCCR to enhance <strong>medical collaboration</strong>, <strong>clinical case sharing</strong>, and <strong>healthcare education</strong> in Uganda.
            </p>
          </section>

          <section className={styles.connectSection}>
            <h2 className={styles.connectTitle}>Connect for Healthcare Collaboration</h2>
            <div className={styles.connectContent}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <img
                  src="/farouk.png"
                  alt="Farouk Jjingo"
                  loading="lazy"
                  className={styles.founderImage}
                />
              </motion.div>

              <div className={styles.connectInfo}>
                <p className={styles.connectDescription}>
                  Farouk Jjingo is available for <strong>healthcare collaboration</strong>, <strong>medical research discussions</strong>, and <strong>clinical platform feedback</strong>. Connect with him to explore <strong>medical case studies</strong> and <strong>healthcare technology</strong>.
                </p>

                <div className={styles.contactCard}>
                  <h3 className={styles.contactCardTitle}>Get in Touch</h3>
                  <ul className={styles.contactList}>
                    {contactLinks.map((link, index) => (
                      <li key={index} className={styles.contactItem}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.contactLink}
                        >
                          <span className={styles.contactIcon}>
                            <link.Icon size={24} />
                          </span>
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
  );
};

export default About;