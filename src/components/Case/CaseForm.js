import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { addCase, getCases } from '../../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles/caseForm.module.css';
import FormHeader from './FormHeader';
import ProgressBar from './ProgressBar';
import StepContent from './StepContent';
import Navigation from './Navigation';
import ErrorMessage from './ErrorMessage';
import LoadingSkeleton from './LoadingSkeleton';
import { auth } from '../../firebase/config';

export default function CaseForm() {
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
  const [isLoading, setIsLoading] = useState(false);
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
    { name: 'provisionalDiagnosis', label: 'Diagnosis', type: 'richtext', placeholder: 'Enter provisional diagnosis' },
    { name: 'hospital', label: 'Hospital', type: 'richtext', placeholder: 'Enter hospital name' },
    { name: 'referralCenter', label: 'Referral Center', type: 'richtext', placeholder: 'Enter referral center' },
    { name: 'specialty', label: 'Specialty', type: 'select', options: [
      { value: 'Adolescent Medicine', label: 'Adolescent Medicine' },
      { value: 'Allergy and Immunology', label: 'Allergy and Immunology' },
      { value: 'Anesthesiology', label: 'Anesthesiology' },
      { value: 'Cardiology', label: 'Cardiology' },
      { value: 'Dermatology', label: 'Dermatology' },
      { value: 'Emergency Medicine', label: 'Emergency Medicine' },
      { value: 'Endocrinology', label: 'Endocrinology' },
      { value: 'Gastroenterology', label: 'Gastroenterology' },
      { value: 'General Surgery', label: 'General Surgery' },
      { value: 'Hematology', label: 'Hematology' },
      { value: 'Infectious Disease', label: 'Infectious Disease' },
      { value: 'Internal Medicine', label: 'Internal Medicine' },
      { value: 'Nephrology', label: 'Nephrology' },
      { value: 'Neurology', label: 'Neurology' },
      { value: 'Obstetrics and Gynecology', label: 'Obstetrics and Gynecology' },
      { value: 'Oncology', label: 'Oncology' },
      { value: 'Ophthalmology', label: 'Ophthalmology' },
      { value: 'Orthopedic Surgery', label: 'Orthopedic Surgery' },
      { value: 'Otolaryngology', label: 'Otolaryngology' },
      { value: 'Pediatrics', label: 'Pediatrics' },
      { value: 'Psychiatry', label: 'Psychiatry' },
      { value: 'Pulmonology', label: 'Pulmonology' },
      { value: 'Radiology', label: 'Radiology' },
      { value: 'Rheumatology', label: 'Rheumatology' },
      { value: 'Urology', label: 'Urology' },
    ]},
    { name: 'discussion', label: 'Discussion', type: 'richtext', placeholder: 'Discuss the case' },
    { name: 'highLevelSummary', label: 'Case Summary', type: 'richtext', placeholder: 'Summarize the case' },
    { name: 'references', label: 'References', type: 'richtext', placeholder: 'List references' },
    { name: 'mediaUrls', label: 'Upload Media', type: 'media' },
  ];

  // Load draft from localStorage
  useEffect(() => {
    if (user && user.uid) {
      const draftKey = `draft_case_${user.uid}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const { formData: savedFormData, currentStep: savedStep, draftTimestamp } = JSON.parse(savedDraft);
          const draftAge = Date.now() - draftTimestamp;
          const maxDraftAge = 7 * 24 * 60 * 60 * 1000; // 7 days
          if (draftAge < maxDraftAge) {
            setFormData(savedFormData);
            setCurrentStep(savedStep || 0);
            console.log('Loaded draft from localStorage:', { draftKey, title: savedFormData.title, draftAge });
          } else {
            localStorage.removeItem(draftKey);
            console.log('Cleared expired draft from localStorage:', { draftKey });
          }
        } catch (err) {
          console.error('Error loading draft:', err);
        }
      }
    }
  }, [user]);

  // Save form data to localStorage on change
  useEffect(() => {
    if (user && user.uid) {
      const draftKey = `draft_case_${user.uid}`;
      localStorage.setItem(draftKey, JSON.stringify({ 
        formData, 
        currentStep, 
        draftTimestamp: Date.now() 
      }));
      console.log('Saved draft to localStorage:', { draftKey, title: formData.title, currentStep });
    }
  }, [formData, currentStep, user]);

  // Cloudinary widget setup
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
              clientAllowedFormats: ['jpg', 'png', 'jpeg'],
              maxFileSize: 10000000,
              public_id: `case_${uuidv4()}`,
              buttonClass: 'cloudinary-button',
            },
            (error, result) => {
              if (result && result.event === 'upload-added') {
                setIsUploading(true);
                if (window.gtag) {
                  window.gtag('event', 'media_upload_started', {
                    event_category: 'CaseForm',
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
                    event_category: 'CaseForm',
                    event_label: 'Media Upload Completed',
                    value: result.info.secure_url,
                  });
                }
              } else if (error) {
                setError('Image upload failed. Please try again.');
                setIsUploading(false);
                if (window.gtag) {
                  window.gtag('event', 'media_upload_failed', {
                    event_category: 'CaseForm',
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

  // Google Analytics page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Case Form',
        page_location: window.location.href,
        page_path: router.asPath,
      });
    }
  }, [router.asPath]);

  const handleChange = (value, name) => {
    if (name === 'specialty') {
      const selectedOptions = Array.from(value.target.selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, specialty: selectedOptions }));
      if (window.gtag) {
        window.gtag('event', 'specialty_selected', {
          event_category: 'CaseForm',
          event_label: 'Specialty Selection',
          value: selectedOptions.join(', '),
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (window.gtag) {
        window.gtag('event', 'form_field_updated', {
          event_category: 'CaseForm',
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
        event_category: 'CaseForm',
        event_label: 'Media Deleted',
        value: deletedUrl,
      });
    }
  };

  const clearDraft = () => {
    if (user && user.uid) {
      const draftKey = `draft_case_${user.uid}`;
      localStorage.removeItem(draftKey);
      setFormData({
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
      setCurrentStep(0);
      console.log('Draft cleared manually:', { draftKey });
      if (window.gtag) {
        window.gtag('event', 'draft_cleared', {
          event_category: 'CaseForm',
          event_label: 'Draft Cleared Manually',
        });
      }
    }
  };

  const validateStep = () => {
    const currentField = steps[currentStep].name;
    if (currentField === 'mediaUrls' || currentField === 'specialty') return true;
    const isValid = formData[currentField].trim() !== '';
    if (!isValid && window.gtag) {
      window.gtag('event', 'validation_failed', {
        event_category: 'CaseForm',
        event_label: `Validation Failed: ${currentField}`,
      });
    }
    return isValid;
  };

  const nextStep = (e) => {
    e.preventDefault();
    if (!validateStep()) {
      setError('Please fill out the current step before proceeding.');
      return;
    }
    if (isUploading) {
      setError('Please wait for media upload to complete.');
      if (window.gtag) {
        window.gtag('event', 'navigation_blocked', {
          event_category: 'CaseForm',
          event_label: 'Navigation Blocked: Media Uploading',
        });
      }
      return;
    }
    if (currentStep < steps.length - 1) {
      setError('');
      setCurrentStep(currentStep + 1);
      if (window.gtag) {
        window.gtag('event', 'form_step_next', {
          event_category: 'CaseForm',
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
          event_category: 'CaseForm',
          event_label: `Step ${currentStep - 1}: ${steps[currentStep - 1].label}`,
          value: currentStep,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.uid) {
      setError('You must be logged in to submit a case.');
      if (window.gtag) {
        window.gtag('event', 'submission_failed', {
          event_category: 'CaseForm',
          event_label: 'Submission Failed: Not Logged In',
        });
      }
      return;
    }
    if (currentStep !== steps.length - 1) {
      setError('Please complete all steps before submitting.');
      if (window.gtag) {
        window.gtag('event', 'submission_failed', {
          event_category: 'CaseForm',
          event_label: 'Submission Failed: Incomplete Steps',
        });
      }
      return;
    }
    if (isUploading) {
      setError('Please wait for media upload to complete before submitting.');
      if (window.gtag) {
        window.gtag('event', 'submission_failed', {
          event_category: 'CaseForm',
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
          event_category: 'CaseForm',
          event_label: 'Submission Failed: Missing Required Fields',
        });
      }
      return;
    }
    setError('');
    setIsLoading(true);
    console.log('Submitting case with data:', { userId: user.uid, title: formData.title });
    if (window.gtag) {
      window.gtag('event', 'submission_started', {
        event_category: 'CaseForm',
        event_label: 'Case Submission Started',
      });
    }
    try {
      await auth.currentUser.getIdToken(true);
      console.log('Authentication token refreshed for user:', user.uid);
      const caseData = {
        ...formData,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        thumbnailUrl: formData.mediaUrls[0] || '',
      };
      const caseId = await addCase(caseData);
      console.log('Case submission successful, ID:', caseId);
      localStorage.removeItem(`draft_case_${user.uid}`);
      console.log('Draft cleared from localStorage');
      setLoadStart(Date.now());
      setForceLoading(true);
      if (window.gtag) {
        window.gtag('event', 'submission_success', {
          event_category: 'CaseForm',
          event_label: 'Case Submission Successful',
          value: caseId,
        });
      }
    } catch (err) {
      console.error('Submission error:', { message: err.message, code: err.code });
      if (err.code === 'permission-denied') {
        console.log('Permission-denied error detected, verifying case creation...');
        setTimeout(async () => {
          try {
            const cases = await getCases(user.uid);
            const caseExists = cases.some((c) => c.title === formData.title && c.userId === user.uid);
            if (caseExists) {
              console.log('Case found after verification, clearing draft');
              localStorage.removeItem(`draft_case_${user.uid}`);
              setLoadStart(Date.now());
              setForceLoading(true);
              if (window.gtag) {
                window.gtag('event', 'submission_success', {
                  event_category: 'CaseForm',
                  event_label: 'Case Submission Successful (Delayed)',
                });
              }
            } else {
              console.log('Case not found after verification');
              setError('Failed to submit case: Insufficient permissions.');
              setIsLoading(false);
              if (window.gtag) {
                window.gtag('event', 'submission_failed', {
                  event_category: 'CaseForm',
                  event_label: 'Submission Failed: Permissions',
                  value: err.message,
                });
              }
            }
          } catch (checkErr) {
            console.error('Verification error:', { message: checkErr.message, code: checkErr.code });
            setError('Failed to verify case submission: ' + checkErr.message);
            setIsLoading(false);
            if (window.gtag) {
              window.gtag('event', 'submission_failed', {
                event_category: 'CaseForm',
                event_label: 'Submission Failed: Verification Error',
                value: checkErr.message,
              });
            }
          }
        }, 1500);
      } else {
        setError('Failed to submit case: ' + err.message);
        setIsLoading(false);
        if (window.gtag) {
          window.gtag('event', 'submission_failed', {
            event_category: 'CaseForm',
            event_label: 'Submission Failed: Error',
            value: err.message,
          });
        }
      }
    }
  };

  useEffect(() => {
    if (forceLoading && loadStart) {
      const elapsed = Date.now() - loadStart;
      const remaining = SUBMISSION_LOADING_DURATION - elapsed;
      if (remaining <= 0) {
        console.log('Navigation triggered after submission');
        setForceLoading(false);
        setIsLoading(false);
        router.push('/cases');
      } else {
        const timer = setTimeout(() => {
          console.log('Navigation triggered after timeout');
          setForceLoading(false);
          setIsLoading(false);
          router.push('/cases');
        }, remaining);
        return () => clearTimeout(timer);
      }
    }
  }, [forceLoading, loadStart, router]);

  if (authLoading || isLoading || forceLoading) {
    return <LoadingSkeleton />;
  }
  if (authError) {
    if (window.gtag) {
      window.gtag('event', 'auth_error', {
        event_category: 'CaseForm',
        event_label: 'Authentication Error',
        value: authError,
      });
    }
    return <div>Error: {authError}</div>;
  }
  if (!user) {
    if (window.gtag) {
      window.gtag('event', 'auth_error', {
        event_category: 'CaseForm',
        event_label: 'User Not Logged In',
      });
    }
    return <div>Please log in to submit a case.</div>;
  }

  return (
    <div className={styles.caseFormWrapper}>
      <div className={styles.caseForm} ref={formContainerRef}>
        <FormHeader />
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
          />
          <button
            type="button"
            onClick={clearDraft}
            className={styles.clearDraftButton}
          >
            Clear Draft
          </button>
          <ErrorMessage error={error} />
        </form>
      </div>
    </div>
  );
}