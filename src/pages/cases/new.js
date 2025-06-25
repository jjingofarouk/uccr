// pages/cases/new.jsx
import CaseForm from '../../components/CaseForm';
import ProtectedRoute from '../../components/Auth/ProtectedRoute';
import styles from '../../styles/caseForm.module.css';
import { GoogleAnalytics } from '@next/third-parties';
import { Analytics } from '@vercel/analytics/react';

export default function NewCase() {
  return (
    <>
      <ProtectedRoute>
        <main className={styles.caseFormWrapper}>
          <CaseForm />
        </main>
      </ProtectedRoute>
      <GoogleAnalytics gaId="G-GLWW8HX76X" />
      <Analytics />
    </>
  );
}