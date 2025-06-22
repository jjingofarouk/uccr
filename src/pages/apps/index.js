import React from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { ExternalLink } from 'lucide-react';
import styles from './otherApps.module.css';

const OtherApps = () => {
  const apps = [
    {
      title: 'Zunobotics',
      description: 'Democratizing robotics and automation innovation in Africa through open-source technology.',
      link: 'https://zunobotics.com',
      image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/zunobotics/home.jpg',
    },
    {
      title: 'MediQ',
      description: 'A tool to check potential drug interactions with a user-friendly interface and concise results.',
      link: 'https://mediq.vercel.app/',
      image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/mediq/home.png',
    },
    {
      title: 'Dwaliro',
      description: 'A web app for exploring clinical trials from ClinicalTrials.gov with advanced filters and detailed study.',
      link: 'https://dwaliro.vercel.app',
      image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/dwaliro/home.png',
    },
    {
      title: 'FreeResume',
      description: 'A PWA for Ugandan job seekers to create professional, ATS-friendly resumes with real-time previews.',
      link: 'http://free-resume-indol.vercel.app',
      image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/free-resume/home.png',
    },
    // {
    //   title: 'CareWave',
    //   description: 'An enterprise-grade hospital management system for streamlining clinical, administrative, and operational workflows.',
    //   link: 'https://carewave-doctor.vercel.app',
    //   image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/carewave/landing.png',
    // },
    // {
    //   title: 'Ssuubi Chatbot',
    //   description: 'A mental health chatbot providing compassionate, AI-driven support for anxiety, depression, and crisis situations.',
    //   link: 'https://ssuubi-mental-health-bot.onrender.com',
    //   image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/ssuubi/home.png',
    // },
    // {
    //   title: 'Clinical Calculators',
    //   description: 'A mobile app with over 90 specialized calculators for healthcare professionals across multiple specialties.',
    //   link: 'https://clinical-calculators.vercel.app/',
    //   image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/clinical-calculators/home.png',
    // },
    // {
    //   title: 'GigMap',
    //   description: 'A PWA connecting freelancers globally with an interactive map and dynamic profiles for talent discovery.',
    //   link: 'https://gigmap.vercel.app',
    //   image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/gigmap/home.png',
    // },
    // {
    //   title: 'LitShelf',
    //   description: 'A personalized book recommendation app with a hybrid algorithm and interactive preference form.',
    //   link: 'https://litshelf.vercel.app',
    //   image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/litshelf/home.png',
    // },
    // {
    //   title: 'Dr. Osler',
    //   description: 'A PWA offering clinical mentorship through a virtual Ugandan clinician, powered by the Gemini API.',
    //   link: 'https://oslermentor.onrender.com/',
    //   image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/osler/home.png',
    // },
    // {
    //   title: 'BloodMatch',
    //   description: 'A PWA connecting blood donors and recipients in Uganda with geolocation-based matching and notifications.',
    //   link: 'https://bloodmatchug.vercel.app/',
    //   image: 'https://raw.githubusercontent.com/jjingofarouk/portfol/main/public/assets/projects-screenshots/BloodMatch/home.png',
    // },
  ];

  return (
    <Container maxWidth="md" className={styles.otherAppsContainer}>
      <Typography variant="h3" className={styles.title}>
        Other Projects by Farouk Jjingo
      </Typography>
      <Typography variant="body1" className={styles.subtitle}>
Join the Journey — Contribute or Collaborate!
      </Typography>
      <Box className={styles.appsGrid}>
        {apps.map((app, index) => (
          <Card key={index} className={styles.appCard}>
            <CardContent>
              <img src={app.image} alt={`${app.title} homepage`} className={styles.appImage} />
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