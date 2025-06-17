// _app.js

import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { CaseProvider } from '../context/CaseContext';

import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';

import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';

import Head from 'next/head'; // ✅ Needed to inject the PWA-related meta tags

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* ✅ Add only PWA-related meta links */}
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
      </Head>

      <AuthProvider>
        <ThemeProvider>
          <CaseProvider>
            <Navbar />
            <div className="marquee-container">
              <Marquee />
            </div>
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