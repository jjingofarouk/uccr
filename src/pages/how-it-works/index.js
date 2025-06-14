import React from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { UserCheck, FileText, MessageCircle, BarChart2 } from 'lucide-react';
import Carousel from 'react-material-ui-carousel';
import styles from './works.module.css';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserCheck size={40} />,
      title: 'Create an Account',
      description:
        'Sign up with your email and create a secure password. Set up your profile with a photo and details to connect with other professionals.',
    },
    {
      icon: <FileText size={40} />,
      title: 'Share Clinical Cases',
      description:
        'Document and upload detailed clinical cases, including histories, complaints, investigations, and images, for better collaboration.',
    },
    {
      icon: <MessageCircle size={40} />,
      title: 'Engage in Discussions',
      description:
        'Join discussions on cases, provide insights, ask questions, and react to comments to foster collaborative learning.',
    },
    {
      icon: <BarChart2 size={40} />,
      title: 'Learn and Grow',
      description:
        'Expand your medical knowledge by learning from real-world cases shared by other healthcare professionals.',
    },
  ];

  return (
    <Container maxWidth="md" className={styles.worksContainer}>
      <Typography variant="h3" className={styles.title}>
        How UCCR Works
      </Typography>
      <Typography variant="body1" className={styles.description}>
        UCCR is a modern platform designed to connect healthcare professionals,
        enabling them to share and discuss clinical cases for better
        collaboration and learning.
      </Typography>
      <Carousel
        navButtonsAlwaysVisible
        autoPlay
        animation="slide"
        indicators
        navButtonsProps={{
          style: {
            background: 'var(--primary)',
            color: '#ffffff',
            borderRadius: '50%',
            padding: '8px',
          },
        }}
        navButtonsWrapperProps={{
          style: {
            top: '50%',
            transform: 'translateY(-50%)',
          },
        }}
      >
        {steps.map((step, index) => (
          <Card key={index} className={styles.carouselCard}>
            <Box className={styles.iconWrapper}>{step.icon}</Box>
            <CardContent>
              <Typography variant="h5" className={styles.cardTitle}>
                {step.title}
              </Typography>
              <Typography variant="body2" className={styles.cardDescription}>
                {step.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Carousel>
    </Container>
  );
};

export default HowItWorks;