import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import styles from '../../styles/profileEdit.module.css';

export default function ProfileEdit() {
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [education, setEducation] = useState('');
  const [institution, setInstitution] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setPhotoUrl(user.photoURL || '');
      const fetchProfile = async () => {
        try {
          const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
          if (profileDoc.exists()) {
            const data = profileDoc.data();
            setTitle(data.title || '');
            setEducation(data.education || '');
            setInstitution(data.institution || '');
            setSpecialty(data.specialty || '');
            setBio(data.bio || '');
          }
        } catch (err) {
          setError('Failed to load profile.');
        }
      };
      fetchProfile();
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget(
          {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            folder: `profiles/${user?.uid || 'anonymous'}`,
            sources: ['local', 'camera'],
            multiple: false,
            resourceType: 'image',
            public_id: `profile_${uuidv4()}`,
          },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              setPhotoUrl(result.info.secure_url);
            } else if (error) {
              setError('Image upload failed.');
            }
          }
        );
      };

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to update your profile.');
      return;
    }
    try {
      await updateProfile(user, name, photoUrl);
      await setDoc(
        doc(db, 'profiles', user.uid),
        {
          title,
          education,
          institution,
          specialty,
          bio,
          updatedAt: new Date(),
        },
        { merge: true }
      );
      router.push('/profile');
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.profileEdit}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.section}>
          <h3>Personal Information</h3>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Full Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className={styles.inputField}
            type="text"
            placeholder="Professional Title (e.g., Dr., Prof., Medical Student)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.section}>
          <h3>Education & Affiliation</h3>
          <textarea
            className={styles.textareaField}
            placeholder="Education (e.g., MBChB, MSc, PhD)"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
          />
          <input
            className={styles.inputField}
            type="text"
            placeholder="Institution (e.g., Makerere University, Mulago Hospital)"
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
          />
          <select
            className={styles.selectField}
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
          >
            <option value="">Select Specialty (Optional)</option>
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
          <h3>Profile Photo</h3>
          <button
            type="button"
            onClick={() => widgetRef.current?.open()}
            className={styles.uploadButton}
          >
            Upload Profile Photo
          </button>
          {photoUrl && (
            <p>
              Photo uploaded: <a href={photoUrl} target="_blank" rel="noopener noreferrer">View</a>
            </p>
          )}
        </div>
        <div className={styles.section}>
          <h3>Bio</h3>
          <textarea
            className={`${styles.textareaField} ${styles.bio}`}
            placeholder="Brief bio (e.g., research interests, professional experience)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Save Changes</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}