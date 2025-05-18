import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../firebase/auth';
import styles from '../../styles/profileEdit.module.css';

export default function ProfileEdit() {
  const { user, loading } = useAuth();
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [error, setError] = useState('');
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setPhotoUrl(user.photoURL || '');
    }
  }, [user]);

  useEffect(() => {
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
          folder: user ? `profiles/${user.uid}` : 'profiles',
          sources: ['local', 'camera'],
          multiple: false,
          resourceType: 'image',
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            setPhotoUrl(result.info.secure_url);
          } else if (error) {
            setError('Image upload failed: ' + error.message);
          }
        }
      );
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to update your profile.');
      return;
    }
    try {
      await updateProfile(user, name, photoUrl);
      router.push('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.profileEdit}>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => widgetRef.current?.open()}
          className={styles.uploadButton}
        >
          Upload Profile Photo
        </button>
        {photoUrl && <p>Photo uploaded: <a href={photoUrl} target="_blank">View</a></p>}
        <button type="submit">Save Changes</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}