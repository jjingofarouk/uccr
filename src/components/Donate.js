import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Slider,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Alert,
  LinearProgress,
} from '@mui/material';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../styles/support.module.css';

const Donate = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const goal = 100000;
  const [donationAmount, setDonationAmount] = useState(50);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [tabValue, setTabValue] = useState('donate');
  const [totalRaised, setTotalRaised] = useState(0);
  const [recentDonations, setRecentDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDonationStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Mock API response for demo
        const mockData = {
          totalRaised: 25000,
          recentDonations: [
            { id: '1', name: 'John Doe', amount: 100, donationType: 'Supporter', createdAt: new Date().toISOString(), message: 'Great cause!' },
            { id: '2', name: 'Anonymous', amount: 500, donationType: 'Innovator', createdAt: new Date().toISOString() },
          ],
        };
        setTotalRaised(mockData.totalRaised);
        setRecentDonations(mockData.recentDonations);
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

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const progressPercentage = (totalRaised / goal) * 100;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      variants={fadeIn}
    >
      <Box sx={{ marginBottom: '2rem' }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} centered>
          <Tab label="One-time Donation" value="donate" />
          <Tab label="Donation Tiers" value="tiers" />
        </Tabs>

        {tabValue === 'donate' && (
          <Box sx={{ display: 'flex', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Card sx={{ flex: 1, padding: '1.5rem', minWidth: '300px' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
                  Donate
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
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
            <Box sx={{ flex: 1, minWidth: '300px' }}>
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
                  <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: '10px' }} />
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
                                <Typography variant="body2" sx={{ color: '#1976d2' }}>
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
                    <ul style={{ paddingLeft: '1rem', color: '#333' }}>
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
    </motion.div>
  );
};

export default Donate;