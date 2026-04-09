import Head from 'next/head';
import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '@mui/material';
import {
  Target,
  Eye,
  Linkedin,
  MessageCircle,
  Globe,
  Phone,
  Mail,
  Github,
  Twitter
} from 'lucide-react';
import styles from './About.module.css';

const About = () => {
  const socialLinks = [
    {
      href: 'https://ug.linkedin.com/in/farouk-jjingo-0341b01a5',
      Icon: Linkedin,
      color: '#0077B5',
      label: 'LinkedIn'
    },
    {
      href: 'https://github.com/jjingofarouk',
      Icon: Github,
      color: '#333',
      label: 'GitHub'
    },
    {
      href: 'mailto:jjingofarouq@gmail.com',
      Icon: Mail,
      color: '#EA4335',
      label: 'Email'
    },
    {
      href: 'https://wa.me/256751360385',
      Icon: MessageCircle,
      color: '#25D366',
      label: 'WhatsApp'
    },
  ];

  return (
    <>
      <Head>
        <title>About Uganda Clinical Case Reports | Medical Case Studies & Healthcare Collaboration</title>
        <meta name="description" content="Learn about Uganda Clinical Case Reports (UCCR), a platform for medical case studies, clinical research, and healthcare collaboration in Uganda. Founded by Farouk Jjingo." />
      </Head>

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
              Uganda Clinical Case Reports (UCCR) is a leading <strong>medical collaboration platform</strong> designed to empower <strong>healthcare professionals</strong>, <strong>medical students</strong>, and <strong>doctors</strong> in Uganda. Share, discuss, and learn from <strong>medical case studies</strong>, <strong>clinical reports</strong>, and <strong>healthcare research</strong> in a secure, structured environment.
            </p>

            <div className={styles.cardGrid}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className={styles.missionCard}
              >
                <div className={styles.cardIconWrapper}>
                  <Target className={styles.cardIcon} size={32} />
                </div>
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
                <div className={styles.cardIconWrapper}>
                  <Eye className={styles.cardIcon} size={32} />
                </div>
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
                Farouk Jjingo is a <strong>medical doctor</strong> and <strong>software developer</strong> with expertise in <strong>clinical diagnostics</strong>, <strong>health tech</strong>, and <strong>clinical research</strong>. UCCR was founded to enhance <strong>clinical case sharing</strong> and <strong>healthcare education</strong> in resource-limited settings.
              </p>
            </section>

            <section className={styles.connectSection}>
              <h2 className={styles.connectTitle}>
                Connect
              </h2>

              <div className={styles.connectContent}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <img
                    src="/jjingo.jpg"
                    alt="Farouk Jjingo"
                    loading="lazy"
                    className={styles.founderImage}
                  />
                </motion.div>

                <div className={styles.connectInfo}>
                  <p className={styles.connectDescription}>
                    Available for <strong> healthcare collaborations</strong>, <strong>medical research</strong>, and <strong>overall platform feedback</strong>.
                  </p>

                  <div className={styles.socialGrid}>
                    {socialLinks.map((link, index) => {
                      const Icon = link.Icon;
                      return (
                        <motion.a
                          key={index}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ y: -5, scale: 1.1 }}
                          className={styles.socialLink}
                          style={{ backgroundColor: link.color }}
                          title={link.label}
                        >
                          <Icon size={24} />
                        </motion.a>
                      )
                    })}
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