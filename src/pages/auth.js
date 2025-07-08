// src/pages/auth.js (remove .jsx extension for pages directory)
import dynamic from 'next/dynamic';

// Dynamically import the AuthPage component with SSR disabled
const AuthPage = dynamic(() => import('../components/AuthPage'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

export default function Auth() {
  return <AuthPage />;
}