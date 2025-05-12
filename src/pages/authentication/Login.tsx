
import { useState } from 'react';
import LoginForm from '@/components/forms/LoginForm';
import PhoneVerificationForm from '@/components/forms/PhoneVerificationForm';
import OTPVerificationForm from '@/components/forms/OTPVerificationForm';
import { cn } from "@/lib/utils";

const Login = () => {
  const [currentStep, setCurrentStep] = useState<'email' | 'otp-email' | 'otp-verify' | 'forgot-password' | 'reset-password'>('email');
  const [email, setEmail] = useState('');
  
  const handleShowPhoneVerification = () => {
    console.log("Navigating to OTP email entry screen");
    setCurrentStep('otp-email');
  };
  
  const handleEmailSubmit = (emailAddress: string) => {
    console.log("OTP sent successfully, navigating to OTP verification screen with email:", emailAddress);
    setEmail(emailAddress);
    setCurrentStep('otp-verify');
  };
  
  const handleBackToEmail = () => {
    setCurrentStep('email');
  };
  
  const handleBackToEmailEntry = () => {
    setCurrentStep('otp-email');
  };

  const handleForgotPassword = () => {
    console.log("Navigating to forgot password screen");
    setCurrentStep('forgot-password');
  };

  const handleResetPassword = (emailAddress: string) => {
    console.log("OTP for password reset sent successfully, navigating to reset password screen with email:", emailAddress);
    setEmail(emailAddress);
    setCurrentStep('reset-password');
  };

  console.log("Current step:", currentStep);

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 'otp-email':
        return (
          <PhoneVerificationForm
            onBack={handleBackToEmail}
            onSubmit={handleEmailSubmit}
          />
        );
      case 'otp-verify':
        return (
          <OTPVerificationForm
            emailAddress={email}
            onBack={handleBackToEmailEntry}
          />
        );
      case 'forgot-password':
        return (
          <PhoneVerificationForm
            title="Forgot Password"
            subTitle="Enter your email address and we'll send you a verification code"
            buttonText="Send Reset Code"
            onBack={handleBackToEmail}
            onSubmit={handleResetPassword}
          />
        );
      case 'reset-password':
        return (
          <OTPVerificationForm
            emailAddress={email}
            onBack={() => setCurrentStep('forgot-password')}
            isResetPassword={true}
          />
        );
      case 'email':
      default:
        return (
          <LoginForm 
            onShowPhoneVerification={handleShowPhoneVerification} 
            onForgotPassword={handleForgotPassword}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-cover bg-center flex-col justify-between text-white p-12" 
           style={{ backgroundImage: "url('/images/travel-background.jpg')" }}>
        {/* Overlay to improve text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-tertiary-900/90 via-tertiary-800/80 to-tertiary-700/70"></div>
        
        <div className="z-10">
          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold">Travel<span className="text-coral-400">Ease</span></h2>
          </div>
          
          <div className="mt-20 mb-48">
            <h1 className="text-5xl font-bold mb-16 font-display">Welcome Back!</h1>
            <p className="text-3xl font-medium mb-8 text-coral-200">Discover Unforgettable Journeys</p>
            <p className="text-xl">Your adventure starts with a single click</p>
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
        <div className="w-full max-w-md">
          {renderCurrentForm()}
        </div>
      </div>
    </div>
  );
};

export default Login;
