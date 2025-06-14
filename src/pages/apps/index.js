import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import { ExternalLink } from 'lucide-react';

const OtherApps = () => {
  const apps = [
    {
      title: 'MediConnect',
      description: 'A platform for seamless appointment scheduling and teleconsultation services.',
      link: 'https://mediconnect.example.com',
    },
    {
      title: 'HealthTrack',
      description: 'Track health metrics, manage medications, and receive personalized health insights.',
      link: 'https://healthtrack.example.com',
    },
    {
      title: 'PharmaFinder',
      description: 'Locate nearby pharmacies and check real-time availability of medications.',
      link: 'https://pharmafinder.example.com',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: 'var(--primary)', fontWeight: 700 }}>
        Other Apps by Farouk Jjingo
      </Typography>
      <Typography variant="body1" align="center" paragraph sx={{ color: 'var(--text)' }}>
        Explore other innovative apps developed by Farouk Jjingo, leveraging technology to solve real-world problems in
        healthcare.
      </Typography>
      <Box sx={{ display: 'grid', gap: 4, mt: 4 }}>
        {apps.map((app, index) => (
          <Card key={index} sx={{ boxShadow: '0 4px 14px var(--shadow)', p: 3 }}>
            <CardContent>
              <Typography variant="h5" sx={{ color: 'var(--primary-dark)' }}>
                {app.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'var(--text)', mb: 2 }}>
                {app.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                href={app.link}
                target="_blank"
                endIcon={<ExternalLink color="white" size={16} />}
              >
                Visit App
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default OtherApps;