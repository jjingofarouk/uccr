import Login from '../components/Auth/Login';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


export default function LoginPage() {
  return (
    <div className="container">
      <Navbar />
      <Login />
      <Footer />
    </div>
  );
}
