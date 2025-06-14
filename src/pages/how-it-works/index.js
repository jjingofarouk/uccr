import React from 'react';
import { Container, Typography, Box, Card, CardContent } from '@mui/material';
import { UserCheck, FileText, MessageCircle, BarChart2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <UserCheck color="var(--primary)" size={32} />,
      title: 'Create an Account',
      description:
        'Sign up with your email and create a secure password. Set up your profile with a photo and details to connect with other professionals.',
    },
    {
      icon: <FileText color="var(--primary)" size={32} />,
      title: 'Share Clinical Cases',
      description:
        'Document and upload detailed clinical cases, including histories, complaints, investigations, and images, for better collaboration.',
    },
    {
      icon: <MessageCircle color="var(--primary)" size={32} />,
      title: 'Engage in Discussions',
      description:
        'Join discussions on cases, provide insights, ask questions, and react to comments to foster collaborative learning.',
    },
    {
      icon: <BarChart2 color="var(--primary)" size={32} />,
      title: 'Learn and Grow',
      description:
        'Expand your medical knowledge by learning from real-world cases shared by other healthcare professionals.',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: 'var(--primary)', fontWeight: 700 }}>
        How UCCR Works
      </Typography>
      <Typography variant="body1" align="center" paragraph sx={{ color: 'var(--text)' }}>
        UCCR is a modern platform designed to connect healthcare professionals, enabling them to share and discuss
        clinical cases for better collaboration and learning.
      </Typography>
      <Box sx={{ display: 'grid', gap: 4, mt: 4 }}>
        {steps.map((step, index) => (
          <Card key={index} sx={{ display: 'flex', alignItems: 'center', p: 2, boxShadow: '0 4px 14px var(--shadow)' }}>
            <Box sx={{ mr: 3 }}>{step.icon}</Box>
            <CardContent>
              <Typography variant="h5" sx={{ color: 'var(--primary-dark)' }}>
                {step.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text)' }}>
                {step.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default HowItWorks;