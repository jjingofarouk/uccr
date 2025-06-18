import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  Button,
  Tabs,
  Tab,
  Slider,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { Heart, Smile, DollarSign, Building, GraduationCap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './support.module.css';

const SupportUs = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const goal = 100000;
  const [donationAmount, setDonationAmount] = React.useState(50);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isAnonymous, setIsAnonymous] = React.useState(false);
  const [tabValue, setTabValue] = React.useState('donate');
  const [totalRaised, setTotalRaised] = React.useState(0);
  const [recentDonations, setRecentDonations] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchDonationStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/donations');
        if (!response.ok) throw new Error('API error');
        const data = await response.json();
        setTotalRaised(data.totalRaised);
        setRecentDonations(data.recentDonations);
      } catch (err) {
        setError('Unable to load donation statistics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDonationStats();
  }, []);

  const donationTiers = [
    {
      name: 'Supporter',
      range: '$25 - $499',
      description: 'Support clinical case reporting tools for healthcare professionals.',
      benefits: ['Website recognition', 'Newsletter updates'],
    },
    {
      name: 'Innovator',
      range: '$500 - $2,499',
      description: 'Fund advanced features for our medical reporting platform.',
      benefits: ['All Supporter benefits', 'Annual impact report', 'Virtual event access'],
    },
    {
      name: 'Pioneer',
      range: '$2,500 - $9,999',
      description: 'Expand our platform to new medical institutions.',
      benefits: ['All Innovator benefits', 'Named recognition', 'Exclusive updates'],
    },
    {
      name: 'Visionary',
      range: '$10,000+',
      description: 'Establish a fully integrated case reporting system.',
      benefits: ['All Pioneer benefits', 'Naming opportunity', 'Annual demo', 'Advisory role'],
    },
  ];

  const supportOptions = [
    {
      title: 'Corporate Sponsorship',
      description: 'Partner with us for brand visibility and talent development.',
      icon: <Building size={24} style={{ color: 'var(--primary)' }} />,
      badge: 'Enterprise',
      contact: 'partnerships@clinicalreporting.org',
    },
    {
      title: 'Medical Partnership',
      description: 'Collaborate as a medical institution to enhance our platform.',
      icon: <GraduationCap size={24} style={{ color: 'var(--primary)' }} />,
      badge: 'Healthcare',
      contact: 'healthcare@clinicalreporting.org',
    },
    {
      title: 'Volunteer',
      description: 'Contribute your skills to improve our medical tools.',
      icon: <Users size={24} style={{ color: 'var(--primary)' }} />,
      badge: 'Community',
      contact: 'volunteer@clinicalreporting.org',
    },
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const progressPercentage = (totalRaised / goal) * 100;

  return (
    <Container maxWidth="lg" className={styles.supportContainer}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        variants={fadeIn}
        className={styles.header}
      >
        <Typography variant="h3" className={styles.title}>
          Support Our Mission
        </Typography>
        <Typography variant="body1" className={styles.description}>
          Help transform healthcare access and education across Africa with our clinical case reporting platform.
        </Typography>
      </motion.div>

      <Box sx={{ marginBottom: '2rem' }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} centered>
          <Tab label="One-time Donation" value="donate" />
          <Tab label="Donation Tiers" value="tiers" />
        </Tabs>

        {tabValue === 'donate' && (
          <Box sx={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
            <Card sx={{ flex: 1, padding: '1.5rem' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                  Donate
                </Typography>
                {error && (
                  <Alert severity="error">
                    <AlertCircle size={16} />
                    {error}
                  </Alert>
                )}
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Typography variant="body1">Donation Amount (USD)</Typography>
                  <Slider
                    value={donationAmount}
                    onChange={(e, val) => setDonationAmount(val)}
                    min={10}
                    max={500}
                    step={5}
                    marks={[{ value: 10, label: '$10' }, { value: 500, label: '$500' }]}
                    valueLabelDisplay="auto"
                  />
                  <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isAnonymous}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                  />
                  <TextField
                    label="Message (Optional)"
                    multiline
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                  />
                  <FormControlLabel
                    control={<Checkbox checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />}
                    label="Make my donation anonymous"
                  />
                  <Button
                    variant="contained"
                    className={styles.donateButton}
                    href={`/donate?amount=${donationAmount}`}
                  >
                    Donate {formatCurrency(donationAmount)} <Heart size={20} style={{ marginLeft: '0.5rem' }} />
                  </Button>
                </Box>
              </CardContent>
            </Card>
            <Box sx={{ flex: 1 }}>
              {isLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Box sx={{ height: '1rem', background: '#e0e0e0', borderRadius: '4px' }} />
                  <Box sx={{ height: '5rem', background: '#e0e0e0', borderRadius: '4px' }} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body1">{formatCurrency(totalRaised)} raised</Typography>
                    <Typography variant="body1">{formatCurrency(goal)} goal</Typography>
                  </Box>
                  <Slider value={progressPercentage} disabled sx={{ color: 'var(--primary)' }} />
                  <Typography variant="body2">{progressPercentage.toFixed(0)}% of our goal reached</Typography>
                  {recentDonations.length > 0 && (
                    <Box>
                      <Typography variant="h6">Recent Supporters</Typography>
                      {recentDonations.map((donation) => (
                        <Card key={donation.id} sx={{ marginTop: '1rem', padding: '1rem' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Box>
                                <Typography variant="body1">{donation.name}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {new Date(donation.createdAt).toLocaleDateString()}
                                </Typography>
                                {donation.message && (
                                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                    "{donation.message}"
                                  </Typography>
                                )}
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body1">{formatCurrency(donation.amount)}</Typography>
                                <Typography variant="body2" sx={{ color: 'var(--primary)' }}>
                                  {donation.donationType}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}

        {tabValue === 'tiers' && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {donationTiers.map((tier, index) => (
              <Card key={index} sx={{ padding: '1.5rem' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{tier.name}</Typography>
                    <Typography variant="body2" sx={{ background: '#e0e0e0', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                      {tier.range}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ marginTop: '0.5rem', color: 'text.secondary' }}>
                    {tier.description}
                  </Typography>
                  <Box sx={{ marginTop: '1rem' }}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Benefits:</Typography>
                    <ul style={{ paddingLeft: '1rem', color: 'var(--text)' }}>
                      {tier.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </Box>
                </CardContent>
                <Button
                  variant="contained"
                  className={styles.donateButton}
                  href={`/donate/${tier.name.toLowerCase()}`}
                  sx={{ marginTop: '1rem' }}
                >
                  Donate as {tier.name} <Heart size={20} style={{ marginLeft: '0.5rem' }} />
                </Button>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <Divider sx={{ marginY: '2rem' }} />

      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Other Ways to Support
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {supportOptions.map((option, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            variants={fadeIn}
          >
            <Card sx={{ padding: '1.5rem', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box className={styles.iconWrapper}>{option.icon}</Box>
                  <Typography variant="body2" sx={{ background: '#e0e0e0', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {option.badge}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: '1rem' }}>
                  {option.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', marginTop: '0.5rem' }}>
                  {option.description}
                </Typography>
              </CardContent>
              <Button variant="contained" className={styles.donateButton}>
                Contact: {option.contact}
              </Button>
            </Card>
          </motion.div>
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
        >
          Donate Now
        </Button>
      </Box>
    </Container>
  );
};

export default SupportUs;