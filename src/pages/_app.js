import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { CaseProvider } from '../context/CaseContext';
import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';
import Head from 'next/head';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
      </Head>
      <AuthProvider>
        <ThemeProvider>
          <CaseProvider>
            <Navbar />
            <Marquee />
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