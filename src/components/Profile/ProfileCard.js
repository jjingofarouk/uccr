import Link from 'next/link';


export default function ProfileCard({ userData }) {
  return (
    <div className="profile-card">
      <img
        src={userData.photoURL || '/images/doctor-avatar.jpeg'}
        alt="Profile"
        className="profile-image"
      />
      <h3>{userData.displayName}</h3>
      <p>{userData.email}</p>
      <Link href="/profile/edit">Edit Profile</Link>
    </div>
  );
}
