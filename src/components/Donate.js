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

const Donate = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const goal = 50000;
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
        const mockData = {
          totalRaised: 22000,
          recentDonations: [
            {
              id: '1',
              name: 'Joseph Kiggundu',
              amount: 75,
              donationType: 'Advocate',
              createdAt: new Date().toISOString(),
              message: 'Kale nange nzikiriza mu kukulaakulanya eby’obulamu! (I believe in advancing healthcare!)',
            },
            {
              id: '2',
              name: 'Alejandra Morales',
              amount: 400,
              donationType: 'Champion',
              createdAt: new Date().toISOString(),
              message: '¡Apoyo esta gran causa para la salud global! (I support this great cause for global health!)',
            },
            {
              id: '3',
              name: 'Esther Nakayima',
              amount: 150,
              donationType: 'Advocate',
              createdAt: new Date().toISOString(),
              message: 'For better patient outcomes in Uganda!',
            },
            {
              id: '4',
              name: 'Hiroshi Tanaka',
              amount: 1000,
              donationType: 'Leader',
              createdAt: new Date().toISOString(),
              message: '医療の未来のために (For the future of healthcare)',
            },
            {
              id: '5',
              name: 'Fatima Al-Sayed',
              amount: 300,
              donationType: 'Champion',
              createdAt: new Date().toISOString(),
              message: 'لتعزيز الرعاية الصحية في المجتمعات (To enhance healthcare in communities)',
            },
            {
              id: '6',
              name: 'Anika Sharma',
              amount: 50,
              donationType: 'Advocate',
              createdAt: new Date().toISOString(),
              message: 'Proud to support medical innovation!',
            },
            {
              id: '7',
              name: 'Liam O’Connor',
              amount: 200,
              donationType: 'Champion',
              createdAt: new Date().toISOString(),
              message: 'Supporting global health initiatives!',
            },
            {
              id: '8',
              name: 'Sofia Mendes',
              amount: 500,
              donationType: 'Champion',
              createdAt: new Date().toISOString(),
              message: 'Para uma saúde melhor em todo o mundo! (For better health worldwide!)',
            },
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
      name: 'Advocate',
      range: '$25 - $249',
      description: 'Support essential case reporting tools for healthcare workers.',
      benefits: ['Website recognition', 'Monthly newsletter'],
    },
    {
      name: 'Champion',
      range: '$250 - $999',
      description: 'Enhance platform features for real-time case tracking.',
      benefits: ['All Advocate benefits', 'Impact report', 'Webinar access'],
    },
    {
      name: 'Leader',
      range: '$1,000 - $4,999',
      description: 'Expand access to hospitals and clinics in underserved areas.',
      benefits: ['All Champion benefits', 'Named recognition', 'Exclusive updates'],
    },
    {
      name: 'Transformer',
      range: '$5,000+',
      description: 'Drive a fully integrated case reporting ecosystem.',
      benefits: ['All Leader benefits', 'Naming opportunity', 'Virtual demo', 'Advisory role'],
    },
  ];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const progressPercentage = Math.min((totalRaised / goal) * 100, 100);

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
                  Support Case Reporting
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    href={`/donate?amount=${donationAmount}`}
                  >
                    Donate {formatCurrency(donationAmount)}
                    <Heart size={20} />
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
                  sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}
                  href={`/donate/${tier.name.toLowerCase()}`}
                >
                  Donate as {tier.name}
                  <Heart size={20} />
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