import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { addCase, getSpecialties } from '../../firebase/firestore';
import styles from '../../styles/caseForm.module.css';
import { useAuth } from '../../hooks/useAuth';

export default function CaseForm() {
  const { user, loading, error: authError } = useAuth();
  const [title, setTitle] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [complaint, setComplaint] = useState('');
  const [history, setHistory] = useState('');
  const [examination, setExamination] = useState('');
  const [investigations, setInvestigations] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [management, setManagement] = useState('');
  const [discussionPoints, setDiscussionPoints] = useState('');
  const [mediaUrls, setMediaUrls] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState('');
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const router = useRouter();

  useEffect(() => {
    // Load specialties for dropdown
    const fetchSpecialties = async () => {
      try {
        const specialtyList = await getSpecialties();
        setSpecialties(specialtyList);
      } catch (err) {
        console.error('CaseForm: Error fetching specialties', err);
        setError('Failed to load specialties');
      }
    };
    fetchSpecialties();

    // Initialize Cloudinary widget
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
          folder: 'uganda_clinical_cases',
          sources: ['local', 'camera'],
          multiple: true,
          resourceType: 'auto', // Support images and videos
          clientAllowedFormats: ['png', 'jpg', 'jpeg', 'pdf', 'mp4'],
          maxFileSize: 10000000, // 10MB
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            console.log('CaseForm: Media uploaded', result.info.secure_url);
            setMediaUrls((prev) => [...prev, result.info.secure_url]);
          } else if (error) {
            console.error('CaseForm: Upload error', error);
            setError('Media upload failed: ' + error.message);
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
    if (loading) {
      setError('Authentication is still loading. Please wait.');
      return;
    }
    if (!user || !user.isDoctor) {
      setError('Only verified doctors can submit cases.');
      return;
    }
    try {
      const caseData = {
        title,
        specialty,
        presentingComplaint: complaint,
        history,
        physicalExamination: examination,
        investigations,
        provisionalDiagnosis: diagnosis,
        management,
        discussionPoints,
        mediaUrls,
        createdAt: new Date(),
        userId: user.uid,
        userName: isAnonymous ? 'Anonymous Doctor' : user.displayName || 'Doctor',
        hospital: user.hospital || 'Not specified',
        isAnonymous,
        status: 'open', // For moderation and discussion tracking
        region: user.region || 'Uganda',
      };
      await addCase(caseData);
      router.push('/cases/discussion');
    } catch (err) {
      console.error('CaseForm: Submission error', err);
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user || !user.isDoctor) {
    return <p className={styles.error}>Access restricted to verified doctors.</p>;
  }

  return (
    <div className={styles.caseForm}>
      <h2>Submit Clinical Case for Discussion</h2>
      {authError && <p className={styles.error}>Auth Error: {authError}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Case Title (e.g., 32M with Fever and Rash)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          required
        >
          <option value="">Select Specialty</option>
          {specialties.map((spec) => (
            <option key={spec.id} value={spec.name}>
              {spec.name}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Presenting Complaint (e.g., Patient presents with...)"
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
          placeholder="Physical Examination Findings"
          value={examination}
          onChange={(e) => setExamination(e.target.value)}
        />
        <textarea
          placeholder="Investigations (e.g., Lab results, imaging)"
          value={investigations}
          onChange={(e) => setInvestigations(e.target.value)}
        />
        <textarea
          placeholder="Provisional Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
        />
        <textarea
          placeholder="Management Plan"
          value={management}
          onChange={(e) => setManagement(e.target.value)}
        />
        <textarea
          placeholder="Discussion Points (e.g., Diagnostic challenges, treatment options)"
          value={discussionPoints}
          onChange={(e) => setDiscussionPoints(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => widgetRef.current?.open()}
          className={styles.uploadButton}
        >
          Upload Media (Images, PDFs, Videos)
        </button>
        {mediaUrls.length > 0 && (
          <div className={styles.mediaPreview}>
            <p>Uploaded media:</p>
            <ul>
              {mediaUrls.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    View File {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        <label>
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) => setIsAnonymous(e.target.checked)}
          />
          Post anonymously
        </label>
        <button type="submit" disabled={!user.isDoctor}>
          Submit Case for Discussion
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}