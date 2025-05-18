import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../firebase/auth';
import { uploadImage } from '../../lib/cloudinary';
import { auth } from '../../firebase/config';

export default function ProfileEdit() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.displayName || '');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let photoURL = user?.photoURL;
      if (photo) {
        photoURL = await uploadImage(photo, `profiles/${user.uid}`);
      }
      await updateProfile(user, name, photoURL);
      router.push('/profile');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="profile-edit">
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
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}