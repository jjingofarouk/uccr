import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import styles from '../how-it-works/works.module.css';
import { Heart, Smile, Wallet } from 'lucide-react';

const SupportUs = () => {
  const reasons = [
    {
      icon: <Wallet size={40} />,
      title: 'Donate with Mobile Money',
      description: 'Send support directly through MTN Mobile Money in Uganda.',
    },
    {
      icon: <Heart size={40} />,
      title: 'Support Our Mission',
      description: 'Your contribution fuels our mission to connect healthcare professionals.',
    },
    {
      icon: <Smile size={40} />,
      title: 'Keep Us Motivated',
      description: 'Every gesture of support inspires us to build more tools for impact.',
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

      {/* Support Reasons */}
      <Box mt={4}>
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
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Mobile Money Donation */}
      <Box textAlign="center" mb={3}>
        <Typography variant="h6" gutterBottom>
          Support via Mobile Money (Uganda)
        </Typography>
        <Typography variant="body2" color="textSecondary">
          MTN MoMo Pay or direct Mobile Money to:
        </Typography>
        <Box
          sx={{
            mt: 1,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            display: 'inline-block',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            fontFamily: 'monospace',
          }}
        >
          +256 777 421601
        </Box>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Name: Farouk Jjingo
        </Typography>
      </Box>

      {/* Binance Wallet Section */}
      <Divider sx={{ my: 4 }} />

      <Box textAlign="center">
        <Typography variant="h6" gutterBottom>
          Donate Crypto (Binance)
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Binance Smart Chain (BEP20)
        </Typography>
        <Box
          sx={{
            mt: 1,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            wordBreak: 'break-word',
            fontFamily: 'monospace',
            fontSize: '0.95rem',
          }}
        >
          0xf29645d0e916cb04efb8996000f08e6c057e594a
        </Box>
      </Box>

      {/* Chipper Cash */}
      <Divider sx={{ my: 4 }} />
      <Box textAlign="center">
        <Typography variant="h6" gutterBottom>
          Or Send via Chipper Cash
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Chipper Tag:
        </Typography>
        <Box
          sx={{
            mt: 1,
            p: 1,
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            fontFamily: 'monospace',
            display: 'inline-block',
            fontWeight: 'bold',
          }}
        >
          @jf12
        </Box>
      </Box>
    </Container>
  );
};

export default SupportUs;