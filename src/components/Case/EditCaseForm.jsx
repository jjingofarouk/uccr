// src/components/Case/EditCaseForm.jsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { updateCase, getCaseById } from '../../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles/caseForm.module.css';
import FormHeader from './FormHeader';
import ProgressBar from './ProgressBar';
import StepContent from './StepContent';
import Navigation from './EditNavigation';
import ErrorMessage from './ErrorMessage';
import Loading from '../Loading';

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
  const [isUploading, setIsUploading] = useState(false);
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const formContainerRef = useRef();
  const router = useRouter();
  const SUBMISSION_LOADING_DURATION = 1000;

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
    { name: 'specialty', label: 'Specialty', type: 'select', options: [
      { value: 'Adolescent Medicine', label: 'Adolescent Medicine' },
      { value: 'Allergy and Immunology', label: 'Allergy and Immunology' },
      { value: 'Anesthesiology', label: 'Anesthesiology' },
      { value: 'Aviation Medicine', label: 'Aviation Medicine' },
      { value: 'Bacteriology', label: 'Bacteriology' },
      { value: 'Biomedical Engineering', label: 'Biomedical Engineering' },
      { value: 'Biostatistics', label: 'Biostatistics' },
      { value: 'Cardiology', label: 'Cardiology' },
      { value: 'Cardiothoracic Surgery', label: 'Cardiothoracic Surgery' },
      { value: 'Chemical Pathology', label: 'Chemical Pathology' },
      { value: 'Child and Adolescent Psychiatry', label: 'Child and Adolescent Psychiatry' },
      { value: 'Clinical Chemistry', label: 'Clinical Chemistry' },
      { value: 'Clinical Epidemiology', label: 'Clinical Epidemiology' },
      { value: 'Clinical Pharmacology', label: 'Clinical Pharmacology' },
      { value: 'Clinical Psychology', label: 'Clinical Psychology' },
      { value: 'Clinical Trials', label: 'Clinical Trials' },
      { value: 'Community Medicine', label: 'Community Medicine' },
      { value: 'Cytopathology', label: 'Cytopathology' },
      { value: 'Dermatology', label: 'Dermatology' },
      { value: 'Developmental Pediatrics', label: 'Developmental Pediatrics' },
      { value: 'Disaster Medicine', label: 'Disaster Medicine' },
      { value: 'Ear, Nose and Throat (ENT)', label: 'Ear, Nose and Throat (ENT)' },
      { value: 'Emergency Medicine', label: 'Emergency Medicine' },
      { value: 'Endocrinology', label: 'Endocrinology' },
      { value: 'Epidemiology', label: 'Epidemiology' },
      { value: 'Family Medicine', label: 'Family Medicine' },
      { value: 'Forensic Medicine', label: 'Forensic Medicine' },
      { value: 'Gastroenterology', label: 'Gastroenterology' },
      { value: 'General Practice', label: 'General Practice' },
      { value: 'Genitourinary Medicine', label: 'Genitourinary Medicine' },
      { value: 'Geriatrics', label: 'Geriatrics' },
      { value: 'Health Economics', label: 'Health Economics' },
      { value: 'Health Informatics', label: 'Health Informatics' },
      { value: 'Health Policy and Management', label: 'Health Policy and Management' },
      { value: 'Hematology', label: 'Hematology' },
      { value: 'Histopathology', label: 'Histopathology' },
      { value: 'Hyperbaric Medicine', label: 'Hyperbaric Medicine' },
      { value: 'Immunopathology', label: 'Immunopathology' },
      { value: 'Infectious Diseases', label: 'Infectious Diseases' },
      { value: 'Internal Medicine', label: 'Internal Medicine' },
      { value: 'Marine Medicine', label: 'Marine Medicine' },
      { value: 'Maxillofacial Surgery', label: 'Maxillofacial Surgery' },
      { value: 'Medical Administration', label: 'Medical Administration' },
      { value: 'Medical Anthropology', label: 'Medical Anthropology' },
      { value: 'Medical Education', label: 'Medical Education' },
      { value: 'Medical Ethics', label: 'Medical Ethics' },
      { value: 'Medical Genetics', label: 'Medical Genetics' },
      { value: 'Medical Imaging', label: 'Medical Imaging' },
      { value: 'Medical Microbiology', label: 'Medical Microbiology' },
      { value: 'Medical Oncology', label: 'Medical Oncology' },
      { value: 'Medical Toxicology', label: 'Medical Toxicology' },
      { value: 'Neonatology', label: 'Neonatology' },
      { value: 'Nephrology', label: 'Nephrology' },
      { value: 'Neurology', label: 'Neurology' },
      { value: 'Neurosurgery', label: 'Neurosurgery' },
      { value: 'Nuclear Medicine', label: 'Nuclear Medicine' },
      { value: 'Obstetrics and Gynecology', label: 'Obstetrics and Gynecology' },
      { value: 'Occupational Medicine', label: 'Occupational Medicine' },
      { value: 'Ophthalmology', label: 'Ophthalmology' },
      { value: 'Orthopedic Surgery', label: 'Orthopedic Surgery' },
      { value: 'Pain Medicine', label: 'Pain Medicine' },
      { value: 'Palliative Care', label: 'Palliative Care' },
      { value: 'Parasitology', label: 'Parasitology' },
      { value: 'Pathology', label: 'Pathology' },
      { value: 'Pediatrics', label: 'Pediatrics' },
      { value: 'Plastic Surgery', label: 'Plastic Surgery' },
      { value: 'Psychiatry', label: 'Psychiatry' },
      { value: 'Public Health', label: 'Public Health' },
      { value: 'Pulmonology', label: 'Pulmonology' },
      { value: 'Radiation Oncology', label: 'Radiation Oncology' },
      { value: 'Radiology', label: 'Radiology' },
      { value: 'Rehabilitation Medicine', label: 'Rehabilitation Medicine' },
      { value: 'Rheumatology', label: 'Rheumatology' },
      { value: 'Sleep Medicine', label: 'Sleep Medicine' },
      { value: 'Sports Medicine', label: 'Sports Medicine' },
      { value: 'Surgery', label: 'Surgery' },
      { value: 'Telemedicine', label: 'Telemedicine' },
      { value: 'Tropical Medicine', label: 'Tropical Medicine' },
      { value: 'Urology', label: 'Urology' },
      { value: 'Vascular Surgery', label: 'Vascular Surgery' },
      { value: 'Virology', label: 'Virology' },
    ]},
    { name: 'discussion', label: 'Discussion', type: 'richtext', placeholder: 'Discuss the case' },
    { name: 'highLevelSummary', label: 'Case Summary', type: 'richtext', placeholder: 'Summarize the case' },
    { name: 'references', label: 'References', type: 'richtext', placeholder: 'List references' },
    { name: 'mediaUrls', label: 'Upload Media', type: 'media', placeholder: 'Upload media' },
  ];

  useEffect(() => {
    const fetchCaseData = async () => {
      if (caseId && user && user.uid) {
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
          setError(`Failed to load case data: ${err.message}`);
          setIsLoading(false);
        }
      }
    };
    fetchCaseData();
  }, [caseId, user]);

  useEffect(() => {
    if (typeof window !== 'undefined' && user && user.uid) {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        cloudinaryRef.current = window.cloudinary;
        if (cloudinaryRef.current) {
          widgetRef.current = cloudinaryRef.current.createUploadWidget(
            {
              cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
              uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
              folder: `cases/${user.uid}`,
              sources: ['local', 'camera'],
              multiple: true,
              resourceType: 'image',
              clientAllowedFormats: ['jpg', 'png', 'jpeg'],
              maxFileSize: 10000000,
              public_id: `upload_${uuidv4()}`,
              buttonClass: 'cloudinary-button',
            },
            (error, result) => {
              if (result && result.event === 'upload-added') {
                setIsUploading(true);
                if (window.gtag) {
                  window.gtag('event', 'media_upload_started', {
                    event_category: 'EditCaseForm',
                    event_label: 'Media Upload Initiated',
                  });
                }
              }
              if (!error && result && result.event === 'success') {
                setFormData((prev) => ({
                  ...prev,
                  mediaUrls: [...prev.mediaUrls, result.info.secure_url],
                }));
                setIsUploading(false);
                if (window.gtag) {
                  window.gtag('event', 'media_upload_success', {
                    event_category: 'EditCaseForm',
                    event_label: 'Media Upload Completed',
                    value: result.info.secure_url,
                  });
                }
              } else if (error) {
                setError(error.message || 'Image upload failed. Please try again.');
                setIsUploading(false);
                if (window.gtag) {
                  window.gtag('event', 'media_upload_failed', {
                    event_category: 'EditCaseForm',
                    event_label: 'Media Upload Error',
                    value: error.message,
                  });
                }
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
      const selectedOptions = Array.from(value.target.selectedOptions).map((option) => option.value);
      setFormData((prev) => ({ ...prev, specialty: selectedOptions }));
      if (window.gtag) {
        window.gtag('event', 'specialty_selected', {
          event_category: 'EditCaseForm',
          event_label: 'Specialty Selection',
          value: selectedOptions.join(', '),
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (window.gtag) {
        window.gtag('event', 'form_field_updated', {
          event_category: 'EditCaseForm',
          event_label: `Field Updated: ${name}`,
        });
      }
    }
  };

  const handleDeleteMedia = (index) => {
    const deletedUrl = formData.mediaUrls[index];
    setFormData((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }));
    if (window.gtag) {
      window.gtag('event', 'media_deleted', {
        event_category: 'EditCaseForm',
        event_label: 'Media Deleted',
        value: deletedUrl,
      });
    }
  };

  const validateStep = () => {
    const currentField = steps[currentStep].name;
    if (currentField === 'mediaUrls' || currentField === 'specialty') return true;
    return formData[currentField].trim() !== '';
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (!validateStep()) {
      setError('Please fill out the current step before proceeding.');
      return;
    }
    if (isUploading) {
      setError('Please wait for the upload to complete.');
      return;
    }
    if (currentStep < steps.length - 1) {
      setError('');
      setCurrentStep(currentStep + 1);
      if (window.gtag) {
        window.gtag('event', 'form_step_next', {
          event_category: 'EditCaseForm',
          event_label: `Step ${currentStep + 1}: ${steps[currentStep].label}`,
          value: currentStep + 2,
        });
      }
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    if (currentStep > 0) {
      setError('');
      setCurrentStep(currentStep - 1);
      if (window.gtag) {
        window.gtag('event', 'form_step_previous', {
          event_category: 'EditCaseForm',
          event_label: `Step ${currentStep - 1}: ${steps[currentStep - 1].label}`,
          value: currentStep,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) {
      setError('You must be logged in to edit a case.');
      if (window.gtag) {
        window.gtag('event', 'submission_failed', {
          event_category: 'EditCaseForm',
          event_label: 'Submission Failed: Not Logged In',
        });
      }
      return;
    }
    if (currentStep !== steps.length - 1) {
      setError('Please complete all steps before submitting.');
      if (window.gtag) {
        window.gtag('event', 'submission_failed', {
          event_category: 'EditCaseForm',
          event_label: 'Submission Failed: Incomplete Steps',
        });
      }
      return;
    }
    if (isUploading) {
      setError('Please wait for the upload to complete before submitting.');
      if (window.gtag) {
        window.gtag('event', 'submission_failed', {
          event_category: 'EditCaseForm',
          event_label: 'Submission Failed: Media Uploading',
        });
      }
      return;
    }
    const requiredFields = steps
      .filter((step) => step.type !== 'media' && step.name !== 'specialty')
      .map((step) => step.name);
    const isValid = requiredFields.every((field) => formData[field].trim() !== '');
    if (!isValid) {
      setError('Please fill out all required fields.');
      if (window.gtag) {
        window.gtag('event', 'submission_failed', {
          event_category: 'EditCaseForm',
          event_label: 'Submission Failed: Missing Required Fields',
        });
      }
      return;
    }
    setError('');
    setIsLoading(true);
    if (window.gtag) {
      window.gtag('event', 'submission_started', {
        event_category: 'EditCaseForm',
        event_label: 'Case Update Started',
      });
    }
    try {
      const caseData = {
        ...formData,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        thumbnailUrl: formData.mediaUrls[0] || '',
      };
      await updateCase(caseId, caseData);
      setLoadStart(Date.now());
      setForceLoading(true);
      if (window.gtag) {
        window.gtag('event', 'submission_success', {
          event_category: 'EditCaseForm',
          event_label: 'Case Update Successful',
          value: caseId,
        });
      }
    } catch (err) {
      setError('Failed to update case: ' + (err.message.includes('permission-denied') ? 'Insufficient permissions.' : err.message));
      setIsLoading(false);
      if (window.gtag) {
        window.gtag('event', 'submission_failed', {
          event_category: 'EditCaseForm',
          event_label: 'Submission Failed: Error',
          value: err.message,
        });
      }
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

  if (authLoading || isLoading) return <Loading />;
  if (authError) return <div>Error: {authError}</div>;
  if (!user) return <div>Please log in to edit a case.</div>;

  return (
    <div className={styles.caseFormWrapper}>
      <div className={styles.caseForm} ref={formContainerRef}>
        <FormHeader title="Edit Case" />
        <ProgressBar currentStep={currentStep} stepsLength={steps.length} />
        <form onSubmit={handleSubmit}>
          <StepContent
            steps={steps}
            currentStep={currentStep}
            formData={formData}
            handleChange={handleChange}
            handleDeleteMedia={handleDeleteMedia}
            widgetRef={widgetRef}
            isUploading={isUploading}
          />
          <Navigation
            currentStep={currentStep}
            stepsLength={steps.length}
            isUploading={isUploading}
            isLoading={isLoading}
            nextStep={nextStep}
            prevStep={prevStep}
            submitText="Update Case"
          />
          <ErrorMessage error={error} />
        </form>
      </div>
    </div>
  );
}