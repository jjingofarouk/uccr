import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { CaseProvider } from '../context/CaseContext'; // Import CaseProvider
import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <AuthProvider>
        <ThemeProvider>
          <CaseProvider> {/* Wrap the entire app in CaseProvider */}
            <Navbar />
            <div className="marquee-container">
              <Marquee />
            </div>
            <main>
              <Component {...pageProps} />
            </main>
          </CaseProvider>
        </ThemeProvider>
      </AuthProvider>
      <GoogleAnalytics gaId="G-GLWW8HX76X" />
      <Analytics />
    </>
  );
}