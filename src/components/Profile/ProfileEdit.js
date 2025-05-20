import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import Loading from '../../components/Loading';
import styles from '../../styles/profileEdit.module.css';

export default function ProfileEdit() {
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    photoUrl: '',
    title: '',
    education: '',
    institution: '',
    specialty: '',
    bio: '',
    linkedIn: '',
    xProfile: '',
    researchInterests: [],
    certifications: [],
    yearsOfExperience: '',
    professionalAffiliations: [],
    levelOfStudy: '',
    courseOfStudy: '',
    otherResearchInterests: '',
    otherCertifications: '',
    otherProfessionalAffiliations: '',
  });
  const [error, setError] = useState('');
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      const fetchProfile = async () => {
        try {
          const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
          const data = profileDoc.exists() ? profileDoc.data() : {};
          setFormData({
            role: data.role || '',
            name: user.displayName || data.displayName || '',
            photoUrl: data.photoURL || user.photoURL || '',
            title: data.title || '',
            education: data.education || '',
            institution: data.institution || '',
            specialty: data.specialty || '',
            bio: data.bio || '',
            linkedIn: data.linkedIn || '',
            xProfile: data.xProfile || '',
            researchInterests: Array.isArray(data.researchInterests) ? data.researchInterests : [],
            certifications: Array.isArray(data.certifications) ? data.certifications : [],
            yearsOfExperience: data.yearsOfExperience || '',
            professionalAffiliations: Array.isArray(data.professionalAffiliations)
              ? data.professionalAffiliations
              : [],
            levelOfStudy: data.levelOfStudy || '',
            courseOfStudy: data.courseOfStudy || '',
            otherResearchInterests: data.researchInterests?.find((i) => i.startsWith('Other:'))
              ? data.researchInterests.find((i) => i.startsWith('Other:')).replace('Other:', '')
              : '',
            otherCertifications: data.certifications?.find((i) => i.startsWith('Other:'))
              ? data.certifications.find((i) => i.startsWith('Other:')).replace('Other:', '')
              : '',
            otherProfessionalAffiliations: data.professionalAffiliations?.find((i) =>
              i.startsWith('Other:')
            )
              ? data.professionalAffiliations.find((i) => i.startsWith('Other:')).replace('Other:', '')
              : '',
          });
        } catch (err) {
          setError('Failed to load profile.');
          console.error('Profile fetch error:', err);
        }
      };
      fetchProfile();
    }
  }, [user, loading]);

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
              folder: `profiles/${user.uid}`,
              sources: ['local', 'camera'],
              multiple: false,
              resourceType: 'image',
              public_id: `profile_${uuidv4()}`,
            },
            (error, result) => {
              if (!error && result && result.event === 'success') {
                setFormData((prev) => ({ ...prev, photoUrl: result.info.secure_url }));
              } else if (error) {
                setError('Image upload failed.');
                console.error('Cloudinary error:', error);
              }
            }
          );
        } else {
          setError('Failed to initialize image uploader.');
        }
      };

      script.onerror = () => {
        setError('Failed to load image uploader.');
      };

      return () => {
        if (script.parentNode) script.parentNode.removeChild(script);
      };
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (e, field) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setFormData((prev) => ({
      ...prev,
      [field]: selectedOptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to update your profile.');
      return;
    }
    try {
      const profileData = {
        role: formData.role,
        displayName: formData.name || 'User',
        photoURL: formData.photoUrl || '/images/doctor-avatar.jpeg',
        title: formData.title,
        education: formData.education,
        institution: formData.institution,
        specialty: formData.specialty,
        bio: formData.bio,
        linkedIn: formData.linkedIn,
        xProfile: formData.xProfile,
        researchInterests: formData.researchInterests.includes('Other') && formData.otherResearchInterests
          ? [
              ...formData.researchInterests.filter((i) => i !== 'Other'),
              formData.otherResearchInterests ? `Other:${formData.otherResearchInterests}` : null,
            ].filter(Boolean)
          : formData.researchInterests,
        certifications: formData.certifications.includes('Other') && formData.otherCertifications
          ? [
              ...formData.certifications.filter((i) => i !== 'Other'),
              formData.otherCertifications ? `Other:${formData.otherCertifications}` : null,
            ].filter(Boolean)
          : formData.certifications,
        yearsOfExperience: formData.yearsOfExperience,
        professionalAffiliations:
          formData.professionalAffiliations.includes('Other') &&
          formData.otherProfessionalAffiliations
            ? [
                ...formData.professionalAffiliations.filter((i) => i !== 'Other'),
                formData.otherProfessionalAffiliations
                  ? `Other:${formData.otherProfessionalAffiliations}`
                  : null,
              ].filter(Boolean)
            : formData.professionalAffiliations,
        levelOfStudy: formData.role === 'Student' ? formData.levelOfStudy : '',
        courseOfStudy: formData.role === 'Student' ? formData.courseOfStudy : '',
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'profiles', user.uid), profileData, { merge: true });
      router.push('/profile');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
      console.error('Firestore error:', err);
    }
  };

  if (loading) return <Loading />;
  if (!user) return <p>Please log in to edit your profile.</p>;

  return (
    <div className={styles.profileEdit}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h3>Role</h3>
          <label className={styles.label}>Select Role *</label>
          <select
            className={styles.selectField}
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="Doctor">Doctor</option>
            <option value="Student">Student</option>
            <option value="Other Healthcare Professional">Other Healthcare Professional</option>
          </select>
        </div>
        {formData.role === 'Student' && (
          <div className={styles.section}>
            <h3>Student Information</h3>
            <label className={styles.label}>Level of Study</label>
            <select
              className={styles.selectField}
              name="levelOfStudy"
              value={formData.levelOfStudy}
              onChange={handleChange}
            >
              <option value="">Select Level of Study</option>
              <option value="Certificate">Certificate</option>
              <option value="Diploma">Diploma</option>
              <option value="Bachelor’s">Bachelor’s</option>
              <option value="Master’s">Master’s</option>
              <option value="PhD">PhD</option>
              <option value="Postgraduate Diploma">Postgraduate Diploma</option>
              <option value="Other">Other</option>
            </select>
            <label className={styles.label}>Course of Study</label>
            <select
              className={styles.selectField}
              name="courseOfStudy"
              value={formData.courseOfStudy}
              onChange={handleChange}
            >
              <option value="">Select Course of Study</option>
              <option value="Medicine">Medicine</option>
              <option value="Nursing">Nursing</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Laboratory Science">Laboratory Science</option>
              <option value="Public Health">Public Health</option>
              <option value="Biomedical Science">Biomedical Science</option>
              <option value="Midwifery">Midwifery</option>
              <option value="Dentistry">Dentistry</option>
              <option value="Radiology">Radiology</option>
              <option value="Physiotherapy">Physiotherapy</option>
              <option value="Other">Other</option>
            </select>
          </div>
        )}
        <div className={styles.section}>
          <h3>Personal Information</h3>
          <label className={styles.label}>Full Name *</label>
          <input
            className={styles.inputField}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label className={styles.label}>Professional Title</label>
          <input
            className={styles.inputField}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className={styles.section}>
          <h3>Education & Affiliation</h3>
          <label className={styles.label}>Education</label>
          <textarea
            className={styles.textareaField}
            name="education"
            value={formData.education}
            onChange={handleChange}
          />
          <label className={styles.label}>Institution</label>
          <input
            className={styles.inputField}
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
          />
          <label className={styles.label}>Specialty</label>
          <select
            className={styles.selectField}
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
          >
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
        </div>
        <div className={styles.section}>
          <h3>Professional Links</h3>
          <label className={styles.label}>LinkedIn Profile URL</label>
          <input
            className={styles.inputField}
            type="url"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            placeholder="https://www.linkedin.com/in/your-profile"
          />
          <label className={styles.label}>X Profile URL</label>
          <input
            className={styles.inputField}
            type="url"
            name="xProfile"
            value={formData.xProfile}
            onChange={handleChange}
            placeholder="https://x.com/your-handle"
          />
        </div>
        <div className={styles.section}>
          <h3>Research Interests</h3>
          <label className={styles.label}>Select Research Interests (Hold Ctrl/Cmd to select multiple)</label>
          <select
            multiple
            className={styles.selectField}
            name="researchInterests"
            value={formData.researchInterests}
            onChange={(e) => handleMultiSelectChange(e, 'researchInterests')}
          >
            <option value="Cardiovascular Diseases">Cardiovascular Diseases</option>
            <option value="Infectious Diseases">Infectious Diseases</option>
            <option value="Oncology">Oncology</option>
            <option value="Neurology">Neurology</option>
            <option value="Endocrinology">Endocrinology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Mental Health">Mental Health</option>
            <option value="Public Health">Public Health</option>
            <option value="Epidemiology">Epidemiology</option>
            <option value="Tropical Medicine">Tropical Medicine</option>
            <option value="HIV/AIDS">HIV/AIDS</option>
            <option value="Malaria">Malaria</option>
            <option value="Tuberculosis">Tuberculosis</option>
            <option value="Non-Communicable Diseases">Non-Communicable Diseases</option>
            <option value="Surgical Techniques">Surgical Techniques</option>
            <option value="Medical Education">Medical Education</option>
            <option value="Health Systems Research">Health Systems Research</option>
            <option value="Clinical Trials">Clinical Trials</option>
            <option value="Genomics">Genomics</option>
            <option value="Pharmacology">Pharmacology</option>
            <option value="Emergency Medicine">Emergency Medicine</option>
            <option value="Global Health">Global Health</option>
            <option value="Nutrition and Dietetics">Nutrition and Dietetics</option>
            <option value="Reproductive Health">Reproductive Health</option>
            <option value="Maternal and Child Health">Maternal and Child Health</option>
            <option value="Vaccine Development">Vaccine Development</option>
            <option value="Other">Other</option>
          </select>
          {formData.researchInterests.includes('Other') && (
            <textarea
              className={styles.textareaField}
              name="otherResearchInterests"
              value={formData.otherResearchInterests}
              onChange={handleChange}
              placeholder="Specify other research interests"
            />
          )}
        </div>
        <div className={styles.section}>
          <h3>Certifications</h3>
          <label className={styles.label}>Select Certifications (Hold Ctrl/Cmd to select multiple)</label>
          <select
            multiple
            className={styles.selectField}
            name="certifications"
            value={formData.certifications}
            onChange={(e) => handleMultiSelectChange(e, 'certifications')}
          >
            <option value="Board Certified in Internal Medicine">Board Certified in Internal Medicine</option>
            <option value="Board Certified in Surgery">Board Certified in Surgery</option>
            <option value="Board Certified in Pediatrics">Board Certified in Pediatrics</option>
            <option value="Board Certified in Obstetrics and Gynecology">Board Certified in Obstetrics and Gynecology</option>
            <option value="Board Certified in Cardiology">Board Certified in Cardiology</option>
            <option value="Board Certified in Neurology">Board Certified in Neurology</option>
            <option value="Advanced Cardiac Life Support (ACLS)">Advanced Cardiac Life Support (ACLS)</option>
            <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
            <option value="Pediatric Advanced Life Support (PALS)">Pediatric Advanced Life Support (PALS)</option>
            <option value="Neonatal Resuscitation Program (NRP)">Neonatal Resuscitation Program (NRP)</option>
            <option value="Advanced Trauma Life Support (ATLS)">Advanced Trauma Life Support (ATLS)</option>
            <option value="Certified in Tropical Medicine">Certified in Tropical Medicine</option>
            <option value="Good Clinical Practice (GCP)">Good Clinical Practice (GCP)</option>
            <option value="Fellow of the American College of Physicians (FACP)">Fellow of the American College of Physicians (FACP)</option>
            <option value="Fellow of the Royal College of Surgeons (FRCS)">Fellow of the Royal College of Surgeons (FRCS)</option>
            <option value="Certified Professional in Healthcare Quality (CPHQ)">Certified Professional in Healthcare Quality (CPHQ)</option>
            <option value="Emergency Medicine Certification">Emergency Medicine Certification</option>
            <option value="Infectious Disease Specialist">Infectious Disease Specialist</option>
            <option value="Public Health Certification">Public Health Certification</option>
            <option value="Medical Education Certification">Medical Education Certification</option>
            <option value="Ultrasound Certification">Ultrasound Certification</option>
            <option value="HIV/AIDS Management Certification">HIV/AIDS Management Certification</option>
            <option value="Other">Other</option>
          </select>
          {formData.certifications.includes('Other') && (
            <textarea
              className={styles.textareaField}
              name="otherCertifications"
              value={formData.otherCertifications}
              onChange={handleChange}
              placeholder="Specify other certifications"
            />
          )}
        </div>
        <div className={styles.section}>
          <h3>Years of Experience</h3>
          <label className={styles.label}>Select Years of Experience</label>
          <select
            className={styles.selectField}
            name="yearsOfExperience"
            value={formData.yearsOfExperience}
            onChange={handleChange}
          >
            <option value="">Select Years of Experience</option>
            <option value="0-2 years">0-2 years</option>
            <option value="3-5 years">3-5 years</option>
            <option value="6-10 years">6-10 years</option>
            <option value="11-15 years">11-15 years</option>
            <option value="16-20 years">16-20 years</option>
            <option value="21-25 years">21-25 years</option>
            <option value="26-30 years">26-30 years</option>
            <option value="31+ years">31+ years</option>
          </select>
        </div>
        <div className={styles.section}>
          <h3>Professional Affiliations</h3>
          <label className={styles.label}>Select Professional Affiliations (Hold Ctrl/Cmd to select multiple)</label>
          <select
            multiple
            className={styles.selectField}
            name="professionalAffiliations"
            value={formData.professionalAffiliations}
            onChange={(e) => handleMultiSelectChange(e, 'professionalAffiliations')}
          >
            <option value="Uganda Medical Association (UMA)">Uganda Medical Association (UMA)</option>
            <option value="Uganda Nurses and Midwives Union (UNMU)">Uganda Nurses and Midwives Union (UNMU)</option>
            <option value="Association of Surgeons of Uganda (ASOU)">Association of Surgeons of Uganda (ASOU)</option>
            <option value="Uganda Pediatric Association (UPA)">Uganda Pediatric Association (UPA)</option>
            <option value="Uganda Society for Health Scientists (USHS)">Uganda Society for Health Scientists (USHS)</option>
            <option value="American Medical Association (AMA)">American Medical Association (AMA)</option>
            <option value="World Medical Association (WMA)">World Medical Association (WMA)</option>
            <option value="Royal College of Physicians (RCP)">Royal College of Physicians (RCP)</option>
            <option value="Royal College of Surgeons (RCS)">Royal College of Surgeons (RCS)</option>
            <option value="American College of Physicians (ACP)">American College of Physicians (ACP)</option>
            <option value="American Academy of Pediatrics (AAP)">American Academy of Pediatrics (AAP)</option>
            <option value="World Health Organization (WHO) Collaborators">World Health Organization (WHO) Collaborators</option>
            <option value="African Federation for Emergency Medicine (AFEM)">African Federation for Emergency Medicine (AFEM)</option>
            <option value="East African Community Medical Association">East African Community Medical Association</option>
            <option value="British Medical Association (BMA)">British Medical Association (BMA)</option>
            <option value="Canadian Medical Association (CMA)">Canadian Medical Association (CMA)</option>
            <option value="International Federation of Gynecology and Obstetrics (FIGO)">International Federation of Gynecology and Obstetrics (FIGO)</option>
            <option value="International Society of Infectious Diseases (ISID)">International Society of Infectious Diseases (ISID)</option>
            <option value="African Society for Laboratory Medicine (ASLM)">African Society for Laboratory Medicine (ASLM)</option>
            <option value="Medical and Dental Council of Uganda">Medical and Dental Council of Uganda</option>
            <option value="Other">Other</option>
          </select>
          {formData.professionalAffiliations.includes('Other') && (
            <textarea
              className={styles.textareaField}
              name="otherProfessionalAffiliations"
              value={formData.otherProfessionalAffiliations}
              onChange={handleChange}
              placeholder="Specify other professional affiliations"
            />
          )}
        </div>
        <div className={styles.section}>
          <h3>Profile Photo</h3>
          <button
            type="button"
            onClick={() => widgetRef.current?.open()}
            className={styles.uploadButton}
            disabled={!widgetRef.current}
          >
            Upload Photo
          </button>
          {formData.photoUrl && (
            <div className={styles.previewContainer}>
              <Image
                src={formData.photoUrl}
                alt="Profile preview"
                width={80}
                height={80}
                className={styles.previewImage}
                onError={(e) => console.error('Preview image error:', formData.photoUrl)}
              />
            </div>
          )}
        </div>
        <div className={styles.section}>
          <h3>Bio</h3>
          <textarea
            className={styles.textareaField}
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Brief bio (e.g., background, expertise)"
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Save Profile
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}