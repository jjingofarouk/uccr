// Footer.jsx
import Link from 'next/link';
import { Twitter, Instagram, Mail, Github } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
  ];

  const socialLinks = [
    {
      href: 'https://twitter.com',
      icon: Twitter,
      label: 'Follow us on Twitter',
    },
    {
      href: 'https://instagram.com',
      icon: Instagram,
      label: 'Follow us on Instagram',
    },
    {
      href: 'https://github.com',
      icon: Github,
      label: 'View our Github',
    },
    {
      href: 'mailto:contact@uccr.org',
      icon: Mail,
      label: 'Email us',
    },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logoLink}>
              <span className={styles.logo}>UCCR</span>
            </Link>
            <p className={styles.copyright}>
              © {currentYear} Uganda Clinical Case Reports. All rights reserved.
            </p>
          </div>

          <nav className={styles.nav} aria-label="Footer navigation">
            <ul className={styles.navList}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.navLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.social}>
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.href}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : '_self'}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : ''}
                  className={styles.socialLink}
                  aria-label={social.label}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}