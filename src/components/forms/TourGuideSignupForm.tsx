
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";

// Step type
type Step = 'personal' | 'specialization' | 'cities';

type TourGuideSignupFormProps = {
  onBack?: () => void;
};

const TourGuideSignupForm = ({ onBack }: TourGuideSignupFormProps) => {
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
  const [isEmailConsent, setIsEmailConsent] = useState(false);
  const [isSMSConsent, setIsSMSConsent] = useState(false);
  
  // Specialization details
  const [languageSpoken, setLanguageSpoken] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [yearsExperience, setYearsExperience] = useState<number>(0);
  
  // City selection
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const availableCities = [
    { id: 1, name: "New York" },
    { id: 2, name: "Los Angeles" },
    { id: 3, name: "Chicago" },
    { id: 4, name: "Miami" },
    { id: 5, name: "San Francisco" },
    { id: 6, name: "Las Vegas" },
  ];

  // Form validation
  const isPersonalFormValid = () => {
    return firstName && lastName && email && mobile && password && confirmPassword && dateOfBirth && address && password === confirmPassword;
  };
  
  const isSpecializationFormValid = () => {
    return languageSpoken && specialization && yearsExperience > 0;
  };
  
  const isCitiesFormValid = () => {
    return selectedCities.length > 0;
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
      
      setCurrentStep('specialization');
    } else if (currentStep === 'specialization') {
      if (!isSpecializationFormValid()) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      setCurrentStep('cities');
    } else if (currentStep === 'cities') {
      if (!isCitiesFormValid()) {
        toast({
          title: "Missing information",
          description: "Please select at least one city.",
          variant: "destructive",
        });
        return;
      }
      
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (currentStep === 'specialization') {
      setCurrentStep('personal');
    } else if (currentStep === 'cities') {
      setCurrentStep('specialization');
    }
  };
  
  const toggleCitySelection = (cityId: number) => {
    if (selectedCities.includes(cityId)) {
      setSelectedCities(selectedCities.filter(id => id !== cityId));
    } else {
      setSelectedCities([...selectedCities, cityId]);
    }
  };
  
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
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
        guideDetails: {
          languageSpoken,
          specialization,
          yearsOfExperience: yearsExperience,
          cityIds: selectedCities
        }
      };

      const response = await fetch('http://localhost:3000/api/auth/signup/guide', {
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
        title: "Guide account created!",
        description: "Your tour guide profile has been registered successfully.",
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
    const steps = ['personal', 'specialization', 'cities'];
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
              <p className="text-sm text-gray-500">Tell us about yourself</p>
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
                Address <span className="text-red-500">*</span>
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
        
        {currentStep === 'specialization' && (
          <div className="space-y-4">
            <Card className="p-4 border-l-4 border-l-primary bg-gray-50">
              <h4 className="font-medium mb-1">Skills & Qualifications</h4>
              <p className="text-sm text-gray-500">Your expertise as a tour guide</p>
            </Card>
            
            <div className="space-y-2">
              <label htmlFor="languageSpoken" className="block text-sm font-medium text-gray-700">
                Languages Spoken <span className="text-red-500">*</span>
              </label>
              <Input
                id="languageSpoken"
                type="text"
                placeholder="E.g. English, Spanish, French"
                value={languageSpoken}
                onChange={(e) => setLanguageSpoken(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                Areas of Specialization <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="specialization"
                placeholder="Cultural tours, adventure tours, etc."
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
                className="min-h-24"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <RadioGroup 
                id="yearsExperience"
                value={yearsExperience.toString()}
                onValueChange={(value) => setYearsExperience(parseInt(value))}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="exp-0-2" />
                  <Label htmlFor="exp-0-2">0-2 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="exp-3-5" />
                  <Label htmlFor="exp-3-5">3-5 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6" id="exp-6-10" />
                  <Label htmlFor="exp-6-10">6-10 years</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10" id="exp-10+" />
                  <Label htmlFor="exp-10+">10+ years</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}
        
        {currentStep === 'cities' && (
          <div className="space-y-4">
            <Card className="p-4 border-l-4 border-l-primary bg-gray-50">
              <h4 className="font-medium mb-1">Cities You Operate In</h4>
              <p className="text-sm text-gray-500">Select all cities where you offer guide services <span className="text-red-500">*</span></p>
            </Card>
            
            <div className="grid grid-cols-2 gap-y-2">
              {availableCities.map((city) => (
                <div key={city.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`city-${city.id}`}
                    checked={selectedCities.includes(city.id)}
                    onCheckedChange={() => toggleCitySelection(city.id)}
                  />
                  <Label htmlFor={`city-${city.id}`}>{city.name}</Label>
                </div>
              ))}
            </div>
            
            {selectedCities.length === 0 && (
              <p className="text-sm text-amber-600">Please select at least one city where you operate</p>
            )}
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
          className={`${currentStep === 'personal' ? 'w-full' : ''}`}
          onClick={handleNext}
          disabled={isLoading || 
            (currentStep === 'personal' && !isPersonalFormValid()) || 
            (currentStep === 'specialization' && !isSpecializationFormValid()) ||
            (currentStep === 'cities' && selectedCities.length === 0)}
        >
          {isLoading && currentStep === 'cities' ? "Creating account..." : 
            currentStep === 'cities' ? "Sign Up" : "Continue"}
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

export default TourGuideSignupForm;
