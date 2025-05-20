// src/pages/_app.js
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Marquee from '../components/Marquee';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Navbar />
        <Marquee />
        <Component {...pageProps} />

      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;