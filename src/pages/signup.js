import Signup from '../components/Auth/Signup';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


export default function SignupPage() {
  return (
    <div className="container">
      <Navbar />
      <Signup />
      <Footer />
    </div>
  );
}
