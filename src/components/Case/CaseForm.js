import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { addCase } from '../../firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import Loading from '../../components/Loading';
import dynamic from 'next/dynamic';
import styles from '../../styles/caseForm.module.css';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

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
      ],
    },
    { name: 'discussion', label: 'Discussion', type: 'richtext', placeholder: 'Discuss the case' },
    { name: 'highLevelSummary', label: 'High-Level Summary', type: 'richtext', placeholder: 'Summarize the case' },
    { name: 'references', label: 'References', type: 'richtext', placeholder: 'List references' },
    { name: 'mediaUrls', label: 'Upload Media', type: 'media' },
  ];

  // Track pageview when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Case Form',
        page_location: window.location.href,
        page_path: router.asPath,
      });
    }
  }, [router.asPath]);

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

  const handleChange = (value, name) => {
    if (name === 'specialty') {
      const selectedOptions = Array.from(value.target.selectedOptions).map((option) => option.value);
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
    if (window.gtag) {
      window.gtag('event', 'submission_started', {
        event_category: 'CaseForm',
        event_label: 'Case Submission Started',
      });
    }
    try {
      const caseData = {
        ...formData,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        thumbnailUrl: formData.mediaUrls[0] || '',
      };
      await addCase(caseData);
      setLoadStart(Date.now());
      setForceLoading(true);
      if (window.gtag) {
        window.gtag('event', 'submission_success', {
          event_category: 'CaseForm',
          event_label: 'Case Submission Successful',
        });
      }
    } catch (err) {
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

  useEffect(() => {
    const scrollToActiveEditor = () => {
      if (formContainerRef.current) {
        const activeItem = formContainerRef.current.querySelector(`.${styles.carouselItem}.active`);
        if (activeItem) {
          const quillEditor = activeItem.querySelector(`.${styles.quillEditor} .ql-editor`);
          if (quillEditor) {
            quillEditor.focus();
            quillEditor.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    };
    scrollToActiveEditor();
  }, [currentStep]);

  if (authLoading || isLoading) return <Loading />;
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
        <h2>Add New Case</h2>
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
              style={{
                display: 'flex',
                width: `${steps.length * 100}%`,
                transition: 'transform 0.3s ease-in-out',
                transform: `translateX(-${currentStep * (100 / steps.length)}%)`,
              }}
            >
              {steps.map((step, index) => (
                <div
                  key={step.name}
                  className={`${styles.carouselItem} ${index === currentStep ? styles.active : ''}`}
                  style={{
                    width: `${100 / steps.length}%`,
                    flexShrink: 0,
                    padding: '0 20px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div className={styles.stepContent}>
                    <label className={styles.fieldLabel}>{step.label}</label>
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
                        {step.options.map((option) => (
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
                          onClick={() => {
                            widgetRef.current?.open();
                            if (window.gtag) {
                              window.gtag('event', 'media_upload_button_clicked', {
                                event_category: 'CaseForm',
                                event_label: 'Upload Media Button Clicked',
                              });
                            }
                          }}
                          disabled={!widgetRef.current || isUploading}
                          className={styles.uploadButton}
                        >
                          {isUploading ? 'Uploading...' : 'Upload Media'}
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
                                    disabled={isUploading}
                                    className={styles.deleteButton}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 24 24"
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
                </div>
              ))}
            </div>
          </div>
          <div className={styles.navigation}>
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0 || isUploading}
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
                disabled={isUploading}
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
              <button
                type="submit"
                disabled={isLoading || isUploading}
                className={styles.submitButton}
              >
                Submit Case
              </button>
            )}
          </div>
          {error && (
            <p role="alert" className={styles.error}>
              {error}
              {window.gtag &&
                window.gtag('event', 'form_error', {
                  event_category: 'CaseForm',
                  event_label: 'Form Error Displayed',
                  value: error,
                })}
            </p>
          )}
          {(isLoading || forceLoading) && <Loading />}
        </form>
      </div>
    </div>
  );
}