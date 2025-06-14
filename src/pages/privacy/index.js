import React from 'react';
import { Container, Typography, Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Lock, Shield, Trash2 } from 'lucide-react';
import styles from './privacy.module.css';

const Privacy = () => {
  return (
    <Container maxWidth="md" className={styles.privacyContainer}>
      <Typography variant="h3" className={styles.title}>
        Privacy Policy
      </Typography>
      <Typography variant="body1" className={styles.subtitle}>
        Effective Date: June 14, 2025
      </Typography>
      <Box className={styles.section}>
        <Typography variant="body1" className={styles.articleText}>
          At UCCR, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect your data when you use our web application, which facilitates the sharing and discussion of clinical cases among healthcare professionals. By using UCCR, you agree to the practices described in this policy.
        </Typography>
      </Box>

      {/* Article 1 */}
      <Box className={styles.section}>
        <Box className={styles.sectionHeader}>
          <Lock className={styles.sectionIcon} color="var(--primary)" />
          <Typography variant="h5" className={styles.sectionTitle}>
            Article 1: Information We Collect
          </Typography>
        </Box>
        <List>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Personal Information: Name, email address, profile photo, professional credentials, and other details provided during account creation or profile setup." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Content Data: Clinical case details, including patient histories, complaints, investigations, images, comments, and reactions you submit to the platform." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Usage Data: Information about your interactions with UCCR, such as pages visited, features used, and time spent on the platform, collected to improve functionality." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Technical Data: IP address, browser type, device information, and cookies to ensure secure access and optimize performance." />
          </ListItem>
        </List>
      </Box>

      {/* Article 2 */}
      <Box className={styles.section}>
        <Box className={styles.sectionHeader}>
          <Shield className={styles.sectionIcon} color="var(--primary)" />
          <Typography variant="h5" className={styles.sectionTitle}>
            Article 2: How We Use Your Information
          </Typography>
        </Box>
        <List>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Service Delivery: To provide access to UCCR’s features, including case sharing, discussions, and profile management." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Collaboration: To facilitate communication and collaboration among healthcare professionals through case discussions and comments." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Improvement: To analyze usage patterns and feedback to enhance platform features, performance, and user experience." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Security: To detect and prevent fraudulent activities, unauthorized access, and other security threats." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Compliance: To comply with legal obligations, including data protection regulations and professional standards." />
          </ListItem>
        </List>
      </Box>

      {/* Article 3 */}
      <Box className={styles.section}>
        <Box className={styles.sectionHeader}>
          <Trash2 className={styles.sectionIcon} color="var(--primary)" />
          <Typography variant="h5" className={styles.sectionTitle}>
            Article 3: Data Sharing and Disclosure
          </Typography>
        </Box>
        <List>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="With Other Users: Case data and comments you post are visible to other UCCR users to enable collaboration, unless marked private." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Service Providers: We may share data with trusted third-party providers (e.g., cloud storage, analytics) who assist with platform operations, bound by confidentiality agreements." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Legal Requirements: We may disclose data if required by law, court order, or to protect the rights, property, or safety of UCCR, its users, or the public." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="De-identified Data: We may share aggregated, anonymized data for research or statistical purposes, ensuring no individual is identifiable." />
          </ListItem>
        </List>
      </Box>

      {/* Article 4 */}
      <Box className={styles.section}>
        <Box className={styles.sectionHeader}>
          <Lock className={styles.sectionIcon} color="var(--primary)" />
          <Typography variant="h5" className={styles.sectionTitle}>
            Article 4: Data Security
          </Typography>
        </Box>
        <List>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Encryption: We use industry-standard encryption (e.g., TLS) to protect data during transmission and storage." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Access Controls: Only authorized personnel have access to personal data, subject to strict confidentiality obligations." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Regular Audits: We conduct periodic security audits to identify and address vulnerabilities." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Incident Response: We have procedures to respond promptly to any data breaches, including notifying affected users where required." />
          </ListItem>
        </List>
      </Box>

      {/* Article 5 */}
      <Box className={styles.section}>
        <Box className={styles.sectionHeader}>
          <Trash2 className={styles.sectionIcon} color="var(--primary)" />
          <Typography variant="h5" className={styles.sectionTitle}>
            Article 5: Your Rights
          </Typography>
        </Box>
        <List>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Access: Request a copy of your personal data held by UCCR." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Rectification: Update or correct inaccurate or incomplete data." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Deletion: Request deletion of your data, subject to legal or contractual obligations." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Restriction: Request limitation of data processing under certain conditions." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Portability: Receive your data in a structured, machine-readable format for transfer to another service." />
          </ListItem>
          <ListItem className={styles.listItem}>
            <ListItemIcon className={styles.listItemIcon}>
              <Shield color="var(--primary-light)" size={20} />
            </ListItemIcon>
            <ListItemText className={styles.listItemText} primary="Objection: Object to data processing based on legitimate interests or for direct marketing." />
          </ListItem>
        </List>
      </Box>

      {/* Article 6 */}
      <Box className={styles.section}>
        <Typography className={styles.articleTitle}>Article 6: Data Retention</Typography>
        <Typography className={styles.articleText}>
          We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, or resolve disputes. Clinical case data may be retained longer to support ongoing collaboration, unless you request deletion. Account data is deleted within 30 days of account closure, except where retention is required by law.
        </Typography>
      </Box>

      {/* Article 7 */}
      <Box className={styles.section}>
        <Typography className={styles.articleTitle}>Article 7: Cookies and Tracking Technologies</Typography>
        <Typography className={styles.articleText}>
          UCCR uses cookies and similar technologies to enhance user experience, authenticate users, and analyze usage. Essential cookies are required for platform functionality, while optional cookies (e.g., analytics) can be disabled via your browser settings or our cookie consent tool. We respect Do Not Track signals where applicable.
        </Typography>
      </Box>

      {/* Article 8 */}
      <Box className={styles.section}>
        <Typography className={styles.articleTitle}>Article 8: Third-Party Links</Typography>
        <Typography className={styles.articleText}>
          UCCR may contain links to third-party websites or services not operated by us. We are not responsible for the privacy practices of these sites. We encourage you to review their privacy policies before providing any personal information.
        </Typography>
      </Box>

      {/* Article 9 */}
      <Box className={styles.section}>
        <Typography className={styles.articleTitle}>Article 9: International Data Transfers</Typography>
        <Typography className={styles.articleText}>
          Your data may be transferred to and processed in countries outside your jurisdiction, including those with different data protection laws. We ensure such transfers comply with applicable laws, using safeguards like Standard Contractual Clauses or adequacy decisions.
        </Typography>
      </Box>

      {/* Article 10 */}
      <Box className={styles.section}>
        <Typography className={styles.articleTitle}>Article 10: Changes to This Privacy Policy</Typography>
        <Typography className={styles.articleText}>
          We may update this Privacy Policy to reflect changes in our practices or legal requirements. Updates will be posted on this page with a revised effective date. For significant changes, we will notify you via email or in-app notifications. Continued use of UCCR after updates constitutes acceptance of the revised policy.
        </Typography>
      </Box>

      {/* Article 11 */}
      <Box className={styles.section}>
        <Typography className={styles.articleTitle}>Article 11: Contact Us</Typography>
        <Typography className={styles.articleText}>
          For questions, concerns, or to exercise your data rights, contact our Data Protection Officer at:
          <br />
          Email: privacy@uccr.com
          <br />
          Address: UCCR Privacy Office, 123 HealthTech Lane, Suite 100, Medical City, MC 12345
          <br />
          We aim to respond within 30 days. If unsatisfied, you may lodge a complaint with your local data protection authority.
        </Typography>
      </Box>
    </Container>
  );
};

export default Privacy;