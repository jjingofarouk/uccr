import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { updateCase, getCaseById } from '../../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import Loading from '../Loading';
import dynamic from 'next/dynamic';
import styles from '../../styles/caseForm.module.css';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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
    specialty: [],
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

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const steps = [
    { name: 'title', label: 'Case Title', type: 'richtext', placeholder: 'Enter case title' },
    { name: 'presentingComplaint', label: 'Presenting Complaint', type: 'richtext', placeholder: 'Describe the presenting complaint' },
    { name: 'history', label: 'History', type: 'richtext', placeholder: 'Patient history' },
    { name: 'physicalExam', label: 'Physical Examination', type: 'richtext', placeholder: 'Physical exam findings' },
    { name: 'investigations', label: 'Investigations', type: 'richtext', placeholder: 'Investigation results' },
    { name: 'management', label: 'Management', type: 'richtext', placeholder: 'Management plan' },
    { name: 'provisionalDiagnosis', label: 'Provisional Diagnosis', type: 'richtext', placeholder: 'Enter provisional diagnosis' },
    { name: 'hospital', label: 'Hospital', type: 'richtext', placeholder: 'Enter hospital name' },
    { name: 'referralCenter', label: 'Referral Center', type: 'richtext', placeholder: 'Enter referral center' },
    {
      name: 'specialty',
      label: 'Specialty',
      type: 'select',
      options: [
        { value: 'General Practice', label: 'General Practice' },
        { value: 'Internal Medicine', label: 'Internal Medicine' },
        { value: 'Family Medicine', label: 'Family Medicine' },
        { value: 'Pediatrics', label: 'Pediatrics' },
        { value: 'Obstetrics and Gynecology', label: 'Obstetrics and Gynecology' },
        { value: 'General Surgery', label: 'General Surgery' },
        { value: 'Emergency Medicine', label: 'Emergency Medicine' },
        { value: 'Anesthesiology', label: 'Anesthesiology' },
        { value: 'Psychiatry', label: 'Psychiatry' },
        { value: 'Radiology', label: 'Radiology' },
        { value: 'Pathology', label: 'Pathology' },
        { value: 'Orthopedic Surgery', label: 'Orthopedic Surgery' },
        { value: 'Cardiology', label: 'Cardiology' },
        { value: 'Pulmonology', label: 'Pulmonology' },
        { value: 'Nephrology', label: 'Nephrology' },
        { value: 'Gastroenterology', label: 'Gastroenterology' },
        { value: 'Endocrinology', label: 'Endocrinology' },
        { value: 'Infectious Diseases', label: 'Infectious Diseases' },
        { value: 'Dermatology', label: 'Dermatology' },
        { value: 'Neurology', label: 'Neurology' },
        { value: 'Urology', label: 'Urology' },
        { value: 'Ophthalmology', label: 'Ophthalmology' },
        { value: 'Otolaryngology (ENT)', label: 'Otolaryngology (ENT)' },
        { value: 'Hematology', label: 'Hematology' },
        { value: 'Oncology', label: 'Oncology' },
        { value: 'Rheumatology', label: 'Rheumatology' },
        { value: 'Plastic Surgery', label: 'Plastic Surgery' },
        { value: 'Thoracic Surgery', label: 'Thoracic Surgery' },
        { value: 'Vascular Surgery', label: 'Vascular Surgery' },
        { value: 'Neurosurgery', label: 'Neurosurgery' },
        { value: 'Critical Care Medicine', label: 'Critical Care Medicine' },
        { value: 'Allergy and Immunology', label: 'Allergy and Immunology' },
        { value: 'Geriatrics', label: 'Geriatrics' },
        { value: 'Sports Medicine', label: 'Sports Medicine' },
        { value: 'Rehabilitation Medicine (PM&R)', label: 'Rehabilitation Medicine (PM&R)' },
        { value: 'Palliative Care', label: 'Palliative Care' },
        { value: 'Occupational Medicine', label: 'Occupational Medicine' },
        { value: 'Medical Genetics', label: 'Medical Genetics' },
        { value: 'Nuclear Medicine', label: 'Nuclear Medicine' },
        { value: 'Transplant Medicine', label: 'Transplant Medicine' },
        { value: 'Sleep Medicine', label: 'Sleep Medicine' },
        { value: 'Pain Medicine', label: 'Pain Medicine' },
        { value: 'Forensic Medicine', label: 'Forensic Medicine' },
        { value: 'Hyperbaric Medicine', label: 'Hyperbaric Medicine' },
        { value: 'Tropical Medicine', label: 'Tropical Medicine' },
        { value: 'Space Medicine', label: 'Space Medicine' },
        { value: 'Other', label: 'Other' },
      ],
    },
    { name: 'discussion', label: 'Discussion', type: 'richtext', placeholder: 'Discuss the case' },
    { name: 'highLevelSummary', label: 'High-Level Summary', type: 'richtext', placeholder: 'Summarize the case' },
    { name: 'references', label: 'References', type: 'richtext', placeholder: 'List references' },
    { name: 'mediaUrls', label: 'Upload Media', type: 'media' },
  ];

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
            specialty: Array.isArray(caseData.specialty) ? caseData.specialty : [],
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

  const handleChange = (value, name) => {
    if (name === 'specialty') {
      const selectedOptions = Array.from(value.target.selectedOptions).map(option => option.value);
      setFormData(prev => ({ ...prev, specialty: selectedOptions }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
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
    if (currentStep !== steps.length - 1) {
      setError('Please complete all steps before submitting.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const caseData = {
        ...formData,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        thumbnailUrl: formData.mediaUrls[0] || '',
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
                {step.type === 'richtext' && (
                  <ReactQuill
                    theme="snow"
                    value={formData[step.name]}
                    onChange={(value) => handleChange(value, step.name)}
                    placeholder={step.placeholder}
                    modules={quillModules}
                    className={styles.quillEditor}
                  />
                )}
                {step.type === 'select' && (
                  <select
                    name={step.name}
                    value={formData[step.name]}
                    onChange={(e) => handleChange(e, step.name)}
                    multiple
                    size="5"
                    className={styles.selectInput}
                  >
                    {step.options.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
                {step.type === 'media' && (
                  <div className={styles.mediaSection}>
                    <button
                      type="button"
                      onClick={() => widgetRef.current?.open()}
                      disabled={!widgetRef.current}
                      className={styles.uploadButton}
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
                                className={styles.mediaImage}
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
                                  className={styles.deleteIcon}
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
              className={styles.navIcon}
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
                className={styles.navIcon}
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
        {error && <p role="alert" className={styles.error}>{error}</p>}
        {(isLoading || forceLoading) && <Loading />}
      </form>
    </div>
  );
}