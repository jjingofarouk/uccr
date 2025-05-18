import Link from 'next/link';


export default function ProfileCard({ userData }) {
  return (
    <div className="profile-card">
      <img
        src={userData.photoURL || '/images/placeholder.png'}
        alt="Profile"
        className="profile-image"
      />
      <h3>{userData.displayName}</h3>
      <p>{userData.email}</p>
      <Link href="/profile/edit">Edit Profile</Link>
    </div>
  );
}
