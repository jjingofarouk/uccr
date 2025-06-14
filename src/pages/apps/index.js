import React from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { ExternalLink } from 'lucide-react';
import styles from './otherApps.module.css';

const OtherApps = () => {
  const apps = [
    {
      title: 'CareWave System',
      description: 'An enterprise-grade hospital management system for streamlining clinical, administrative, and operational workflows.',
      link: 'https://carewave-doctor.vercel.app',
    },
    {
      title: 'Ssuubi Chatbot',
      description: 'A mental health chatbot providing compassionate, AI-driven support for anxiety, depression, and crisis situations.',
      link: 'https://ssuubi-mental-health-bot.onrender.com',
    },
    {
      title: 'MediQ',
      description: 'A tool to check potential drug interactions with a user-friendly interface and detailed results.',
      link: 'https://mediq.vercel.app/',
    },
    {
      title: 'Zano!',
      description: 'An online shoe shop with a modern design, offering a seamless shopping experience for the latest styles.',
      link: 'https://zanoug.vercel.app/',
    },
    {
      title: 'Clinical Calculators',
      description: 'A mobile app with over 90 specialized calculators for healthcare professionals across multiple specialties.',
      link: 'https://clinical-calculators.vercel.app/',
    },
    {
      title: 'Matatu Tracker',
      description: 'A PWA for real-time tracking and booking of minibuses in Uganda, with admin and passenger features.',
      link: 'https://matatu-tracker.vercel.app/',
    },
    {
      title: 'Dwaliro',
      description: 'A web app for exploring clinical trials from ClinicalTrials.gov with advanced filters and detailed study insights.',
      link: 'https://dwaliro.vercel.app',
    },
    {
      title: 'FreeResume',
      description: 'A PWA for Ugandan job seekers to create professional, ATS-friendly resumes with real-time previews.',
      link: 'http://free-resume-indol.vercel.app',
    },
    {
      title: 'GigMap',
      description: 'A PWA connecting freelancers globally with an interactive map and dynamic profiles for talent discovery.',
      link: 'https://gigmap.vercel.app',
    },
    {
      title: 'LitShelf',
      description: 'A personalized book recommendation app with a hybrid algorithm and interactive preference form.',
      link: 'https://litshelf.vercel.app',
    },
    {
      title: 'Dr. Jingo',
      description: 'A PWA offering clinical mentorship through a virtual Ugandan clinician, powered by the Gemini API.',
      link: 'https://oslermentor.onrender.com/',
    },
    {
      title: 'BloodMatch',
      description: 'A PWA connecting blood donors and recipients in Uganda with geolocation-based matching and notifications.',
      link: 'https://bloodmatchug.vercel.app/',
    },
    {
      title: 'Touched Hearts',
      description: 'A platform for an NGO focused on education and healthcare in East & Central Africa, with dynamic content.',
      link: 'https://www.touchedhearts.org/',
    },
  ];

  return (
    <Container maxWidth="md" className={styles.otherAppsContainer}>
      <Typography variant="h3" className={styles.title}>
        Other Apps by Farouk Jjingo
      </Typography>
      <Typography variant="body1" className={styles.subtitle}>
        Explore innovative apps developed by Farouk Jjingo, leveraging technology to solve real-world problems in healthcare, education, and beyond.
      </Typography>
      <Box className={styles.appsGrid}>
        {apps.map((app, index) => (
          <Card key={index} className={styles.appCard}>
            <CardContent>
              <Typography variant="h5" className={styles.appTitle}>
                {app.title}
              </Typography>
              <Typography variant="body2" className={styles.appDescription}>
                {app.description}
              </Typography>
              <a
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.appButton}
              >
                Visit App
                <ExternalLink className={styles.buttonIcon} />
              </a>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default OtherApps;