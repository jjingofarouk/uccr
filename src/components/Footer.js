import Link from 'next/link';
import { Twitter, Mail, Github, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { href: 'https://twitter.com/farouq_jjingo', icon: Twitter, label: 'Twitter' },
    { href: 'mailto:jjingofarouq@gmail.com', icon: Mail, label: 'Email' },
    { href: 'https://wa.me/256751360385', icon: MessageCircle, label: 'WhatsApp' },
    { href: 'https://github.com/jjingofarouk', icon: Github, label: 'GitHub' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.bottomBar}>
          <div className={styles.brandInfo}>
            <Link href="/" className={styles.logoLink} onClick={scrollToTop}>
              <span className={styles.logo}>UCCR</span>
            </Link>
            <p className={styles.copy}>© {currentYear} Uganda Clinical Case Reports (UCCR).</p>
          </div>
          
          <div className={styles.socialBar}>
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
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