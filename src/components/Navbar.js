import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { logout } from '../firebase/auth';
import styles from '../styles/globals.css';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <Link href="/">Home</Link>
      <Link href="/cases">Cases</Link>
      {user && <Link href="/cases/new">Add Case</Link>}
      {user && <Link href="/profile">Profile</Link>}
      {user && <Link href="/inbox">Inbox</Link>}
      {user ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
}
