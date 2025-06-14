import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Lock, Shield, Trash2 } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: <Lock color="var(--primary)" size={32} />,
      title: 'Information We Collect',
      details: [
        'Personal details such as your name, email address, and profile photo.',
        'Case data and comments you submit to the platform.',
        'Usage data to improve the platform’s features and functionality.',
      ],
    },
    {
      icon: <Shield color="var(--primary)" size={32} />,
      title: 'How We Use Your Information',
      details: [
        'To provide you with access to UCCR’s features.',
        'To facilitate communication and collaboration between users.',
        'To analyze usage patterns for improving the platform.',
      ],
    },
    {
      icon: <Trash2 color="var(--primary)" size={32} />,
      title: 'Your Rights',
      details: [
        'Access, update, or delete your personal information.',
        'Contact our support team for any privacy-related concerns.',
      ],
    },
  ];

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: 'var(--primary)', fontWeight: 700 }}>
        Privacy Policy
      </Typography>
      <Typography variant="body1" align="center" paragraph sx={{ color: 'var(--text)' }}>
        At UCCR, your privacy is our top priority. Here’s how we collect, use, and protect your personal information.
      </Typography>
      <Box sx={{ mt: 4 }}>
        {sections.map((section, index) => (
          <Box key={index} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ mr: 2 }}>{section.icon}</Box>
              <Typography variant="h5" sx={{ color: 'var(--primary-dark)' }}>
                {section.title}
              </Typography>
            </Box>
            <List>
              {section.details.map((detail, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    <Shield color="var(--primary-light)" size={20} />
                  </ListItemIcon>
                  <ListItemText primary={detail} sx={{ color: 'var(--text)' }} />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Privacy;