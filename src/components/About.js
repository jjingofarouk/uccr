import React from 'react';
import { motion } from 'framer-motion';
import { Container, Box, Typography, Card, CardContent, Link, List, ListItem, ListItemText } from '@mui/material';
import './About.css';

const About = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    <Container maxWidth="lg" sx={{ py: 6, position: 'relative', bgcolor: 'background.default' }}>
      <Box className="background-texture" />
      
      <Typography variant="h2" sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}>
        About Dwaliro
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="body1" sx={{ maxWidth: '48rem', color: 'text.primary', lineHeight: 1.8 }}>
          Dwaliro is revolutionizing medical research by seamlessly connecting patients, researchers, and healthcare providers with global clinical trial opportunities. Our vision is to democratize access to cutting-edge medical advancements, empowering individuals to shape their health journey with confidence.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
            <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 4, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Our Mission
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  To deliver transparent, accessible, and real-time clinical study information, fostering trust and collaboration in the global medical community.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
            <Card sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 3, borderRadius: 4, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Our Impact
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  Since our launch, Dwaliro has facilitated thousands of connections, driving medical research forward and improving patient outcomes worldwide.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
            Our Team
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: '48rem', color: 'text.primary', lineHeight: 1.7 }}>
            Led by a passionate group of innovators, including our founder{' '}
            <Link
              href="https://ug.linkedin.com/in/farouk-jjingo-0341b01a5"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'secondary.main', textDecoration: 'none', '&:hover': { color: 'secondary.dark' } }}
              aria-label="Farouk Jjingo's LinkedIn profile"
            >
              Farouk Jjingo
            </Link>
            , Dwaliro blends expertise in technology and healthcare to create transformative impact.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 3 }}>
            Meet Our Founder
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, alignItems: { xs: 'center', md: 'flex-start' } }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                component="img"
                src="/farouk.png"
                alt="Farouk Jjingo, Founder of Dwaliro"
                loading="lazy"
                sx={{
                  width: { xs: '10rem', md: '14rem' },
                  height: { xs: '10rem', md: '14rem' },
                  borderRadius: '50%',
                  border: '4px solid',
                  borderColor: 'primary.dark',
                  boxShadow: 3,
                  objectFit: 'cover',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { borderColor: 'primary.main' }
                }}
              />
            </motion.div>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.7 }}>
                Farouk Jjingo, a Full Stack Developer and former medical officer, merges clinical insight with technical prowess to lead Dwaliro’s mission of tackling critical healthcare challenges. His passion for problem-solving and innovation drives our vision forward.
              </Typography>
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <ListItem disablePadding>
                  <ListItemText>
                    <Link
                      href="https://ug.linkedin.com/in/farouk-jjingo-0341b01a5"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'secondary.main', textDecoration: 'none', '&:hover': { color: 'secondary.dark' } }}
                      aria-label="Farouk Jjingo's LinkedIn profile"
                    >
                      LinkedIn: Farouk Jjingo
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <Link
                      href="https://wa.me/256751360385"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'secondary.main', textDecoration: 'none', '&:hover': { color: 'secondary.dark' } }}
                      aria-label="Contact Farouk Jjingo via WhatsApp"
                    >
                      WhatsApp: +256751360385
                    </Link>
                  </ListItemText>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemText>
                    <Link
                      href="https://jjingofarouk.xyz"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: 'secondary.main', textDecoration: 'none', '&:hover': { color: 'secondary.dark' } }}
                      aria-label="Farouk Jjingo's personal website"
                    >
                      Website: jjingofarouk.xyz
                    </Link>
                  </ListItemText>
                </ListItem>
              </List>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  </motion.div>
);

export default About;