import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';
import { GoogleAnalytics } from '@next/third-parties/google'; // <-- Add this import

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-JGQE2H2LRK'; // Use env or fallback

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics gaId={GA_MEASUREMENT_ID} /> {/* Add this line for GA tracking */}
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
    </>
  );
}

export default MyApp;