import Signup from '../components/Auth/Signup';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/globals.css';

export default function SignupPage() {
  return (
    <div className="container">
      <Navbar />
      <Signup />
      <Footer />
    </div>
  );
}
