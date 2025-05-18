import Login from '../components/Auth/Login';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import styles from '../styles/globals.css';

export default function LoginPage() {
  return (
    <div className="container">
      <Navbar />
      <Login />
      <Footer />
    </div>
  );
}
