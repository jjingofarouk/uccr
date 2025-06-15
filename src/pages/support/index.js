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
import { Heart, Smile, DollarSign } from 'lucide-react';
import styles from '../how-it-works/works.module.css';

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

  return (
    <Container maxWidth="md" sx={{ padding: '2rem 1rem' }}>
      {/* Header Section */}
      <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
        Support Us
      </Typography>
      <Typography variant="body1" sx={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.2rem' }}>
        Together, we can transform healthcare access and education across Africa. Your support makes a difference!
      </Typography>

      {/* Reasons Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
        {reasons.map((reason, index) => (
          <Card key={index} sx={{ padding: '1rem', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Box>{reason.icon}</Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {reason.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: '0.5rem' }}>
                  {reason.description}
                </Typography>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

      <Divider sx={{ marginY: '2rem' }} />

      {/* Donation Methods */}
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

      <Divider sx={{ marginY: '2rem' }} />

      {/* Chipper Cash Section */}
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

      {/* Call-to-Action */}
      <Box textAlign="center" sx={{ marginTop: '3rem' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
          Thank You for Your Support!
        </Typography>
        <Button
          variant="contained"
          color="primary"
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