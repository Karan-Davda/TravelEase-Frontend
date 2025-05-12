
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import RoleSelectionForm from '@/components/forms/RoleSelectionForm';
import UserSignupForm from '@/components/forms/UserSignupForm';
import TravelAgencySignupForm from '@/components/forms/TravelAgencySignupForm';
import TourGuideSignupForm from '@/components/forms/TourGuideSignupForm';
import OTPVerificationForm from '@/components/forms/OTPVerificationForm';

type SignupProps = {
  role?: 'traveler' | 'agency' | 'guide' | 'verify-otp' | 'partner';
}

const Signup = ({ role = 'traveler' }: SignupProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailAddressFromState = location.state?.emailAddress;
  const userTypeFromState = location.state?.userType;
  const [activeTab, setActiveTab] = useState<'agency' | 'guide'>('agency');
  
  const handleBackToSelection = () => {
    navigate('/signup');
  };
  
  const handleShowPartnerSignup = () => {
    navigate('/signup/partner');
  };

  const handleShowTravelerSignup = () => {
    navigate('/signup');
  };

  const renderForm = () => {
    switch (role) {
      case 'traveler':
        return (
          <div>
            <UserSignupForm />
            <div className="mt-4 text-center">
            <span className="text-center text-sm text-gray-600">Want to Sign up as Partner? </span>
              <button 
                onClick={handleShowPartnerSignup} 
                className="text-primary text-sm font-medium hover:underline"
              >
                Sign up
              </button>
            </div>
          </div>
        );
      case 'partner':
        return (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'agency' | 'guide')} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="agency">Travel Agency</TabsTrigger>
              <TabsTrigger value="guide">Tour Guide</TabsTrigger>
            </TabsList>
            <TabsContent value="agency">
              <TravelAgencySignupForm />
              <div className="mt-4 text-center">
              <span className="text-center text-sm text-gray-700">Want to Sign up as traveler? </span>
                <button 
                  onClick={handleShowTravelerSignup} 
                  className="text-sm text-primary hover:underline"
                >
                  Sign up
                </button>
              </div>
            </TabsContent>
            <TabsContent value="guide">
              <TourGuideSignupForm />
              <div className="mt-4 text-center">
              <span className="text-center text-sm text-gray-700">Want to Sign up as traveler? </span>
                <button 
                  onClick={handleShowTravelerSignup} 
                  className="text-sm text-primary hover:underline"> 
                  Sign up
                </button>
              </div>
            </TabsContent>
          </Tabs>
        );
      case 'verify-otp':
        return (
          <OTPVerificationForm
            emailAddress={emailAddressFromState || ''}
            onBack={() => window.history.back()}
          />
        );
      default:
        return <UserSignupForm />;
    }
  };

  const getPageTitle = () => {
    switch (role) {
      case 'traveler':
        return 'Create User Account';
      case 'partner':
        return activeTab === 'agency' ? 'Register Travel Agency' : 'Register as Tour Guide';
      case 'verify-otp':
        return 'Verify Your Account';
      default:
        return 'Sign Up';
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-cover bg-center flex-col justify-between text-white p-12" 
           style={{ backgroundImage: "url('/images/signup-background.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary-900/90 via-tertiary-800/80 to-tertiary-700/70"></div>
        
        <div className="z-10">
          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold">Travel<span className="text-coral-400">Ease</span></h2>
          </div>
          
          <div className="mt-20 mb-32">
            <h1 className="text-5xl font-bold mb-16 font-display">Start Your Journey</h1>
            <p className="text-3xl font-medium mb-8 text-coral-200">Discover Unforgettable Journeys</p>
            {role === 'partner' && (
              <p className="text-xl mt-8 italic">
                "Join our network of partners and grow your business with travelers from around the world."
              </p>
            )}
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-coral-500/30 rounded-full filter blur-xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-24 h-24 bg-tertiary-500/30 rounded-full filter blur-xl"></div>
        <div className="absolute top-[60%] left-[10%] w-20 h-20 bg-teal-500/30 rounded-full filter blur-xl"></div>
        
        <div className="z-10 mt-auto">
          <p className="text-sm opacity-80">www.travelease.com</p>
        </div>
      </div>
      
      {/* Right Side - Form */}
      <div className={cn(
        "w-full lg:w-3/5 flex items-center justify-center p-6 md:p-12",
        "bg-background dark:bg-gray-900"
      )}>
        <div className="w-full max-w-3xl">
          <h1 className="text-2xl font-display font-bold text-center mb-6">
            {getPageTitle()}
          </h1>
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default Signup;
