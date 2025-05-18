import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../firebase/auth';
import { uploadImage } from '../../lib/cloudinary';
import styles from '../../styles/profileEdit.module.css';

export default function ProfileEdit() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to update your profile.');
      return;
    }
    try {
      let photoURL = user?.photoURL;
      if (photo) {
        photoURL = await uploadImage(photo, user.uid, `profiles/${user.uid}`);
      }
      await updateProfile(user, name, photoURL);
      router.push('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
        <button type="submit">Save Changes</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}