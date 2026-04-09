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
        <title>UCCR | Clinical Case Discovery & Research Archive</title>
        <meta name="description" content="Explore Uganda's premier clinical case archive. Access peer-reviewed research, rare medical findings, and high-yield insights for healthcare professionals." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.ugandacasereports.org/" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/uccr.png" />
        
        {/* Schema.org Medical SEO Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
             __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalWebPage",
              "name": "Uganda Clinical Case Reports (UCCR)",
              "description": "Medical case studies and clinical research archive from Uganda.",
              "url": "https://www.ugandacasereports.org/",
              "audience": {
                "@type": "MedicalAudience",
                "audienceType": ["Healthcare Professionals", "Medical Researchers", "Students"]
              },
              "medicalSpecialty": ["Cardiology", "Pathology", "Internal Medicine", "Surgery"],
              "publisher": {
                "@type": "Organization",
                "name": "Uganda Clinical Case Reports",
                "logo": "https://www.ugandacasereports.org/logo.png"
              }
            })
          }}
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Uganda Clinical Case Reports (UCCR)" />
        <meta property="og:description" content="Medical research and clinical findings from the Ugandan healthcare sector." />
        <meta property="og:url" content="https://www.ugandacasereports.org/" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UCCR Clinical Archive" />
        <meta name="twitter:description" content="Explore Uganda's official clinical case repository." />
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