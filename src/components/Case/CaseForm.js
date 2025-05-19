// components/Case/CaseForm.jsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { addCase } from '../../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles/caseForm.module.css';

export default function CaseForm() {
  const { user, loading } = useAuth();
  const [title, setTitle] = useState('');
  const [presentingComplaint, setPresentingComplaint] = useState('');
  const [history, setHistory] = useState('');
  const [investigations, setInvestigations] = useState('');
  const [management, setManagement] = useState('');
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('');
  const [hospital, setHospital] = useState('');
  const [referralCenter, setReferralCenter] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [discussion, setDiscussion] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);
  const [error, setError] = useState('');
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
            folder: `cases/${user?.uid || 'anonymous'}`,
            sources: ['local', 'camera'],
            multiple: true,
            resourceType: 'image',
            public_id: `case_${uuidv4()}`,
          },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              setMediaUrls((prev) => [...prev, result.info.secure_url]);
            } else if (error) {
              setError('Image upload failed.');
            }
          }
        );
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) {
      setError('Please wait, authentication is loading.');
      return;
    }
    if (!user) {
      setError('You must be logged in to submit a case.');
      return;
    }
    try {
      const caseData = {
        title: title || 'Untitled Case',
        presentingComplaint: presentingComplaint || 'Not specified',
        history: history || 'Not provided',
        investigations: investigations || 'Not provided',
        management: management || 'Not provided',
        provisionalDiagnosis: provisionalDiagnosis || 'Not specified',
        hospital: hospital || 'Not specified',
        referralCenter: referralCenter || 'Not specified',
        specialty: specialty || 'Not specified',
        discussion: discussion || 'Not provided',
        mediaUrls,
      };
      await addCase(caseData, user.uid, user.displayName || 'Anonymous', user.photoURL);
      router.push('/cases');
    } catch (err) {
      setError(err.message || 'Failed to submit case.');
    }
  };

  return (
    <div className={styles.caseForm}>
      <h2>Submit Case Report</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h3>Case Overview</h3>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Case Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className={styles.textareaField}
            placeholder="Chief Concern *"
            value={presentingComplaint}
            onChange={(e) => setPresentingComplaint(e.target.value)}
            required
          />
          <select
            className={styles.inputField}
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            required
          >
            <option value="">Select Specialty *</option>
            <option value="Internal Medicine">Internal Medicine</option>
            <option value="Surgery">Surgery</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Neurology">Neurology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className={styles.section}>
          <h3>Clinical Details</h3>
          <textarea
            className={styles.textareaField}
            placeholder="History of Presenting Complaint"
            value={history}
            onChange={(e) => setHistory(e.target.value)}
          />
          <textarea
            className={styles.textareaField}
            placeholder="Investigations"
            value={investigations}
            onChange={(e) => setInvestigations(e.target.value)}
          />
          <textarea
            className={styles.textareaField}
            placeholder="Management"
            value={management}
            onChange={(e) => setManagement(e.target.value)}
          />
          <input
            className={styles.inputField}
            type="text"
            placeholder="Provisional Diagnosis"
            value={provisionalDiagnosis}
            onChange={(e) => setProvisionalDiagnosis(e.target.value)}
          />
        </div>
        <div className={styles.section}>
          <h3>Case Context</h3>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Hospital Name"
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
          />
          <input
            className={styles.inputField}
            type="text"
            placeholder="Referral Center (if applicable)"
            value={referralCenter}
            onChange={(e) => setReferralCenter(e.target.value)}
          />
        </div>
        <div className={styles.section}>
          <h3>Discussion</h3>
          <textarea
            className={`${styles.textareaField} ${styles.discussion}`}
            placeholder="Discussion (e.g., clinical implications, challenges, learning points)"
            value={discussion}
            onChange={(e) => setDiscussion(e.target.value)}
          />
        </div>
        <div className={styles.section}>
          <h3>Images</h3>
          <button
            type="button"
            onClick={() => widgetRef.current?.open()}
            className={styles.uploadButton}
          >
            Upload Images
          </button>
          {mediaUrls.length > 0 && (
            <div className={styles.mediaPreview}>
              {mediaUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Uploaded image ${index + 1}`}
                  className={styles.previewImage}
                />
              ))}
            </div>
          )}
        </div>
        <button type="submit" className={styles.submitButton} disabled={loading || !user}>
          Submit Case Report
        </button>
      </form>
    </div>
  );
}