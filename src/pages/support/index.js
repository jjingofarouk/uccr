import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Button,
} from '@mui/material';
import { Heart, Smile, DollarSign, Building, GraduationCap, Users } from 'lucide-react';
import Donate from '../../components/Donate';
import styles from '../styles/support.module.css';

const SupportUs = () => {
  const reasons = [
    {
      icon: <Heart size={40} style={{ color: '#FF4081' }} />,
      title: 'Fuel Our Mission',
      description: 'Your contribution helps us maintain free tools like UCCR, empowering healthcare professionals across Africa.',
    },
    {
      icon: <Smile size={40} style={{ color: '#FFD54F' }} />,
      title: 'Inspire Innovation',
      description: 'Every gesture of support motivates us to create more impactful solutions for healthcare professionals.',
    },
  ];

  const supportOptions = [
    {
      title: 'Corporate Sponsorship',
      description: 'Partner with us for brand visibility and talent development.',
      icon: <Building size={24} style={{ color: '#1976d2' }} />,
      badge: 'Enterprise',
      contact: 'partnerships@clinicalreporting.org',
    },
    {
      title: 'Medical Partnership',
      description: 'Collaborate as a medical institution to enhance our platform.',
      icon: <GraduationCap size={24} style={{ color: '#1976d2' }} />,
      badge: 'Healthcare',
      contact: 'healthcare@clinicalreporting.org',
    },
    {
      title: 'Volunteer',
      description: 'Contribute your skills to improve our medical tools.',
      icon: <Users size={24} style={{ color: '#1976d2' }} />,
      badge: 'Community',
      contact: 'volunteer@clinicalreporting.org',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ padding: '2rem 1rem' }} className={styles.supportContainer}>
      <Typography variant="h3" className={styles.title}>
        Support Us
      </Typography>
      <Typography variant="body1" className={styles.description}>
        Together, we can transform healthcare access and education across Africa. Your support makes a difference!
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        {reasons.map((reason, index) => (
          <Card key={index} sx={{ padding: '1rem', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }} className={styles.carouselCard}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Box className={styles.iconWrapper}>{reason.icon}</Box>
              <Box>
                <Typography variant="h5" className={styles.cardTitle}>
                  {reason.title}
                </Typography>
                <Typography variant="body2" className={styles.cardDescription}>
                  {reason.description}
                </Typography>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      <Divider sx={{ marginY: '2rem' }} />

      <Donate />

      <Divider sx={{ marginY: '2rem' }} />

      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Other Ways to Support
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {supportOptions.map((option, index) => (
          <Card key={index} sx={{ padding: '1.5rem', height: '100%' }} className={styles.carouselCard}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box className={styles.iconWrapper}>{option.icon}</Box>
                <Typography variant="body2" sx={{ background: '#e0e0e0', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                  {option.badge}
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }} className={styles.cardTitle}>
                {option.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: '0.5rem' }} className={styles.cardDescription}>
                {option.description}
              </Typography>
            </CardContent>
            <Button variant="contained" className={styles.donateButton}>
              Contact: {option.contact}
            </Button>
          </Card>
        ))}
      </Box>

      <Divider sx={{ marginY: '2rem' }} />

      <Box textAlign="center" sx={{ marginBottom: '2rem' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Donate via Binance (Crypto)
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: '0.5rem' }}>
          Binance Smart Chain (BEP20)
        </Typography>
        <Box
          sx={{
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.95rem',
            wordBreak: 'break-word',
            display: 'inline-block',
          }}
        >
          0xf29645d0e916cb04efb8996000f08e6c057e594a
        </Box>
      </Box>

      <Box textAlign="center">
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Support Us Instantly via Chipper Cash
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', marginBottom: '0.5rem' }}>
          Chipper Cash Tag:
        </Typography>
        <Box
          sx={{
            padding: '1rem',
            backgroundColor: '#e0f7fa',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            display: 'inline-block',
            fontSize: '1.1rem',
          }}
        >
          @jf12
        </Box>
      </Box>

      <Box textAlign="center" sx={{ marginTop: '3rem' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
          Thank You for Your Support!
        </Typography>
        <Button
          variant="contained"
          className={styles.donateButton}
          href="https://chipper.cash/@jf12"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            backgroundColor: '#00B386',
            color: '#fff',
            padding: '0.8rem 2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#007A5E',
            },
          }}
        >
          Donate Now
        </Button>
      </Box>
    </Container>
  );
};

export default SupportUs;