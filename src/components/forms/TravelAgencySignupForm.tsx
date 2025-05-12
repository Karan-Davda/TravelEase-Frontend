
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, EyeOff, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// Step type
type Step = 'personal' | 'agency' | 'contact';

type TravelAgencySignupFormProps = {
  onBack?: () => void;
};

const TravelAgencySignupForm = ({ onBack }: TravelAgencySignupFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  
  // Personal details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  
  // Agency details
  const [agencyName, setAgencyName] = useState('');
  const [businessLicenseNo, setBusinessLicenseNo] = useState('');
  const [agencyAddress, setAgencyAddress] = useState('');
  const [taxIdentificationNo, setTaxIdentificationNo] = useState('');
  const [contactDesignation, setContactDesignation] = useState('');
  
  // Contact details
  const [agencyEmail, setAgencyEmail] = useState('');
  const [agencyPhone, setAgencyPhone] = useState('');
  const [isEmailConsent, setIsEmailConsent] = useState(false);
  const [isSMSConsent, setIsSMSConsent] = useState(false);
  const [logoImg, setLogoImg] = useState<File | null>(null);
  const [taxDocument, setTaxDocument] = useState<File | null>(null);
  const [licenseDocument, setLicenseDocument] = useState<File | null>(null);
  
  // Form validation
  const isPersonalFormValid = () => {
    return firstName && lastName && email && mobile && password && confirmPassword && dateOfBirth && address && password === confirmPassword;
  };
  
  const isAgencyFormValid = () => {
    return agencyName && businessLicenseNo && agencyAddress && taxIdentificationNo && contactDesignation;
  };
  
  const isContactFormValid = () => {
    return agencyEmail && agencyPhone;
  };
  
  const handleNext = () => {
    if (currentStep === 'personal') {
      // Validate passwords match
      if (password !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          description: "Please make sure your passwords match.",
          variant: "destructive",
        });
        return;
      }
      
      if (!isPersonalFormValid()) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      setCurrentStep('agency');
    } else if (currentStep === 'agency') {
      if (!isAgencyFormValid()) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      setCurrentStep('contact');
    } else if (currentStep === 'contact') {
      if (!isContactFormValid()) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentStep === 'agency') {
      setCurrentStep('personal');
    } else if (currentStep === 'contact') {
      setCurrentStep('agency');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    } else {
      setter(null);
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Upload logic for files if needed
      let logoImgPath = '';
      let taxDocPath = '';
      let licenseDocPath = '';
      
      // For demo purposes, we'll just use placeholders
      // In a real app, you'd upload these files to a server and get back URLs
      if (logoImg) logoImgPath = 'https://example.com/uploads/logo.png';
      if (taxDocument) taxDocPath = 'https://example.com/uploads/tax.pdf';
      if (licenseDocument) licenseDocPath = 'https://example.com/uploads/license.pdf';
      
      const requestBody = {
        firstName,
        lastName,
        email,
        mobile,
        password,
        confirmPassword,
        dateOfBirth,
        address,
        consent: {
          isEmail: isEmailConsent,
          isSMS: isSMSConsent
        },
        agencyDetails: {
          agencyName,
          businessLicenseNo,
          agencyAddress,
          taxIdentificationNo,
          contactDesignation,
          agencyEmail,
          agencyPhone,
          logoImgPath,
          taxDocument: taxDocPath,
          licenseDocument: licenseDocPath
        }
      };

      const response = await fetch('http://localhost:3000/api/auth/signup/agency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      toast({
        title: "Agency account created!",
        description: "Your travel agency has been registered successfully.",
      });

      // Navigate to login
      navigate('/login');
    } catch (error) {
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "An error occurred during signup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Progress indicator
  const renderProgress = () => {
    const steps = ['personal', 'agency', 'contact'];
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <div className="flex items-center justify-center mb-6">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentIndex ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={`w-12 h-1 ${
                  index < currentIndex ? 'bg-primary' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="w-full">
      {renderProgress()}
      
      <div className="mt-4">
        {currentStep === 'personal' && (
          <div className="space-y-4">
            <Card className="p-4 border-l-4 border-l-primary bg-gray-50">
              <h4 className="font-medium mb-1">Personal Details</h4>
              <p className="text-sm text-gray-500">Information about the agency owner or manager</p>
            </Card>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
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
            
            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="pr-10"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Personal Address <span className="text-red-500">*</span>
              </label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>
        )}
        
        {currentStep === 'agency' && (
          <div className="space-y-4">
            <Card className="p-4 border-l-4 border-l-primary bg-gray-50">
              <h4 className="font-medium mb-1">Agency Details</h4>
              <p className="text-sm text-gray-500">Tell us about your travel agency</p>
            </Card>
            
            <div className="space-y-2">
              <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700">
                Agency Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="agencyName"
                type="text"
                placeholder="Enter your agency name"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="businessLicenseNo" className="block text-sm font-medium text-gray-700">
                Business License Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="businessLicenseNo"
                type="text"
                placeholder="Enter business license number"
                value={businessLicenseNo}
                onChange={(e) => setBusinessLicenseNo(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="agencyAddress" className="block text-sm font-medium text-gray-700">
                Agency Address <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="agencyAddress"
                placeholder="Enter your agency address"
                value={agencyAddress}
                onChange={(e) => setAgencyAddress(e.target.value)}
                required
                className="min-h-24"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="taxIdentificationNo" className="block text-sm font-medium text-gray-700">
                Tax ID / VAT Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="taxIdentificationNo"
                type="text"
                placeholder="Enter tax ID number"
                value={taxIdentificationNo}
                onChange={(e) => setTaxIdentificationNo(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="contactDesignation" className="block text-sm font-medium text-gray-700">
                Your Role / Designation <span className="text-red-500">*</span>
              </label>
              <Input
                id="contactDesignation"
                type="text"
                placeholder="E.g. Owner, Manager, CEO"
                value={contactDesignation}
                onChange={(e) => setContactDesignation(e.target.value)}
                required
              />
            </div>
          </div>
        )}
        
        {currentStep === 'contact' && (
          <div className="space-y-4">
            <Card className="p-4 border-l-4 border-l-primary bg-gray-50">
              <h4 className="font-medium mb-1">Contact Information</h4>
              <p className="text-sm text-gray-500">How customers will reach your agency</p>
            </Card>
            
            <div className="space-y-2">
              <label htmlFor="agencyEmail" className="block text-sm font-medium text-gray-700">
                Business Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="agencyEmail"
                type="email"
                placeholder="Enter your business email"
                value={agencyEmail}
                onChange={(e) => setAgencyEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="agencyPhone" className="block text-sm font-medium text-gray-700">
                Business Phone <span className="text-red-500">*</span>
              </label>
              <Input
                id="agencyPhone"
                type="tel"
                placeholder="Enter your business phone"
                value={agencyPhone}
                onChange={(e) => setAgencyPhone(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Agency Logo
              </label>
              <div className="border border-gray-300 rounded-md p-4">
                <div className="flex items-center justify-center space-x-2">
                  <label htmlFor="logoImg" className="flex flex-col items-center space-y-2 cursor-pointer">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500">
                      {logoImg ? logoImg.name : "Upload logo"}
                    </span>
                    <input
                      id="logoImg"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setLogoImg)}
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tax Document
              </label>
              <div className="border border-gray-300 rounded-md p-4">
                <div className="flex items-center justify-center space-x-2">
                  <label htmlFor="taxDocument" className="flex flex-col items-center space-y-2 cursor-pointer">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500">
                      {taxDocument ? taxDocument.name : "Upload tax document"}
                    </span>
                    <input
                      id="taxDocument"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setTaxDocument)}
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                License Document
              </label>
              <div className="border border-gray-300 rounded-md p-4">
                <div className="flex items-center justify-center space-x-2">
                  <label htmlFor="licenseDocument" className="flex flex-col items-center space-y-2 cursor-pointer">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <span className="text-sm text-gray-500">
                      {licenseDocument ? licenseDocument.name : "Upload license document"}
                    </span>
                    <input
                      id="licenseDocument"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, setLicenseDocument)}
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Communication Preferences</h3>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isEmailConsent" 
                  checked={isEmailConsent}
                  onCheckedChange={(checked) => setIsEmailConsent(checked === true)}
                />
                <Label htmlFor="isEmailConsent" className="text-sm text-gray-600">
                  I agree to receive email notifications
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isSMSConsent" 
                  checked={isSMSConsent}
                  onCheckedChange={(checked) => setIsSMSConsent(checked === true)}
                />
                <Label htmlFor="isSMSConsent" className="text-sm text-gray-600">
                  I agree to receive SMS notifications
                </Label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className={`mt-6 ${currentStep !== 'personal' ? 'flex justify-between' : ''}`}>
        {currentStep !== 'personal' && (
          <Button 
            type="button" 
            variant="outline"
            onClick={handleBack}
            disabled={isLoading}
          >
            Previous
          </Button>
        )}
        
        <Button
          type="button"
          className={`${currentStep === 'personal' ? 'w-full' : ''} bg-primary text-white`}
          onClick={handleNext}
          disabled={isLoading || 
            (currentStep === 'personal' && !isPersonalFormValid()) ||
            (currentStep === 'agency' && !isAgencyFormValid()) ||
            (currentStep === 'contact' && !isContactFormValid())}
        >
          {isLoading && currentStep === 'contact' ? "Creating account..." : 
            currentStep === 'contact' ? "Sign Up" : "Continue"}
        </Button>
      </div>
      
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-primary font-medium hover:underline">
          Login
        </a>
      </p>
    </div>
  );
};

export default TravelAgencySignupForm;
