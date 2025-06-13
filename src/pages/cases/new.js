// pages/cases/new.jsx
import CaseForm from '../../components/Case/CaseForm';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import styles from '../../styles/caseForm.module.css';
// Import Google Analytics components
import { GoogleAnalytics } from '@next/third-parties/google';
import { Analytics } from '@vercel/analytics/react';

export default function NewCase() {
  return (
    <>
      <ProtectedRoute>
        <main className={styles.caseFormWrapper}>
          <CaseForm />
        </main>
      </ProtectedRoute>
      {/* Add Google Analytics components */}
      <GoogleAnalytics gaId="G-GLWW8HX76X" />
      <Analytics />
    </>
  );
}