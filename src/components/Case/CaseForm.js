import { useState } from 'react';
import { useRouter } from 'next/router';
import { addCase } from '../../firebase/firestore';
import styles from '../../styles/caseForm.module.css';
import { useAuth } from '../../hooks/useAuth';

export default function CaseForm() {
  const { user, loading, error: authError } = useAuth();
  const [title, setTitle] = useState('');
  const [complaint, setComplaint] = useState('');
  const [history, setHistory] = useState('');
  const [investigations, setInvestigations] = useState('');
  const [management, setManagement] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      setError('Authentication is still loading. Please wait.');
      return;
    }
    if (!user) {
      setError('You must be logged in to submit a case.');
      return;
    }
    try {
      await addCase({
        title,
        presentingComplaint: complaint,
        history,
        investigations,
        management,
        createdAt: new Date(),
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
      });
      router.push('/cases');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.caseForm}>
      <h2>Add New Case</h2>
      {authError && <p className={styles.error}>Auth Error: {authError}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Case Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Presenting Complaint"
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          required
        />
        <textarea
          placeholder="History of Presenting Complaint"
          value={history}
          onChange={(e) => setHistory(e.target.value)}
          required
        />
        <textarea
          placeholder="Investigations"
          value={investigations}
          onChange={(e) => setInvestigations(e.target.value)}
          required
        />
        <textarea
          placeholder="Management"
          value={management}
          onChange={(e) => setManagement(e.target.value)}
          required
        />
        <button type="submit" disabled={!user}>Submit Case</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}