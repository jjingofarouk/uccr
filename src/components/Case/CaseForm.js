import { useState, useEffect, useRef } from 'react';
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
  const [mediaUrls, setMediaUrls] = useState([]);
  const [error, setError] = useState('');
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const router = useRouter();

  console.log('CaseForm: Auth state', { user: user ? { uid: user.uid, displayName: user.displayName } : null, loading, authError });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      cloudinaryRef.current = window.cloudinary;
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          folder: 'cases',
          sources: ['local', 'camera'],
          multiple: true,
          resourceType: 'image',
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            console.log('CaseForm: Image uploaded', result.info.secure_url);
            setMediaUrls((prev) => [...prev, result.info.secure_url]);
          } else if (error) {
            console.error('CaseForm: Upload error', error);
            setError('Image upload failed: ' + error.message);
          }
        }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('CaseForm: handleSubmit called', { user: user ? { uid: user.uid } : null, loading });
    if (loading) {
      setError('Authentication is still loading. Please wait.');
      console.log('CaseForm: Submission blocked due to loading');
      return;
    }
    if (!user) {
      setError('You must be logged in to submit a case.');
      console.log('CaseForm: Submission blocked due to no user');
      return;
    }
    try {
      const caseData = {
        title,
        presentingComplaint: complaint,
        history,
        investigations,
        management,
        mediaUrls,
        createdAt: new Date(),
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
      };
      console.log('CaseForm: Submitting case', caseData);
      await addCase(caseData);
      console.log('CaseForm: Case submitted successfully');
      router.push('/cases');
    } catch (err) {
      console.error('CaseForm: Submission error', err);
      setError(err.message);
    }
  };

  if (loading) {
    console.log('CaseForm: Rendering loading state');
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
        <button
          type="button"
          onClick={() => widgetRef.current?.open()}
          className={styles.uploadButton}
        >
          Upload Images
        </button>
        {mediaUrls.length > 0 && (
          <div>
            <p>Uploaded images:</p>
            <ul>
              {mediaUrls.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    View Image {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button type="submit" disabled={!user}>Submit Case</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}