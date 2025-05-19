import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import styles from '../../styles/profileEdit.module.css';

export default function ProfileEdit() {
  const { user, loading } = useAuth(); // Removed refreshProfile if not defined
  const [formData, setFormData] = useState({
    name: '',
    photoUrl: '',
    title: '',
    education: '',
    institution: '',
    specialty: '',
    bio: '',
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
            name: user.displayName || data.displayName || '',
            photoUrl: data.photoURL || user.photoURL || '',
            title: data.title || '',
            education: data.education || '',
            institution: data.institution || '',
            specialty: data.specialty || '',
            bio: data.bio || '',
          });
          console.log('Fetched profile photoURL:', data.photoURL); // Debug
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
                const newUrl = result.info.secure_url;
                setFormData(prev => ({ ...prev, photoUrl: newUrl }));
                console.log('Cloudinary uploaded URL:', newUrl); // Debug
              } else if (error) {
                setError('Image upload failed.');
                console.error('Cloudinary error:', error);
              }
            }
          );
        } else {
          console.error('Cloudinary not initialized');
          setError('Failed to initialize image uploader.');
        }
      };

      script.onerror = () => {
        console.error('Failed to load Cloudinary script');
        setError('Failed to load image uploader.');
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to update your profile.');
      return;
    }
    try {
      const profileData = {
        displayName: formData.name || 'User',
        photoURL: formData.photoUrl || '/images/doctor-avatar.jpeg',
        title: formData.title,
        education: formData.education,
        institution: formData.institution,
        specialty: formData.specialty,
        bio: formData.bio,
        updatedAt: new Date(),
      };
      await setDoc(doc(db, 'profiles', user.uid), profileData, { merge: true });
      console.log('Profile saved with photoURL:', formData.photoUrl); // Debug
      router.push('/profile');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
      console.error('Firestore error:', err);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Please log in to edit your profile.</p>;
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
            name="name"
            placeholder="Full Name *"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className={styles.inputField}
            type="text"
            name="title"
            placeholder="Professional Title (e.g., Dr., Prof.)"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className={styles.section}>
          <h3>Education & Affiliation</h3>
          <textarea
            className={styles.textareaField}
            name="education"
            placeholder="Education (e.g., MBChB, MSc)"
            value={formData.education}
            onChange={handleChange}
          />
          <input
            className={styles.inputField}
            type="text"
            name="institution"
            placeholder="Institution (e.g., Makerere University)"
            value={formData.institution}
            onChange={handleChange}
          />
          <select
            className={styles.selectField}
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
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
            disabled={!widgetRef.current}
          >
            Upload Profile Photo
          </button>
          {formData.photoUrl && (
            <div>
              <p>
                Photo uploaded:{' '}
                <a href={formData.photoUrl} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </p>
              <Image
                src={formData.photoUrl}
                alt="Profile preview"
                width={100}
                height={100}
                className={styles.previewImage}
                onError={(e) => console.error('Preview image error:', formData.photoUrl)} // Debug
              />
            </div>
          )}
        </div>
        <div className={styles.section}>
          <h3>Bio</h3>
          <textarea
            className={`${styles.textareaField} ${styles.bio}`}
            name="bio"
            placeholder="Brief bio (e.g., research interests)"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Save Changes
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}