
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from '@/services/api';
import { saveAuthData } from '@/utils/authUtils';
import { useEffect } from 'react';

// Declare Google type to avoid TypeScript errors
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

type LoginFormProps = {
  isSignUp?: boolean;
  onShowPhoneVerification?: () => void;
  onForgotPassword?: () => void;
}

const LoginForm = ({ isSignUp = false, onShowPhoneVerification, onForgotPassword }: LoginFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [emailPhone, setEmailPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google?.accounts) {
      window.google.accounts.id.initialize({
        client_id: '207725574477-1gfbsq8nfsd1vcf6de1ljd0arrf5iv08.apps.googleusercontent.com', // Replace with your Google client ID
        callback: handleGoogleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      
      // Render Google Sign-In button
      const googleLoginButton = document.getElementById('googleLoginButton');
      if (googleLoginButton) {
        window.google.accounts.id.renderButton(googleLoginButton, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 280,
        });
      }
    }
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      setIsLoading(true);
      // Send the token to your backend
      const authResponse = await authService.googleLogin(response.credential);
      
      // Save token and display success message
      saveAuthData(authResponse);
      
      toast({
        title: "Logged in successfully!",
        description: "Welcome back to TravelEase.",
      });
      
      // Redirect based on the response
      navigate(authResponse.redirectTo);
    } catch (error) {
      toast({
        title: "Google login failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call the backend API using the auth service
      const authResponse = await authService.login(emailPhone, password);
      
      // Save token and user info
      saveAuthData(authResponse);

      // Show success message
      toast({
        title: "Logged in successfully!",
        description: "Welcome back to TravelEase.",
      });

      // Redirect to the path provided by the backend
      navigate(authResponse.redirectTo);
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPLogin = () => {
    if (onShowPhoneVerification) {
      onShowPhoneVerification();
    }
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-200 font-display">Log In</h2>
      <p className="text-muted-foreground mb-8">Welcome back! Please enter your details</p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="emailPhone" className="block text-sm font-medium text-foreground">
            Email / Phone No.
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              id="emailPhone"
              type="text"
              placeholder="Enter Email or Phone No."
              value={emailPhone}
              onChange={(e) => setEmailPhone(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <button 
              type="button" 
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 h-12"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Continue"}
          <ArrowRight className="h-5 w-5" />
        </Button>
        
        <div className="relative flex items-center justify-center text-xs uppercase text-muted-foreground before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-border">
          <span className="relative bg-background dark:bg-gray-900 px-4">or Connect with</span>
        </div>
        
        <div className="space-y-3">
          <div id="googleLoginButton" className="flex justify-center"></div>
          
          <Button
            type="button"
            onClick={handleOTPLogin}
            variant="outline"
            className="w-full border border-input hover:bg-accent text-foreground dark:text-gray-300 dark:hover:bg-gray-800 font-medium h-11"
          >
            Log In with OTP
          </Button>
        </div>
      </form>
      
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <a href="/signup" className="text-primary font-medium hover:underline">
          Sign Up
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
