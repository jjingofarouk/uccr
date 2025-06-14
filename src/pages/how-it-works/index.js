import React from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { UserCheck, FileText, MessageCircle, BarChart2 } from 'lucide-react';
import Carousel from 'react-material-ui-carousel';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserCheck size={40} style={{ color: 'var(--primary)' }} />,
      title: 'Create an Account',
      description:
        'Sign up with your email and create a secure password. Set up your profile with a photo and details to connect with other professionals.',
    },
    {
      icon: <FileText size={40} style={{ color: 'var(--primary)' }} />,
      title: 'Share Clinical Cases',
      description:
        'Document and upload detailed clinical cases, including histories, complaints, investigations, and images, for better collaboration.',
    },
    {
      icon: <MessageCircle size={40} style={{ color: 'var(--primary)' }} />,
      title: 'Engage in Discussions',
      description:
        'Join discussions on cases, provide insights, ask questions, and react to comments to foster collaborative learning.',
    },
    {
      icon: <BarChart2 size={40} style={{ color: 'var(--primary)' }} />,
      title: 'Learn and Grow',
      description:
        'Expand your medical knowledge by learning from real-world cases shared by other healthcare professionals.',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{ color: 'var(--primary)', fontWeight: 700, mb: 4 }}
      >
        How UCCR Works
      </Typography>
      <Typography
        variant="body1"
        align="center"
        paragraph
        sx={{ color: 'var(--text)', mb: 6 }}
      >
        UCCR is a modern platform designed to connect healthcare professionals,
        enabling them to share and discuss clinical cases for better
        collaboration and learning.
      </Typography>
      <Carousel
        navButtonsAlwaysVisible
        autoPlay
        animation="slide"
        indicators={false}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
          },
        }}
      >
        {steps.map((step, index) => (
          <Card
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 3,
              boxShadow: '0 4px 14px var(--shadow)',
              backgroundColor: 'var(--surface)',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Box sx={{ mr: 3, display: 'flex', alignItems: 'center' }}>
              {step.icon}
            </Box>
            <CardContent>
              <Typography
                variant="h5"
                sx={{
                  color: 'var(--primary-dark)',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {step.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--text)',
                }}
              >
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