
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TransportOptionsStep from './steps/TransportOptionsStep';
import AccommodationStep from './steps/AccommodationStep';
import CarRentalStep from './steps/CarRentalStep';
import TourGuideStep from './steps/TourGuideStep';
import ExperiencesStep from './steps/ExperiencesStep';
import TripSummaryStep from './steps/TripSummaryStep';
import { cn } from '@/lib/utils';

export type TransportMode = 'flight' | 'train' | 'bus' | 'car';
export type AccommodationType = 'hotel' | 'hostel' | 'airbnb';

export type TripDetails = {
  fromCity: string;
  destination: string;
  startDate?: Date;
  endDate?: Date;
  adults: number;
  children: number;
  transportMode?: TransportMode;
  transportOption?: {
    id: string;
    name: string;
    price: number;
    details: Record<string, any>;
  };
  accommodation?: {
    id: string;
    name: string;
    price: number;
    rating: number;
    amenities: string[];
  };
  rentalCar?: {
    id: string;
    name: string;
    price: number;
    details: Record<string, any>;
  };
  tourGuide?: {
    id: string;
    name: string;
    price: number;
    rating: number;
    languages: string[];
    specialty: string;
  };
  experiences?: Array<{
    id: string;
    name: string;
    price: number;
    details: Record<string, any>;
  }>;
};

const TripBuilderWizard = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [tripDetails, setTripDetails] = useState<TripDetails>({
    fromCity: '',
    destination: '',
    adults: 1,
    children: 0,
    transportMode: 'flight',
  });

  // Initialize from URL state if available
  useEffect(() => {
    if (location.state) {
      const { fromCity, destination, departureDate, returnDate, adults, children } = location.state as any;
      
      setTripDetails(prev => ({
        ...prev,
        fromCity: fromCity || prev.fromCity,
        destination: destination || prev.destination,
        startDate: departureDate ? new Date(departureDate) : prev.startDate,
        endDate: returnDate ? new Date(returnDate) : prev.endDate,
        adults: adults ? parseInt(adults) : prev.adults,
        children: children ? parseInt(children) : prev.children,
      }));
    }
  }, [location.state]);

  // Determine total number of steps (fixed at 5 steps per requirements)
  const getTotalSteps = () => {
    return 5;
  };

  // Check if step is completed to show checkmark
  const isStepCompleted = (step: number) => {
    if (step === 1) return !!tripDetails.transportOption;
    if (step === 2) return !!tripDetails.accommodation;
    if (step === 3 && needsRentalCar()) return !!tripDetails.rentalCar;
    if (step === 3 && !needsRentalCar()) return true; // Skip if not needed
    if (step === 4) return !!tripDetails.tourGuide || skipStep(4);
    return false;
  };

  // Determine if rental car step is needed based on transportation mode
  const needsRentalCar = () => {
    return tripDetails.transportMode === 'flight' || 
           tripDetails.transportMode === 'train' || 
           tripDetails.transportMode === 'bus';
  };

  // Determine if a step should be skipped
  const skipStep = (step: number) => {
    if (step === 3) return !needsRentalCar();
    return false;
  };

  const handleNext = () => {
    if (currentStep < getTotalSteps()) {
      // Skip rental car step if not needed
      if (currentStep === 2 && !needsRentalCar()) {
        setCurrentStep(4); // Skip to tour guide step
      } else {
        setCurrentStep(currentStep + 1);
      }
      window.scrollTo(0, 0); // Scroll to top for better UX
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Handle skipping rental car step when going back
      if (currentStep === 4 && !needsRentalCar()) {
        setCurrentStep(2); // Go back to accommodation step
      } else {
        setCurrentStep(currentStep - 1);
      }
      window.scrollTo(0, 0);
    }
  };

  const updateTripDetails = (updates: Partial<TripDetails>) => {
    setTripDetails(prev => ({ ...prev, ...updates }));
  };

  // Jump to a specific step (for editing from summary)
  const jumpToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo(0, 0);
  };

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TransportOptionsStep 
            transportMode={tripDetails.transportMode || 'flight'}
            startDate={tripDetails.startDate}
            endDate={tripDetails.endDate}
            destination={tripDetails.destination}
            fromCity={tripDetails.fromCity}
            selectedOption={tripDetails.transportOption}
            onUpdate={(option) => updateTripDetails({ transportOption: option })}
            onNext={handleNext}
            onBack={() => {}}
          />
        );
      case 2:
        return (
          <AccommodationStep 
            destination={tripDetails.destination}
            startDate={tripDetails.startDate}
            endDate={tripDetails.endDate}
            travelers={tripDetails.adults + tripDetails.children}
            selectedAccommodation={tripDetails.accommodation}
            onUpdate={(accommodation) => updateTripDetails({ accommodation })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <CarRentalStep
            destination={tripDetails.destination}
            startDate={tripDetails.startDate}
            endDate={tripDetails.endDate}
            selectedRentalCar={tripDetails.rentalCar}
            onUpdate={(rentalCar) => updateTripDetails({ rentalCar })}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleNext}
          />
        );
      case 4:
        return (
          <TourGuideStep 
            destination={tripDetails.destination}
            startDate={tripDetails.startDate}
            endDate={tripDetails.endDate}
            selectedGuide={tripDetails.tourGuide}
            onUpdate={(guide) => updateTripDetails({ tourGuide: guide })}
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleNext}
          />
        );
      case 5:
        return (
          <ExperiencesStep
            destination={tripDetails.destination}
            startDate={tripDetails.startDate}
            endDate={tripDetails.endDate}
            selectedExperiences={tripDetails.experiences}
            onUpdate={(experiences) => updateTripDetails({ experiences })}
            onNext={() => {}}
            onBack={handleBack}
            onSkip={() => {}}
          />
        );
      default:
        return null;
    }
  };

  // Get step titles for the stepper
  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Transportation';
      case 2: return 'Accommodation';
      case 3: return 'Rental Car';
      case 4: return 'Tour Guide';
      case 5: return 'Experiences';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Progress stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm",
                  currentStep === step 
                    ? "bg-primary text-white"
                    : step < currentStep || isStepCompleted(step)
                    ? "bg-green-100 text-green-600 border border-green-200"
                    : "bg-gray-100 text-gray-400 border border-gray-200"
                )}
              >
                {step < currentStep || isStepCompleted(step) ? <Check size={16} /> : step}
              </div>
              <span className="text-xs mt-1 hidden md:inline-block">
                {getStepTitle(step)}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-3">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded"></div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary rounded transition-all duration-300 ease-in-out"
            style={{ width: `${((currentStep - 1) / (getTotalSteps() - 1)) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current step content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-sm text-gray-500 mb-2">
          Step {currentStep} of {getTotalSteps()}
        </div>
        
        {renderStepContent()}
      </div>
    </div>
  );
};

export default TripBuilderWizard;
