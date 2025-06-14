import React from 'react';
import { motion } from 'framer-motion';
import { Container, Box, Typography, Card, CardContent, Link, List, ListItem, ListItemText } from '@mui/material';

const About = () => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
  >
    <Container
      maxWidth="lg"
      sx={{
        py: 6,
        position: 'relative',
        bgcolor: 'var(--background)',
        color: 'var(--text)',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'var(--surface)',
          borderRadius: '16px',
          zIndex: -1,
        }}
      />

      <Typography
        variant="h2"
        sx={{
          mb: 4,
          fontWeight: 700,
          color: 'var(--primary)',
          textAlign: 'center',
        }}
      >
        About UCCR
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography
          variant="body1"
          sx={{
            maxWidth: '48rem',
            color: 'var(--text)',
            lineHeight: 1.8,
            textAlign: 'center',
            margin: '0 auto',
          }}
        >
          **UCCR (Uganda Clinical Case Reports)** is a collaborative web platform designed to empower healthcare professionals, medical students, and doctors to share, discuss, and learn from clinical cases in Uganda. By providing a structured and secure environment to document cases, engage in interactive discussions, and network with peers, UCCR fosters medical education and professional growth.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
          }}
        >
          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
            <Card
              sx={{
                bgcolor: 'var(--primary)',
                color: 'var(--surface)',
                p: 3,
                borderRadius: '12px',
                boxShadow: '0 4px 14px var(--shadow)',
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Our Mission
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  To provide a secure and accessible platform for healthcare professionals to share clinical knowledge, collaborate on complex cases, and advance medical education in Uganda.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
            <Card
              sx={{
                bgcolor: 'var(--primary)',
                color: 'var(--surface)',
                p: 3,
                borderRadius: '12px',
                boxShadow: '0 4px 14px var(--shadow)',
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  Our Vision
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                  To bridge the gap in medical knowledge sharing by creating a digital space where clinical expertise is accessible to all healthcare professionals in Uganda and beyond.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--primary)' }}>
            Meet the Founder
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: '48rem',
              color: 'var(--text)',
              lineHeight: 1.7,
            }}
          >
            **Farouk Jjingo**, the creator of UCCR, is a visionary full-stack developer and former medical officer with a deep understanding of both healthcare and technology. Farouk has combined his clinical expertise and programming skills to develop UCCR as a tool to enhance medical collaboration and education. His dedication to solving real-world healthcare challenges drives the success of this platform.
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'var(--primary)',
              mb: 3,
            }}
          >
            How to Connect
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: 4,
              alignItems: { xs: 'center', md: 'flex-start' },
            }}
          >
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
              <Box
                component="img"
                src="/farouk.png"
                alt="Farouk Jjingo, Founder of UCCR"
                loading="lazy"
                sx={{
                  width: { xs: '10rem', md: '14rem' },
                  height: { xs: '10rem', md: '14rem' },
                  borderRadius: '50%',
                  border: '4px solid var(--primary-dark)',
                  boxShadow: '0 4px 14px var(--shadow)',
                  objectFit: 'cover',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': { borderColor: 'var(--primary)' },
                }}
              />
            </motion.div>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'var(--text)', lineHeight: 1.7 }}>
                Farouk Jjingo is available for collaboration, discussions, and feedback. You can connect with him through:
              </Typography>
              <List sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <ListItem disablePadding>
                  <ListItemText>
                    <Link
                      href="https://ug.linkedin.com/in/farouk-jjingo-0341b01a5"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        '&:hover': { color: 'var(--primary-hover)' },
                      }}
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
                      sx={{
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        '&:hover': { color: 'var(--primary-hover)' },
                      }}
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
                      sx={{
                        color: 'var(--accent)',
                        textDecoration: 'none',
                        '&:hover': { color: 'var(--primary-hover)' },
                      }}
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