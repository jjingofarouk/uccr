import { useState } from 'react';
import { useRouter } from 'next/router';
import { signup } from '../../firebase/auth';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import styles from './signup.module.css';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(email, password, name);
      router.push('/profile/edit');
    } catch (err) {
      console.error('Signup error in component:', err);
      setError(err.message || 'Failed to sign up. Please try again.');
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>
        <User size={24} />
        Sign Up
      </h2>
      <form onSubmit={handleSignup}>
        <div className={styles.inputWrapper}>
          <User className={styles.inputIcon} size={20} />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-label="Full Name"
          />
        </div>
        <div className={styles.inputWrapper}>
          <Mail className={styles.inputIcon} size={20} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email"
          />
        </div>
        <div className={styles.inputWrapper}>
          <Lock className={styles.inputIcon} size={20} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Password"
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Sign Up
        </button>
        {error && (
          <div className={styles.error}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}