// src/pages/auth.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { login, signup } from '../firebase/auth';
import { Stethoscope, Mail, Lock, User, AlertCircle, LogIn } from 'lucide-react';
import Loading from '../components/Loading';
import styles from './AuthPage.module.css';
import Link from 'next/link';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadStart, setLoadStart] = useState(null);
  const [forceLoading, setForceLoading] = useState(false);
  const router = useRouter();
  const LOGIN_LOADING_DURATION = 3000; // 3 seconds for post-login loading

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        setLoadStart(Date.now());
        setForceLoading(true);
      } else {
        await signup(email, password, name);
        router.push('/profile/edit');
      }
    } catch (err) {
      console.error(`${isLogin ? 'Login' : 'Signup'} error:`, err);
      setError(err.message || `Failed to ${isLogin ? 'log in' : 'sign up'}. Please try again.`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (forceLoading && loadStart) {
      const elapsed = Date.now() - loadStart;
      const remaining = LOGIN_LOADING_DURATION - elapsed;
      if (remaining <= 0) {
        setForceLoading(false);
        setIsLoading(false);
        router.push('/');
      } else {
        const timer = setTimeout(() => {
          setForceLoading(false);
          setIsLoading(false);
          router.push('/');
        }, remaining);
        return () => clearTimeout(timer);
      }
    }
  }, [forceLoading, loadStart, router]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <Stethoscope className={styles.stethoscope} size={48} color="#10b981" />
          <h1 className={styles.title}>
            {isLogin ? 'Welcome Back' : 'Welcome to Uganda Clinical Case Reports'}
          </h1>
          <p className={styles.subtitle}>
            {isLogin
              ? 'Log in to access your case reports'
              : 'Sign up to share and explore medical case studies'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputWrapper}>
              <User className={styles.inputIcon} size={20} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                aria-label="Full Name"
                className={styles.input}
              />
            </div>
          )}
          <div className={styles.inputWrapper}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email"
              className={styles.input}
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
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            {isLogin ? (
              <>
                <LogIn size={20} className={styles.buttonIcon} />
                Log In
              </>
            ) : (
              <>
                <User size={20} className={styles.buttonIcon} />
                Sign Up
              </>
            )}
          </button>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </form>
        <p className={styles.toggleText}>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" onClick={toggleMode} className={styles.toggleButton}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
        <Link href="/forgot-password" className={styles.forgotPassword}>
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}