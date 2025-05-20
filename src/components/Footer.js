// src/components/Footer.js
import Link from 'next/link';
import { Twitter, Instagram, Mail } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <p className={styles.copyright}>
              © 2025 Uganda Clinical Case Reports
            </p>
          </div>
          <nav className={styles.nav}>
            <Link href="/about" className={styles.navLink}>
              About
            </Link>
            <Link href="/contact" className={styles.navLink}>
              Contact
            </Link>
            <Link href="/privacy" className={styles.navLink}>
              Privacy Policy
            </Link>
          </nav>
          <div className={styles.social}>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Follow us on Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Follow us on Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="mailto:contact@uccr.org"
              className={styles.socialLink}
              aria-label="Email us"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}