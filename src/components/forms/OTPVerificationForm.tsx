
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";

type OTPVerificationFormProps = {
  emailAddress: string;
  onBack: () => void;
  isResetPassword?: boolean;
}

const OTPVerificationForm = ({ emailAddress, onBack, isResetPassword = false }: OTPVerificationFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeRemaining]);

  // Format time remaining as mm:ss
  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Verifying OTP for email:", emailAddress);
      console.log("OTP entered:", otp);
      // Verify OTP with the backend
      const response = await fetch('http://localhost:3000/api/auth/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: emailAddress,
          otp: otp
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Invalid OTP');
      }

      if (isResetPassword) {
        setOtpVerified(true);
        toast({
          title: "OTP verified!",
          description: "Please set your new password.",
        });
      } else {
        toast({
          title: "Verified successfully!",
          description: "Welcome to TravelEase.",
        });

        // Redirect to dashboard
        navigate('/account');
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call the reset password API
      const response = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: emailAddress,
          otp: otp,
          newPassword: newPassword
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reset password');
      }

      toast({
        title: "Password reset successfully!",
        description: "You can now log in with your new password.",
      });

      // Redirect to login
      navigate('/login');
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "Unable to reset your password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      console.log("Resending OTP to:", emailAddress);
      const response = await fetch('http://localhost:3000/api/auth/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: emailAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      setTimeRemaining(300); // Reset timer to 5 minutes
      
      toast({
        title: "OTP resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      console.error("Error resending OTP:", error);
      toast({
        title: "Failed to resend OTP",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isResetPassword && otpVerified) {
    return (
      <div className="w-full">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0 hover:bg-transparent text-gray-600 hover:text-primary"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 font-display text-center">Reset Your Password</h2>
        
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-foreground">
                New Password
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Resetting Password..." : "Reset Password"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 hover:bg-transparent text-gray-600 hover:text-primary"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 font-display text-center">OTP Verification</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <p className="text-center text-sm text-gray-500">Enter 6-digit OTP sent to {emailAddress}</p>
          
          <div className="flex justify-center">
            <InputOTP 
              maxLength={6} 
              value={otp} 
              onChange={setOtp}
              pattern="^[0-9]+$"
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <div className="text-center mt-2">
            <p className="text-sm text-primary mb-2">Time remaining: {formatTime()}</p>
            <button 
              type="button"
              onClick={handleResend}
              disabled={timeRemaining > 0}
              className={`text-sm ${timeRemaining > 0 ? 'text-gray-400' : 'text-primary hover:underline'}`}
            >
              {timeRemaining > 0 ? "Resend OTP after timeout" : "Resend OTP"}
            </button>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </form>
    </div>
  );
};

export default OTPVerificationForm;
