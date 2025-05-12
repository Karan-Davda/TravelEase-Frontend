
import { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PhoneVerificationFormProps = {
  onBack: () => void;
  onSubmit: (email: string) => void;
  title?: string;
  subTitle?: string;
  buttonText?: string;
}

const PhoneVerificationForm = ({ 
  onBack, 
  onSubmit,
  title = "Email Verification",
  subTitle = "Enter your email address and we'll send you a verification code",
  buttonText = "Send OTP"
}: PhoneVerificationFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // Call the OTP generation API
      console.log("Sending OTP request to:", "http://localhost:3000/api/auth/otp");
      console.log("Request body:", { identifier: email });
      
      const response = await fetch('http://localhost:3000/api/auth/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identifier: email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send OTP');
      }

      toast({
        title: "OTP Sent Successfully!",
        description: "Please check your email for the verification code.",
      });

      // This is the critical part - calling onSubmit to trigger navigation to OTP verification
      console.log("OTP sent successfully, redirecting to verification form");
      onSubmit(email);
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Unable to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0 hover:bg-transparent text-gray-600 hover:text-primary"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Email Login
      </Button>
      
      <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-200 font-display">{title}</h2>
      <p className="text-muted-foreground mb-8">
        {subTitle}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-2 h-12"
          disabled={isLoading}
        >
          {isLoading ? "Sending verification..." : buttonText}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default PhoneVerificationForm;
