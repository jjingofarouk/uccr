import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';
import { GoogleTagManager } from '@next/third-parties/google';

function MyApp({ Component, pageProps }) {
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
      <GoogleTagManager gtmId="G-JGQE2H2LRK" />
    </>
  );
}

export default MyApp;