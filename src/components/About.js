import Head from 'next/head';
import React from 'react';
import { motion } from 'framer-motion';
import { Container, Box, Typography, Card, CardContent, Link, List, ListItem, ListItemText } from '@mui/material';

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
        <Container
          maxWidth="lg"
          sx={{
            py: 6,
            position: 'relative',
            bgcolor: 'var(--background)',
            color: 'var(--text)',
            transition: 'background 0.3s ease, color 0.3s ease',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'var(--surface)',
              borderRadius: '16px',
              zIndex: -1,
            }}
          />

          <Typography
            variant="h2"
            sx={{
              mb: 4,
              fontWeight: 700,
              color: 'var(--primary)',
              textAlign: 'center',
            }}
          >
            About Uganda Clinical Case Reports
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Typography
              variant="body1"
              sx={{
                maxWidth: '48rem',
                color: 'var(--text)',
                lineHeight: 1.8,
                textAlign: 'center',
                margin: '0 auto',
              }}
            >
              Uganda Clinical Case Reports (UCCR) is a leading <strong>medical collaboration platform</strong> designed to empower <strong>healthcare professionals</strong>, <strong>medical students</strong>, and <strong>doctors</strong> in Uganda. Share, discuss, and learn from <strong>medical case studies</strong>, <strong>clinical reports</strong>, and <strong>healthcare research</strong> in a secure, structured environment. UCCR promotes <strong>medical education</strong>, <strong>clinical data sharing</strong>, and <strong>healthcare innovation</strong> across <strong>Uganda</strong> and <strong>East Africa</strong>.
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 3,
              }}
            >
              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                <Card
                  sx={{
                    bgcolor: 'var(--primary)',
                    color: 'var(--surface)',
                    p: 3,
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px var(--shadow)',
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      Our Mission
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                      To provide a secure, accessible <strong>clinical research platform</strong> for <strong>healthcare professionals</strong> to share <strong>clinical knowledge</strong>, collaborate on <strong>medical case studies</strong>, and advance <strong>medical education</strong> and <strong>healthcare innovation</strong> in Uganda.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
                <Card
                  sx={{
                    bgcolor: 'var(--primary)',
                    color: 'var(--surface)',
                    p: 3,
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px var(--shadow)',
                  }}
                >
                  <CardContent>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                      Our Vision
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                      To bridge the gap in <strong>medical knowledge sharing</strong> by creating a digital <strong>healthcare collaboration platform</strong> where <strong>clinical expertise</strong> and <strong>medical case reports</strong> are accessible to all <strong>healthcare professionals</strong> in <strong>Uganda</strong> and <strong>East Africa</strong>.
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
                Meet the Founder: Farouk Jjingo
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  maxWidth: '48rem',
                  color: 'var(--text)',
                  lineHeight: 1.7,
                }}
              >
                Farouk Jjingo is a visionary <strong>medical doctor</strong> and <strong>full-stack developer</strong> with expertise in <strong>clinical diagnostics</strong>, <strong>healthcare technology</strong>, and <strong>medical research</strong>. He founded UCCR to enhance <strong>medical collaboration</strong>, <strong>clinical case sharing</strong>, and <strong>healthcare education</strong> in Uganda. Combining his skills in <strong>healthcare innovation</strong> and software development, Farouk drives solutions for real-world <strong>healthcare challenges</strong> in <strong>East Africa</strong>.
              </Typography>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: 'var(--primary)',
                  mb: 3,
                }}
              >
                Connect for Healthcare Collaboration
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 4,
                  alignItems: { xs: 'center', md: 'flex-start' },
                }}
              >
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  <Box
                    component="img"
                    src="/farouk.png"
                    alt="Farouk Jjingo, Medical Doctor and Full Stack Developer, Founder of Uganda Clinical Case Reports"
                    loading="lazy"
                    sx={{
                      width: { xs: '10rem', md: '14rem' },
                      height: { xs: '10rem', md: '14rem' },
                      borderRadius: '50%',
                      border: '4px solid var(--primary-dark)',
                      boxShadow: '0 4px 14px var(--shadow)',
                      objectFit: 'cover',
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': { borderColor: 'var(--primary)' },
                    }}
                  />
                </motion.div>
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body2" sx={{ color: 'var(--text)', lineHeight: 1.7 }}>
                    Farouk Jjingo is available for <strong>healthcare collaboration</strong>, <strong>medical research discussions</strong>, and <strong>clinical platform feedback</strong>. Connect with him to explore <strong>medical case studies</strong>, <strong>healthcare technology</strong>, or <strong>clinical research opportunities</strong>:
                  </Typography>
                  <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <ListItem disablePadding>
                      <ListItemText>
                        <Link
                          href="https://ug.linkedin.com/in/farouk-jjingo-0341b01a5"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'var(--accent)',
                            textDecoration: 'none',
                            '&:hover': { color: 'var(--primary-hover)' },
                          }}
                          aria-label="Farouk Jjingo LinkedIn Profile for Medical and Tech Collaboration"
                          title="Connect with Farouk Jjingo on LinkedIn for Healthcare Collaboration"
                        >
                          LinkedIn: Farouk Jjingo
                        </Link>
                      </ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText>
                        <Link
                          href="https://wa.me/256751360385"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'var(--accent)',
                            textDecoration: 'none',
                            '&:hover': { color: 'var(--primary-hover)' },
                          }}
                          aria-label="Contact Farouk Jjingo via WhatsApp for Medical Research"
                          title="WhatsApp Farouk Jjingo for Clinical Research Discussions"
                        >
                          WhatsApp: +256751360385
                        </Link>
                      </ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText>
                        <Link
                          href="https://jjingofarouk.xyz"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'var(--accent)',
                            textDecoration: 'none',
                            '&:hover': { color: 'var(--primary-hover)' },
                          }}
                          aria-label="Farouk Jjingo's Website for Healthcare Technology Insights"
                          title="Visit Farouk Jjingo’s Website for Medical and Tech Projects"
                        >
                          Website: jjingofarouk.xyz
                        </Link>
                      </ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText>
                        <Link
                          href="/cases"
                          sx={{
                            color: 'var(--accent)',
                            textDecoration: 'none',
                            '&:hover': { color: 'var(--primary-hover)' },
                          }}
                          aria-label="Browse Uganda Medical Case Studies"
                          title="Explore Medical Case Studies on UCCR"
                        >
                          Browse Medical Case Studies
                        </Link>
                      </ListItemText>
                    </ListItem>
                  </List>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </motion.div>
    </>
  );
};

export default About;