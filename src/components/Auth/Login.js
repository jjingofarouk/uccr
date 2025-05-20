import { useState } from 'react';
import { useRouter } from 'next/router';
import { login } from '../../firebase/auth';
import { Mail, Lock, LogIn } from 'lucide-react';
import styles from './login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2>
        <LogIn size={24} />
        Login
      </h2>
      <form onSubmit={handleLogin}>
        <div className={styles.inputWrapper}>
          <Mail className={styles.inputIcon} size={20} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
          />
        </div>
        <button type="submit">Login</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
}