"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { getCases, updateCase, deleteCase } from '../firebase/firestore';
import { searchCasesAndUsers } from '../firebase/search';
import styles from '../styles/adminDashboard.module.css';
import { Pencil, Trash2, Download, X, Upload } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CaseCard from './Case/CaseCard';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { v4 as uuidv4 } from 'uuid';

function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div className={styles.errorMessage}>
      <p style={{ color: 'red', margin: '10px 0', fontWeight: 'bold' }}>{error}</p>
    </div>
  );
}

function FormHeader({ title }) {
  return <h2 className={styles.formHeader}>{title}</h2>;
}

function ProgressBar({ currentStep, stepsLength }) {
  const progress = ((currentStep + 1) / stepsLength) * 100;
  return (
    <div className={styles.progressBar}>
      <div className={styles.progress} style={{ width: `${progress}%` }}></div>
    </div>
  );
}

function StepContent({
  steps,
  currentStep,
  formData,
  handleChange,
  handleDeleteMedia,
  widgetRef,
  isUploading,
}) {
  const step = steps[currentStep];
  if (step.type === 'richtext') {
    return (
      <div className={styles.stepContent}>
        <label className={styles.label}>{step.label}</label>
        <ReactQuill
          value={formData[step.name]}
          onChange={(value) => handleChange(value, step.name)}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
          }}
          formats={[
            'header',
            'bold', 'italic', 'underline', 'strike',
            'list', 'bullet',
            'link', 'image',
          ]}
          placeholder={step.placeholder}
          className={styles.quillEditor}
        />
      </div>
    );
  } else if (step.type === 'select') {
    return (
      <div className={styles.stepContent}>
        <label className={styles.label}>{step.label}</label>
        <select
          multiple
          value={formData[step.name]}
          onChange={(e) => handleChange(e, step.name)}
          className={styles.select}
        >
          {step.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  } else if (step.type === 'media') {
    return (
      <div className={styles.stepContent}>
        <label className={styles.label}>{step.label}</label>
        <button
          type="button"
          onClick={() => widgetRef.current?.open()}
          className={styles.uploadButton}
          disabled={isUploading}
        >
          <Upload size={20} /> {isUploading ? 'Uploading...' : 'Upload Media'}
        </button>
        {formData.mediaUrls.length > 0 && (
          <div className={styles.mediaPreview}>
            {formData.mediaUrls.map((url, index) => (
              <div key={index} className={styles.mediaItem}>
                <img src={url} alt={`Media ${index + 1}`} className={styles.mediaImage} />
                <button
                  type="button"
                  onClick={() => handleDeleteMedia(index)}
                  className={styles.deleteMediaButton}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  return null;
}

function Navigation({
  currentStep,
  stepsLength,
  isUploading,
  isLoading,
  nextStep,
  prevStep,
  submitText,
}) {
  return (
    <div className={styles.navigation}>
      {currentStep > 0 && (
        <button
          type="button"
          onClick={prevStep}
          className={styles.navButton}
          disabled={isUploading || isLoading}
        >
          Previous
        </button>
      )}
      {currentStep < stepsLength - 1 ? (
        <button
          type="button"
          onClick={nextStep}
          className={styles.navButton}
          disabled={isUploading || isLoading}
        >
          Next
        </button>
      ) : (
        <button
          type="submit"
          className={styles.navButton}
          disabled={isUploading || isLoading}
        >
          {isLoading ? 'Saving...' : submitText}
        </button>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [cases, setCases] = useState([]);
  const [editingCaseId, setEditingCaseId] = useState(null);
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
  const [isUploading, setIsUploading] = useState(false);
  const [filters, setFilters] = useState({
    specialty: '',
    author: '',
    hospital: '',
    referralCenter: '',
    dateRange: '',
    awardsMin: '',
  });
  const [sortBy, setSortBy] = useState('createdAt-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const casesPerPage = 10;
  const ADMIN_PASSWORD = 'SecureAdmin2025';

  const specialties = [...new Set(cases.flatMap((caseData) => caseData.specialty).filter(Boolean))];
  const hospitals = [...new Set(cases.map((caseData) => caseData.hospital).filter(Boolean))];
  const referralCenters = [...new Set(cases.map((caseData) => caseData.referralCenter).filter(Boolean))];

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
    { name: 'highLevelSummary', label: 'Case Summary', type: 'richtext', placeholder: 'Summarize the case' },
    { name: 'references', label: 'References', type: 'richtext', placeholder: 'List references' },
    { name: 'mediaUrls', label: 'Upload Media', type: 'media', placeholder: 'Upload media' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect password');
      setPassword('');
    }
  };

  useEffect(() => {
    const fetchCases = async () => {
      if (!isAuthenticated) return;
      try {
        setIsLoading(true);
        const allCases = await getCases();
        setCases(allCases);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch cases: ' + err.message);
        setIsLoading(false);
      }
    };
    fetchCases();
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Prevent server-side execution
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
            folder: `cases/admin`,
            sources: ['local', 'camera'],
            multiple: true,
            resourceType: 'image',
            clientAllowedFormats: ['jpg', 'png', 'jpeg'],
            maxFileSize: 10000000,
            public_id: `upload_${uuidv4()}`,
          },
          (error, result) => {
            if (result && result.event === 'upload-added') {
              setIsUploading(true);
            }
            if (!error && result && result.event === 'success') {
              setFormData((prev) => ({
                ...prev,
                mediaUrls: [...prev.mediaUrls, result.info.secure_url],
              }));
              setIsUploading(false);
            } else if (error) {
              setError(error.message || 'Image upload failed. Please try again.');
              setIsUploading(false);
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
  }, []);

  const handleEdit = (caseItem) => {
    setEditingCaseId(caseItem.id);
    setFormData({
      title: caseItem.title || '',
      presentingComplaint: caseItem.presentingComplaint || '',
      history: caseItem.history || '',
      physicalExam: caseItem.physicalExam || '',
      investigations: caseItem.investigations || '',
      management: caseItem.management || '',
      provisionalDiagnosis: caseItem.provisionalDiagnosis || '',
      hospital: caseItem.hospital || '',
      referralCenter: caseItem.referralCenter || '',
      specialty: Array.isArray(caseItem.specialty) ? caseItem.specialty : [],
      discussion: caseItem.discussion || '',
      highLevelSummary: caseItem.highLevelSummary || '',
      references: caseItem.references || '',
      mediaUrls: Array.isArray(caseItem.mediaUrls) ? caseItem.mediaUrls : [],
    });
    setCurrentStep(0);
  };

  const handleChange = (value, name) => {
    if (name === 'specialty') {
      const selectedOptions = Array.from(value.target.selectedOptions).map((option) => option.value);
      setFormData((prev) => ({ ...prev, specialty: selectedOptions }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDeleteMedia = (index) => {
    setFormData((prev) => ({
      ...prev,
      mediaUrls: prev.mediaUrls.filter((_, i) => i !== index),
    }));
  };

  const validateStep = () => {
    const currentField = steps[currentStep].name;
    if (currentField === 'mediaUrls' || currentField === 'specialty') return true;
    const text = formData[currentField].replace(/<[^>]+>/g, '').trim();
    return text !== '';
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
    }
  };

  const prevStep = (e) => {
    e.preventDefault();
    if (currentStep > 0) {
      setError('');
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep !== steps.length - 1) {
      setError('Please complete all steps before submitting.');
      return;
    }
    if (isUploading) {
      setError('Please wait for the upload to complete before submitting.');
      return;
    }
    const requiredFields = steps
      .filter((step) => step.type !== 'media' && step.type !== 'select')
      .map((step) => step.name);
    const isValid = requiredFields.every((field) => {
      const text = formData[field].replace(/<[^>]+>/g, '').trim();
      return text !== '';
    });
    if (!isValid) {
      setError('Please fill out all required fields.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const caseData = {
        ...formData,
        thumbnailUrl: formData.mediaUrls[0] || '',
      };
      await updateCase(editingCaseId, caseData);
      setCases(cases.map(c => c.id === editingCaseId ? { ...c, ...caseData } : c));
      setEditingCaseId(null);
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
    } catch (err) {
      setError(`Failed to update case: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseEdit = () => {
    setEditingCaseId(null);
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
    setError('');
  };

  const handleDelete = async (caseId) => {
    if (!confirm('Are you sure you want to delete this case?')) return;
    try {
      setIsLoading(true);
      await deleteCase(caseId);
      setCases(cases.filter(c => c.id !== caseId));
      setError('');
      setIsLoading(false);
    } catch (err) {
      setError('Failed to delete case: ' + err.message);
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm) {
      setFilters((prev) => ({ ...prev, author: '' }));
      const allCases = await getCases();
      setCases(allCases);
      return;
    }
    try {
      const results = await searchCasesAndUsers(searchTerm);
      setCases(results.cases);
      setFilters((prev) => ({ ...prev, author: searchTerm }));
    } catch (err) {
      setError('Failed to search cases: ' + err.message);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Title', 'Specialties', 'Author', 'Hospital', 'Referral Center', 'Awards', 'Created At',
      'Presenting Complaint', 'Provisional Diagnosis'
    ];
    const rows = filteredCases.map((caseData) => [
      `"${caseData.title || ''}"`,
      `"${Array.isArray(caseData.specialty) ? caseData.specialty.join(', ') : caseData.specialty || ''}"`,
      caseData.userName || 'Anonymous',
      caseData.hospital || '',
      caseData.referralCenter || '',
      caseData.awards || 0,
      new Date(caseData.createdAt).toISOString(),
      `"${caseData.presentingComplaint || ''}"`,
      `"${caseData.provisionalDiagnosis || ''}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'admin_cases_export.csv';
    link.click();
  };

  const filteredCases = useMemo(() => {
    return cases.filter((caseData) => {
      const matchesSpecialty = filters.specialty
        ? Array.isArray(caseData.specialty) && caseData.specialty.includes(filters.specialty)
        : true;
      const matchesAuthor = filters.author
        ? caseData.userName.toLowerCase().includes(filters.author.toLowerCase())
        : true;
      const matchesHospital = filters.hospital ? caseData.hospital === filters.hospital : true;
      const matchesReferralCenter = filters.referralCenter
        ? caseData.referralCenter === filters.referralCenter
        : true;
      const matchesDate = filters.dateRange
        ? (() => {
            const now = new Date();
            const caseDate = new Date(caseData.createdAt);
            if (filters.dateRange === 'last7days') {
              return caseDate >= new Date(now.setDate(now.getDate() - 7));
            }
            if (filters.dateRange === 'last30days') {
              return caseDate >= new Date(now.setDate(now.getDate() - 30));
            }
            if (filters.dateRange === 'lastYear') {
              return caseDate >= new Date(now.setFullYear(now.getFullYear() - 1));
            }
            return true;
          })()
        : true;
      const matchesAwards = filters.awardsMin
        ? (caseData.awards || 0) >= parseInt(filters.awardsMin)
        : true;
      return matchesSpecialty && matchesAuthor && matchesHospital && matchesReferralCenter && matchesDate && matchesAwards;
    });
  }, [cases, filters]);

  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      if (sortBy === 'createdAt-desc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'createdAt-asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === 'awards-desc') {
        return (b.awards || 0) - (a.awards || 0);
      }
      if (sortBy === 'awards-asc') {
        return (a.awards || 0) - (a.awards || 0);
      }
      if (sortBy === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'title-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [filteredCases, sortBy]);

  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * casesPerPage;
    return sortedCases.slice(start, start + casesPerPage);
  }, [sortedCases, currentPage]);

  const totalPages = Math.ceil(sortedCases.length / casesPerPage);

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Admin Login</h1>
        <ErrorMessage error={authError} />
        <form onSubmit={handleLogin} className={styles.loginForm}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className={styles.input}
          />
          <button type="submit" className={styles.saveButton}>
            Login
          </button>
        </form>
      </div>
    );
  }

  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className={styles.container}>
          <h1 className={styles.title}>Admin Dashboard - Manage Cases</h1>
          <ErrorMessage error={error} />
          <div className={styles.filterSortContainer}>
            <div className={styles.filters}>
              {[...Array(6)].map((_, index) => (
                <Skeleton key={index} height={40} width={150} />
              ))}
            </div>
            <div className={styles.sortExport}>
              <Skeleton height={40} width={150} />
              <Skeleton height={40} width={100} />
            </div>
          </div>
          <div className={styles.casesList}>
            {[...Array(casesPerPage)].map((_, index) => (
              <CaseCard key={index} isLoading={true} />
            ))}
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard - Manage Cases</h1>
      <ErrorMessage error={error} />
      <div className={styles.filterSortContainer}>
        <div className={styles.filters}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cases..."
              className={styles.filterInput}
              aria-label="Search cases"
            />
            <button type="submit" className={styles.saveButton}>Search</button>
          </form>
          <select
            name="specialty"
            value={filters.specialty}
            onChange={handleFilterChange}
            className={styles.filterSelect}
            aria-label="Filter by specialty"
          >
            <option value="">All Specialties</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>{specialty}</option>
            ))}
          </select>
          <input
            type="text"
            name="author"
            placeholder="Search by author..."
            value={filters.author}
            onChange={handleFilterChange}
            className={styles.filterInput}
            aria-label="Filter by author"
          />
          <select
            name="hospital"
            value={filters.hospital}
            onChange={handleFilterChange}
            className={styles.filterSelect}
            aria-label="Filter by hospital"
          >
            <option value="">All Hospitals</option>
            {hospitals.map((hospital) => (
              <option key={hospital} value={hospital}>{hospital}</option>
            ))}
          </select>
          <select
            name="referralCenter"
            value={filters.referralCenter}
            onChange={handleFilterChange}
            className={styles.filterSelect}
            aria-label="Filter by referral center"
          >
            <option value="">All Referral Centers</option>
            {referralCenters.map((center) => (
              <option key={center} value={center}>{center}</option>
            ))}
          </select>
          <select
            name="dateRange"
            value={filters.dateRange}
            onChange={handleFilterChange}
            className={styles.filterSelect}
            aria-label="Filter by date range"
          >
            <option value="">All Dates</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="lastYear">Last Year</option>
          </select>
          <input
            type="number"
            name="awardsMin"
            placeholder="Min Awards"
            value={filters.awardsMin}
            onChange={handleFilterChange}
            className={styles.filterInput}
            min="0"
            aria-label="Filter by minimum awards"
          />
        </div>
        <div className={styles.sortExport}>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className={styles.sortSelect}
            aria-label="Sort cases"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="awards-desc">Most Awarded</option>
            <option value="awards-asc">Least Awards</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
          </select>
          <button
            onClick={handleExportCSV}
            className={styles.exportButton}
            disabled={sortedCases.length === 0}
            aria-label="Export cases as CSV"
          >
            <Download size={20} /> Export CSV
          </button>
        </div>
      </div>
      <div className={styles.casesList}>
        {sortedCases.length === 0 && <p className={styles.noCases}>No cases found.</p>}
        {paginatedCases.map(caseItem => (
          <div key={caseItem.id} className={styles.caseItem}>
            <CaseCard caseData={caseItem} isLoading={false} />
            <div className={styles.buttonGroup}>
              <button
                onClick={() => handleEdit(caseItem)}
                className={styles.editButton}
              >
                <Pencil size={20} /> Edit
              </button>
              <button
                onClick={() => handleDelete(caseItem.id)}
                className={styles.deleteButton}
              >
                <Trash2 size={20} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
            aria-label="Previous page"
          >
            Previous
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page + 1}
              onClick={() => handlePageChange(page + 1)}
              className={`${styles.pageButton} ${currentPage === page + 1 ? styles.activePage : ''}`}
              aria-label={`Page ${page + 1}`}
              aria-current={currentPage === page + 1 ? 'page' : undefined}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
      {editingCaseId && (
        <div className={styles.editModal}>
          <div className={styles.editModalContent}>
            <button
              onClick={handleCloseEdit}
              className={styles.closeButton}
              aria-label="Close edit form"
            >
              <X size={24} />
            </button>
            <div className={styles.caseFormWrapper}>
              <div className={styles.caseForm}>
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
          </div>
        </div>
      )}
    </div>
  );
}