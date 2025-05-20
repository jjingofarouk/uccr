// src/pages/cases/new.jsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { addCase } from '../../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import Loading from '../../components/Loading';
import styles from '../../styles/caseForm.module.css';

export default function CaseForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    presentingComplaint: '',
    history: '',
    investigations: '',
    management: '',
    provisionalDiagnosis: '',
    hospital: '',
    referralCenter: '',
    specialty: '',
    discussion: '',
    mediaUrls: [],
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadStart, setLoadStart] = useState(null);
  const [forceLoading, setForceLoading] = useState(false);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const router = useRouter();
  const SUBMISSION_LOADING_DURATION = 3000; // 3 seconds for post-submission loading

  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        cloudinaryRef.current = window.cloudinary;
        if (cloudinaryRef.current) {
          widgetRef.current = cloudinaryRef.current.createUploadWidget(
            {
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
              uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
              folder: `cases/${user.uid}`,
              sources: ['local', 'camera'],
              multiple: true,
              resourceType: 'image',
              public_id: `case_${uuidv4()}`,
            },
            (error, result) => {
              if (!error && result && result.event === 'success') {
                setFormData(prev => ({
                  ...prev,
                  mediaUrls: [...prev.mediaUrls, result.info.secure_url],
                }));
                console.log('Cloudinary case URL:', result.info.secure_url);
              } else if (error) {
                setError('Image upload failed.');
                console.error('Cloudinary error:', error);
              }
            }
          );
        }
      };

      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a case.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const caseData = {
        ...formData,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
      };
      console.log('Submitting case:', caseData);
      await addCase(caseData);
      console.log('Case submitted with mediaUrls:', formData.mediaUrls);
      setLoadStart(Date.now());
      setForceLoading(true);
    } catch (err) {
      setError('Failed to create case: ' + err.message);
      console.error('Case creation error:', err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (forceLoading && loadStart) {
      const elapsed = Date.now() - loadStart;
      const remaining = SUBMISSION_LOADING_DURATION - elapsed;
      if (remaining <= 0) {
        setForceLoading(false);
        setIsLoading(false);
        router.push('/cases');
      } else {
        const timer = setTimeout(() => {
          setForceLoading(false);
          setIsLoading(false);
          router.push('/cases');
        }, remaining);
        return () => clearTimeout(timer);
      }
    }
  }, [forceLoading, loadStart, router]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.caseForm}>
      <h2>Create Case</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Case Title"
          value={formData.title}
          onChange={handleChange}
        />
        <textarea
          name="presentingComplaint"
          placeholder="Presenting Complaint"
          value={formData.presentingComplaint}
          onChange={handleChange}
        />
        <textarea
          name="history"
          placeholder="History"
          value={formData.history}
          onChange={handleChange}
        />
        <textarea
          name="investigations"
          placeholder="Investigations"
          value={formData.investigations}
          onChange={handleChange}
        />
        <textarea
          name="management"
          placeholder="Management"
          value={formData.management}
          onChange={handleChange}
        />
        <input
          type="text"
          name="provisionalDiagnosis"
          placeholder="Provisional Diagnosis"
          value={formData.provisionalDiagnosis}
          onChange={handleChange}
        />
        <input
          type="text"
          name="hospital"
          placeholder="Hospital"
          value={formData.hospital}
          onChange={handleChange}
        />
        <input
          type="text"
          name="referralCenter"
          placeholder="Referral Center"
          value={formData.referralCenter}
          onChange={handleChange}
        />
        <select name="specialty" value={formData.specialty} onChange={handleChange}>
          <option value="">Select Specialty</option>
          <option value="Internal Medicine">Internal Medicine</option>
          <option value="Surgery">Surgery</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          name="discussion"
          placeholder="Discussion"
          value={formData.discussion}
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={() => widgetRef.current?.open()}
          disabled={!widgetRef.current}
        >
          Upload Media
        </button>
        {formData.mediaUrls.length > 0 && (
          <div>
            <p>Uploaded media:</p>
            {formData.mediaUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Uploaded media ${index + 1}`}
                width={100}
                height={100}
                onError={(e) => console.error('Form media error:', url)}
              />
            ))}
          </div>
        )}
        <button type="submit">Submit Case</button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
}