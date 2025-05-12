
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoleSelectionForm from '@/components/forms/RoleSelectionForm';
import UserSignupForm from '@/components/forms/UserSignupForm';
import TravelAgencySignupForm from '@/components/forms/TravelAgencySignupForm';
import TourGuideSignupForm from '@/components/forms/TourGuideSignupForm';
import OTPVerificationForm from '@/components/forms/OTPVerificationForm';

type SignupProps = {
  role?: 'select' | 'user' | 'agency' | 'guide' | 'verify-otp';
}

const Signup = ({ role = 'select' }: SignupProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailAddressFromState = location.state?.emailAddress;
  const userTypeFromState = location.state?.userType;
  
  const handleBackToSelection = () => {
    navigate('/signup');
  };
  
  const renderForm = () => {
    switch (role) {
      case 'user':
        return <UserSignupForm />;
      case 'agency':
        return <TravelAgencySignupForm />;
      case 'guide':
        return <TourGuideSignupForm />;
      case 'verify-otp':
        return (
          <OTPVerificationForm
            emailAddress={emailAddressFromState || ''}
            onBack={() => window.history.back()}
          />
        );
      case 'select':
      default:
        return <RoleSelectionForm />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container-custom max-w-3xl mx-auto px-4">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-display font-bold text-center mb-6">
              {role === 'select' && 'Choose Your Account Type'}
              {role === 'user' && 'Create User Account'}
              {role === 'agency' && 'Register Travel Agency'}
              {role === 'guide' && 'Register as Tour Guide'}
              {role === 'verify-otp' && 'Verify Your Email'}
            </h1>
            {renderForm()}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
