import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <AuthProvider>
        <ThemeProvider>
          <Navbar />
          <div className="marquee-container">
            <Marquee />
          </div>
          <main>
            <Component {...pageProps} />
          </main>
          <Footer />
        </ThemeProvider>
      </AuthProvider>
      <GoogleAnalytics gaId="G-JGQE2H2LRK" />
    </>
  );
}