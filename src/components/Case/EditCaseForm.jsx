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
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadStart, setLoadStart] = useState(null);
  const [forceLoading, setForceLoading] = useState(false);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const router = useRouter();
  const SUBMISSION_LOADING_DURATION = 1000;

  const steps = [
    { name: 'title', label: 'Case Title', type: 'input', placeholder: 'Enter case title' },
    { name: 'presentingComplaint', label: 'Presenting Complaint', type: 'textarea', placeholder: 'Describe the presenting complaint' },
    { name: 'history', label: 'History', type: 'textarea', placeholder: 'Patient history' },
    { name: 'physicalExam', label: 'Physical Examination', type: 'textarea', placeholder: 'Physical exam findings' },
    { name: 'investigations', label: 'Investigations', type: 'textarea', placeholder: 'Investigation results' },
    { name: 'management', label: 'Management', type: 'textarea', placeholder: 'Management plan' },
    { name: 'provisionalDiagnosis', label: 'Provisional Diagnosis', type: 'input', placeholder: 'Enter provisional diagnosis' },
    { name: 'hospital', label: 'Hospital', type: 'input', placeholder: 'Enter hospital name' },
    { name: 'referralCenter', label: 'Referral Center', type: 'input', placeholder: 'Enter referral center' },
    { name: 'specialty', label: 'Specialty', type: 'select', options: [
      { value: '', label: 'Select Specialty' },
      { value: 'Internal Medicine', label: 'Internal Medicine' },
      { value: 'Surgery', label: 'Surgery' },
      { value: 'Pediatrics', label: 'Pediatrics' },
      { value: 'Obstetrics & Gynecology', label: 'Obstetrics & Gynecology' },
      { value: 'Cardiology', label: 'Cardiology' },
      { value: 'Neurology', label: 'Neurology' },
      { value: 'Orthopedics', label: 'Orthopedics' },
      { value: 'Oncology', label: 'Oncology' },
      { value: 'Endocrinology', label: 'Endocrinology' },
      { value: 'Gastroenterology', label: 'Gastroenterology' },
      { value: 'Hematology', label: 'Hematology' },
      { value: 'Infectious Diseases', label: 'Infectious Diseases' },
      { value: 'Nephrology', label: 'Nephrology' },
      { value: 'Pulmonology', label: 'Pulmonology' },
      { value: 'Rheumatology', label: 'Rheumatology' },
      { value: 'Dermatology', label: 'Dermatology' },
      { value: 'Ophthalmology', label: 'Ophthalmology' },
      { value: 'Otolaryngology', label: 'Otolaryngology' },
      { value: 'Urology', label: 'Urology' },
      { value: 'Anesthesiology', label: 'Anesthesiology' },
      { value: 'Emergency Medicine', label: 'Emergency Medicine' },
      { value: 'Critical Care Medicine', label: 'Critical Care Medicine' },
      { value: 'Psychiatry', label: 'Psychiatry' },
      { value: 'Radiology', label: 'Radiology' },
      { value: 'Pathology', label: 'Pathology' },
      { value: 'Plastic Surgery', label: 'Plastic Surgery' },
      { value: 'Thoracic Surgery', label: 'Thoracic Surgery' },
      { value: 'Vascular Surgery', label: 'Vascular Surgery' },
      { value: 'Neonatology', label: 'Neonatology' },
      { value: 'Geriatrics', label: 'Geriatrics' },
      { value: 'Allergy & Immunology', label: 'Allergy & Immunology' },
      { value: 'Pain Medicine', label: 'Pain Medicine' },
      { value: 'Sports Medicine', label: 'Sports Medicine' },
      { value: 'Palliative Care', label: 'Palliative Care' },
      { value: 'Medical Genetics', label: 'Medical Genetics' },
      { value: 'Other', label: 'Other' },
    ]},
    { name: 'discussion', label: 'Discussion', type: 'textarea', placeholder: 'Discuss the case' },
    { name: 'highLevelSummary', label: 'High-Level Summary', type: 'textarea', placeholder: 'Summarize the case' },
    { name: 'references', label: 'References', type: 'textarea', placeholder: 'List references' },
    { name: 'mediaUrls', label: 'Upload Media', type: 'media' },
  ];

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

  const handleDeleteMedia = (index) => {
    setFormData(prev => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }));
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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>
      <p className={styles.stepIndicator}>
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].label}
      </p>
      <form onSubmit={handleSubmit}>
        <div className={styles.carousel}>
          <div
            className={styles.carouselInner}
            style={{ transform: `translateX(-${currentStep * 100}%)` }}
          >
            {steps.map((step, index) => (
              <div key={step.name} className={styles.carouselItem}>
                {step.type === 'input' && (
                  <input
                    type="text"
                    name={step.name}
                    placeholder={step.placeholder}
                    value={formData[step.name]}
                    onChange={handleChange}
                  />
                )}
                {step.type === 'textarea' && (
                  <textarea
                    name={step.name}
                    placeholder={step.placeholder}
                    value={formData[step.name]}
                    onChange={handleChange}
                  />
                )}
                {step.type === 'select' && (
                  <select
                    name={step.name}
                    value={formData[step.name]}
                    onChange={handleChange}
                  >
                    {step.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {step.type === 'media' && (
                  <div>
                    <button
                      type="button"
                      onClick={() => widgetRef.current?.open()}
                      disabled={!widgetRef.current}
                    >
                      Upload Media
                    </button>
                    {formData.mediaUrls.length > 0 && (
                      <div className={styles.mediaPreview}>
                        <p>Uploaded media:</p>
                        <div className={styles.mediaGrid}>
                          {formData.mediaUrls.map((url, index) => (
                            <div key={index} className={styles.mediaItem}>
                              <Image
                                src={url}
                                alt={`Uploaded media ${index + 1}`}
                                width={120}
                                height={120}
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteMedia(index)}
                                className={styles.deleteButton}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.navigation}>
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={styles.navButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className={styles.navButton}
            >
              Next
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button type="submit" className={styles.submitButton}>
              Update Case
            </button>
          )}
        </div>
        {error && <p role="alert">{error}</p>}
        {(isLoading || forceLoading) && <Loading />}
      </form>
    </div>
  );
}