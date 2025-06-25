import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getCases, updateCase, deleteCase } from '../firebase/firestore';
import styles from '../styles/adminDashboard.module.css';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ErrorMessage({ error }) {
  if (!error) return null;
  return (
    <div className={styles.errorMessage}>
      <p style={{ color: 'red', margin: '10px 0', fontWeight: 'bold' }}>{error}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [cases, setCases] = useState([]);
  const [editingCaseId, setEditingCaseId] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const specialties = [
    'Adolescent Medicine', 'Allergy and Immunology', 'Anesthesiology', 'Aviation Medicine', 'Bacteriology',
    'Biomedical Engineering', 'Biostatistics', 'Cardiology', 'Cardiothoracic Surgery', 'Chemical Pathology',
    'Child and Adolescent Psychiatry', 'Clinical Chemistry', 'Clinical Epidemiology', 'Clinical Pharmacology',
    'Clinical Psychology', 'Clinical Trials', 'Community Medicine', 'Cytopathology', 'Dermatology',
    'Developmental Pediatrics', 'Disaster Medicine', 'Ear, Nose and Throat (ENT)', 'Emergency Medicine',
    'Endocrinology', 'Epidemiology', 'Family Medicine', 'Forensic Medicine', 'Gastroenterology',
    'General Practice', 'Genitourinary Medicine', 'Geriatrics', 'Health Economics', 'Health Informatics',
    'Health Policy and Management', 'Hematology', 'Histopathology', 'Hyperbaric Medicine', 'Immunopathology',
    'Infectious Diseases', 'Internal Medicine', 'Marine Medicine', 'Maxillofacial Surgery', 'Medical Administration',
    'Medical Anthropology', 'Medical Education', 'Medical Ethics', 'Medical Genetics', 'Medical Imaging',
    'Medical Microbiology', 'Medical Oncology', 'Medical Toxicology', 'Neonatology', 'Nephrology',
    'Neurology', 'Neurosurgery', 'Nuclear Medicine', 'Obstetrics and Gynecology', 'Occupational Medicine',
    'Ophthalmology', 'Orthopedic Surgery', 'Pain Medicine', 'Palliative Care', 'Parasitology', 'Pathology',
    'Pediatrics', 'Plastic Surgery', 'Psychiatry', 'Public Health', 'Pulmonology', 'Radiation Oncology',
    'Radiology', 'Rehabilitation Medicine', 'Rheumatology', 'Sleep Medicine', 'Sports Medicine', 'Surgery',
    'Telemedicine', 'Tropical Medicine', 'Urology', 'Vascular Surgery', 'Virology'
  ];

  useEffect(() => {
    const fetchCases = async () => {
      if (!user) return;
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
  }, [user]);

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
      userId: caseItem.userId,
      userName: caseItem.userName || 'Anonymous',
      photoURL: caseItem.photoURL || '',
      thumbnailUrl: caseItem.thumbnailUrl || '',
    });
  };

  const handleChange = (e, field) => {
    if (field === 'specialty') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(opt => opt.value);
      setFormData(prev => ({ ...prev, specialty: selectedOptions }));
    } else {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    }
  };

  const handleSave = async (caseId) => {
    try {
      setIsLoading(true);
      await updateCase(caseId, formData);
      const updatedCases = cases.map(c => c.id === caseId ? { ...c, ...formData } : c);
      setCases(updatedCases);
      setEditingCaseId(null);
      setError('');
      setIsLoading(false);
    } catch (err) {
      setError('Failed to update case: ' + err.message);
      setIsLoading(false);
    }
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

  const handleCancel = () => {
    setEditingCaseId(null);
    setError('');
  };

  if (authLoading || isLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className={styles.container}>
          <Skeleton height={40} width={300} style={{ marginBottom: '20px' }} />
          <ErrorMessage error={error} />
          <div className={styles.casesList}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className={styles.caseItem}>
                <Skeleton height={30} width="80%" style={{ marginBottom: '10px' }} />
                <Skeleton count={5} height={20} />
                <Skeleton height={100} style={{ marginTop: '10px' }} />
                <Skeleton height={40} width={100} style={{ marginTop: '10px' }} />
              </div>
            ))}
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (!user) return <div>Please log in to access the admin dashboard.</div>;
  if (!user.isAdmin) return <div>Access denied. Admin privileges required.</div>;

  return (
    <div class Adopted from: styles.container}>
      <h1 className={styles.title}>Admin Dashboard - Manage Cases</h1>
      <ErrorMessage error={error} />
      <div className={styles.casesList}>
        {cases.length === 0 && <p className={styles.noCases}>No cases found.</p>}
        {cases.map(caseItem => (
          <div key={caseItem.id} className={styles.caseItem}>
            {editingCaseId === caseItem.id ? (
              <div className={styles.editForm}>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange(e, 'title')}
                  placeholder="Case Title"
                  className={styles.input}
                />
                <textarea
                  value={formData.presentingComplaint}
                  onChange={(e) => handleChange(e, 'presentingComplaint')}
                  placeholder="Presenting Complaint"
                  className={styles.textarea}
                />
                <textarea
                  value={formData.history}
                  onChange={(e) => handleChange(e, 'history')}
                  placeholder="History"
                  className={styles.textarea}
                />
                <textarea
                  value={formData.physicalExam}
                  onChange={(e) => handleChange(e, 'physicalExam')}
                  placeholder="Physical Examination"
                  className={styles.textarea}
                />
                <textarea
                  value={formData.investigations}
                  onChange={(e) => handleChange(e, 'investigations')}
                  placeholder="Investigations"
                  className={styles.textarea}
                />
                <textarea
                  value={formData.management}
                  onChange={(e) => handleChange(e, 'management')}
                  placeholder="Management"
                  className={styles.textarea}
                />
                <textarea
                  value={formData.provisionalDiagnosis}
                  onChange={(e) => handleChange(e, 'provisionalDiagnosis')}
                  placeholder="Provisional Diagnosis"
                  className={styles.textarea}
                />
                <input
                  type="text"
                  value={formData.hospital}
                  onChange={(e) => handleChange(e, 'hospital')}
                  placeholder="Hospital"
                  className={styles.input}
                />
                <input
                  type="text"
                  value={formData.referralCenter}
                  onChange={(e) => handleChange(e, 'referralCenter')}
                  placeholder="Referral Center"
                  className={styles.input}
                />
                <select
                  multiple
                  value={formData.specialty}
                  onChange={(e) => handleChange(e, 'specialty')}
                  className={styles.select}
                >
                  {specialties.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <textarea
                  value={formData.discussion}
                  onChange={(e) => handleChange(e, 'discussion')}
                  placeholder="Discussion"
                  className={styles.textarea}
                />
                <textarea
                  value={formData.highLevelSummary}
                  onChange={(e) => handleChange(e, 'highLevelSummary')}
                  placeholder="Case Summary"
                  className={styles.textarea}
                />
                <textarea
                  value={formData.references}
                  onChange={(e) => handleChange(e, 'references')}
                  placeholder="References"
                  className={styles.textarea}
                />
                <div className={styles.mediaPreview}>
                  {formData.mediaUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Media ${index + 1}`} className={styles.mediaImage} />
                  ))}
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    onClick={() => handleSave(caseItem.id)}
                    className={styles.saveButton}
                  >
                    <Save size={20} /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className={styles.cancelButton}
                  >
                    <X size={20} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.caseDetails}>
                <h2 className={styles.caseTitle}>{caseItem.title}</h2>
                <p><strong>User:</strong> {caseItem.userName}</p>
                <p><strong>Specialty:</strong> {caseItem.specialty.join(', ')}</p>
                <p><strong>Presenting Complaint:</strong> {caseItem.presentingComplaint}</p>
                <p><strong>History:</strong> {caseItem.history}</p>
                <p><strong>Physical Exam:</strong> {caseItem.physicalExam}</p>
                <p><strong>Investigations:</strong> {caseItem.investigations}</p>
                <p><strong>Management:</strong> {caseItem.management}</p>
                <p><strong>Provisional Diagnosis:</strong> {caseItem.provisionalDiagnosis}</p>
                <p><strong>Hospital:</strong> {caseItem.hospital}</p>
                <p><strong>Referral Center:</strong> {caseItem.referralCenter}</p>
                <p><strong>Discussion:</strong> {caseItem.discussion}</p>
                <p><strong>Summary:</strong> {caseItem.highLevelSummary}</p>
                <p><strong>References:</strong> {caseItem.references}</p>
                <div className={styles.mediaPreview}>
                  {caseItem.mediaUrls.map((url, index) => (
                    <img key={index} src={url} alt={`Media ${index + 1}`} className={styles.mediaImage} />
                  ))}
                </div>
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
            )}
          </div>
        ))}
      </div>
    </div>
  );
}