import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button } from '@mui/material';
import styles from '../how-it-works/works.module.css';
import { Coffee, Heart, Smile } from 'lucide-react';

const SupportUs = () => {
  const reasons = [
    {
      icon: <Coffee size={40} />,
      title: 'Buy Us a Coffee',
      description: 'Help us keep the platform running by supporting us with a coffee.',
    },
    {
      icon: <Heart size={40} />,
      title: 'Support Our Mission',
      description: 'Your contribution fuels our mission to connect healthcare professionals.',
    },
    {
      icon: <Smile size={40} />,
      title: 'Keep Us Motivated',
      description: 'Every small gesture of support keeps us motivated to innovate further.',
    },
  ];

  return (
    <Container maxWidth="md" className={styles.worksContainer}>
      <Typography variant="h3" className={styles.title}>
        Support Us
      </Typography>
      <Typography variant="body1" className={styles.description}>
        Your support helps us maintain and improve this platform for healthcare professionals worldwide.
      </Typography>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          href="https://www.buymeacoffee.com/yourpage" // Replace with your actual link
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: '#FFDD00', color: '#000', fontWeight: 'bold' }}
        >
          Buy Me a Coffee
        </Button>
      </div>
      <div>
        {reasons.map((reason, index) => (
          <Card key={index} className={styles.carouselCard}>
            <Box className={styles.iconWrapper}>{reason.icon}</Box>
            <CardContent>
              <Typography variant="h5" className={styles.cardTitle}>
                {reason.title}
              </Typography>
              <Typography variant="body2" className={styles.cardDescription}>
                {reason.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default SupportUs;