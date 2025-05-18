import { useState } from 'react';
import { useRouter } from 'next/router';
import { addCase } from '../../firebase/firestore';
import { uploadImage } from '../../lib/cloudinary';
import styles from '../../styles/caseForm.module.css';
import { auth } from '../../firebase/config';

export default function CaseForm() {
  const [title, setTitle] = useState('');
  const [complaint, setComplaint] = useState('');
  const [history, setHistory] = useState('');
  const [investigations, setInvestigations] = useState('');
  const [management, setManagement] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('You must be logged in to submit a case.');
      return;
    }
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image, auth.currentUser.uid);
      }
      await addCase({
        title,
        presentingComplaint: complaint,
        history,
        investigations,
        management,
        imageUrl,
        createdAt: new Date(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName,
      });
      router.push('/cases');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.caseForm}>
      <h2>Add New Case</h2>
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Submit Case</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}