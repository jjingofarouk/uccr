import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { updateCase, getCaseById } from '../../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import Loading from '../Loading';
import styles from '../../styles/caseForm.module.css';

export default function EditCaseForm({ caseId }) {
  const { user, loading: authLoading, error: authError } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    presentingComplaint: '',
    history: '',
    physicalExam: '',
    investigations: '',
    management: '',
    provisionalDiagnosis: '',
    hospital: '',
    referralCenter: '',
    specialty: '',
    discussion: '',
    highLevelSummary: '',
    references: '',
    mediaUrls: [],
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadStart, setLoadStart] = useState(null);
  const [forceLoading, setForceLoading] = useState(false);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const router = useRouter();
  const SUBMISSION_LOADING_DURATION = 1000;

  // Fetch case data
  useEffect(() => {
    const fetchCase = async () => {
      if (caseId && user) {
        try {
          const caseData = await getCaseById(caseId);
          if (!caseData) {
            setError('Case not found.');
            setIsLoading(false);
            return;
          }
          if (caseData.userId !== user.uid) {
            setError('You do not have permission to edit this case.');
            setIsLoading(false);
            return;
          }
          setFormData({
            title: caseData.title || '',
            presentingComplaint: caseData.presentingComplaint || '',
            history: caseData.history || '',
            physicalExam: caseData.physicalExam || '',
            investigations: caseData.investigations || '',
            management: caseData.management || '',
            provisionalDiagnosis: caseData.provisionalDiagnosis || '',
            hospital: caseData.hospital || '',
            referralCenter: caseData.referralCenter || '',
            specialty: caseData.specialty || '',
            discussion: caseData.discussion || '',
            highLevelSummary: caseData.highLevelSummary || '',
            references: caseData.references || '',
            mediaUrls: Array.isArray(caseData.mediaUrls) ? caseData.mediaUrls : [],
          });
          setIsLoading(false);
        } catch (err) {
          setError('Failed to load case: ' + err.message);
          setIsLoading(false);
        }
      }
    };
    fetchCase();
  }, [caseId, user]);

  // Initialize Cloudinary widget
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
              } else if (error) {
                setError('Image upload failed.');
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
    const normalizedValue = name === 'title' || name === 'provisionalDiagnosis' || name === 'hospital' || name === 'referralCenter' || name === 'specialty'
      ? value
      : value.replace(/\n{3,}/g, '\n\n').trimEnd().replace(/ {2,}/g, ' ');
    setFormData(prev => ({ ...prev, [name]: normalizedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) {
      setError('You must be logged in to edit a case.');
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
      await updateCase(caseId, caseData);
      setLoadStart(Date.now());
      setForceLoading(true);
    } catch (err) {
      setError('Failed to update case: ' + err.message);
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
        router.push(`/cases/${caseId}`);
      } else {
        const timer = setTimeout(() => {
          setForceLoading(false);
          setIsLoading(false);
          router.push(`/cases/${caseId}`);
        }, remaining);
        return () => clearTimeout(timer);
      }
    }
  }, [forceLoading, loadStart, router, caseId]);

  if (authLoading || isLoading) {
    return <Loading />;
  }

  if (authError) {
    return <div>Error: {authError}</div>;
  }

  if (!user) {
    return <div>Please log in to edit a case.</div>;
  }

  return (
    <div className={styles.caseForm}>
      <h2>Edit Case</h2>
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
"
          placeholder="History"
          value={formData.history}
          onChange={handleChange}
        />
        <textarea
          name="physicalExam"
          placeholder="Physical Examination"
          value={formData.physicalExam}
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
          <option value="Oncology">Oncology</option>
          <option value="Endocrinology">Endocrinology</option>
          <option value="Gastroenterology">Gastroenterology</option>
          <option value="Hematology">Hematology</option>
          <option value="Infectious Diseases">Infectious Diseases</option>
          <option value="Nephrology">Nephrology</option>
          <option value="Pulmonology">Pulmonology</option>
          <option value="Rheumatology">Rheumatology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Ophthalmology">Ophthalmology</option>
          <option value="Otolaryngology">Otolaryngology</option>
          <option value="Urology">Urology</option>
          <option value="Anesthesiology">Anesthesiology</option>
          <option value="Emergency Medicine">Emergency Medicine</option>
          <option value="Critical Care Medicine">Critical Care Medicine</option>
          <option value="Psychiatry">Psychiatry</option>
          <option value="Radiology">Radiology</option>
          <option value="Pathology">Pathology</option>
          <option value="Plastic Surgery">Plastic Surgery</option>
          <option value="Thoracic Surgery">Thoracic Surgery</option>
          <option value="Vascular Surgery">Vascular Surgery</option>
          <option value="Neonatology">Neonatology</option>
          <option value="Geriatrics">Geriatrics</option>
          <option value="Allergy & Immunology">Allergy & Immunology</option>
          <option value="Pain Medicine">Pain Medicine</option>
          <option value="Sports Medicine">Sports Medicine</option>
          <option value="Palliative Care">Palliative Care</option>
          <option value="Medical Genetics">Medical Genetics</option>
          <option value="Other">Other</option>
        </select>
        <textarea
          name="discussion"
          placeholder="Discussion"
          value={formData.discussion}
          onChange={handleChange}
        />
        <textarea
          name="highLevelSummary"
          placeholder="High-Level Summary"
          value={formData.highLevelSummary}
          onChange={handleChange}
        />
        <textarea
          name="references"
          placeholder="References"
          value={formData.references}
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
              />
            ))}
          </div>
        )}
        <button type="submit">Update Case</button>
        {error && <p>{error}</p>}
        {(isLoading || forceLoading) && <Loading />}
      </form>
    </div>
  );
}