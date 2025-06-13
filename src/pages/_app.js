import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-JGQE2H2LRK';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      window.gtag && window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
      <AuthProvider>
        <ThemeProvider>
          <Navbar />
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