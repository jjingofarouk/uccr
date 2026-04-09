import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { CaseProvider } from '../context/CaseContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Uganda Clinical Case Reports | Medical Case Studies & Insights</title>
        <meta name="description" content="Explore Uganda Clinical Case Reports (UCCR), a premier archive of medical case studies, clinical research, healthcare insights, and clinical trials from Uganda." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/uccr.png" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Uganda Clinical Case Reports (UCCR) - Medical archive" />
        <meta property="og:description" content="A growing archive of medical research and case studies from Uganda." />
        <meta property="og:url" content="https://ugandacasereports.org" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Uganda Clinical Case Reports" />
        <meta name="twitter:description" content="Medical research and case studies from Uganda." />
      </Head>
      <AuthProvider>
        <ThemeProvider>
          <CaseProvider>
            <Navbar />
            <main>
              <Component {...pageProps} />
            </main>
            <Footer />
          </CaseProvider>
        </ThemeProvider>
      </AuthProvider>
      <GoogleAnalytics gaId="G-GLWW8HX76X" />
      <Analytics />
    </>
  );
}