
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasicDetailsStep from './steps/BasicDetailsStep';
import CityItineraryStep from './steps/CityItineraryStep';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { getAuthToken } from '@/utils/authUtils';

// Type definitions
export type PackageBasicDetails = {
  packageName: string;
  description: string;
  maxOccupancy: number;
  isTourGuideNeeded: boolean;
  fromCity: string;
  destinationCities: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  packageImage: File | string | null;
};

export type CityItinerary = {
  fromCity: string;
  toCity: string;
  fromDate: Date; 
  toDate: Date;
  transportType: 'flight' | 'bus' | 'train' | undefined;
  transportId: string;
  accommodationId: string;
  needsTourGuide: boolean;
  experienceIds: string[];
};

// Updated function to get user ID from authentication token
const getUserId = async () => {
  try {
    // Get auth token from local storage
    const token = getAuthToken();
    
    if (!token) {
      console.error('No auth token found');
      return 101; // Default user ID if no token
    }
    
    // Fetch user profile from API
    const response = await fetch('http://localhost:3000/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch user profile:', response.statusText);
      return 101; // Default user ID if API call fails
    }
    
    const profile = await response.json();
    return profile.userId || 101; // Return UserID from profile or default
  } catch (e) {
    console.error('Error getting user ID:', e);
    return 101; // Default user ID on error
  }
};

const PackageCreationWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(1); // Will be 1 + number of destination cities + 1 for return
  const [basicDetails, setBasicDetails] = useState<PackageBasicDetails>({
    packageName: '',
    description: '',
    maxOccupancy: 1,
    isTourGuideNeeded: false,
    fromCity: '',
    destinationCities: [],
    startDate: undefined,
    endDate: undefined,
    packageImage: null
  });
  
  const [cityItineraries, setCityItineraries] = useState<CityItinerary[]>([]);
  const [isTourGuideOptionDisabled, setIsTourGuideOptionDisabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Update total steps whenever destination cities change
  useEffect(() => {
    if (basicDetails.destinationCities.length > 0) {
      // Add 1 for basic details + number of destinations + 1 for return trip
      setTotalSteps(1 + basicDetails.destinationCities.length + 1);
      
      // Initialize city itineraries array with the correct structure
      const initialItineraries: CityItinerary[] = [];
      
      // Add itineraries for each destination
      basicDetails.destinationCities.forEach((city, index) => {
        initialItineraries.push({
          fromCity: index === 0 ? basicDetails.fromCity : basicDetails.destinationCities[index - 1],
          toCity: city,
          fromDate: basicDetails.startDate || new Date(),
          toDate: basicDetails.endDate || new Date(),
          transportType: undefined,
          transportId: '',
          accommodationId: '',
          needsTourGuide: basicDetails.isTourGuideNeeded,
          experienceIds: []
        });
      });
      
      // Add the return journey as the last itinerary
      if (basicDetails.destinationCities.length > 0) {
        // For return journey, both fromDate and toDate should be the same
        const returnDate = basicDetails.endDate || new Date();
        initialItineraries.push({
          fromCity: basicDetails.destinationCities[basicDetails.destinationCities.length - 1],
          toCity: basicDetails.fromCity, // Return to origin
          fromDate: returnDate, // Same as toDate for return journey
          toDate: returnDate,   // Same date for return journey
          transportType: undefined,
          transportId: '',
          accommodationId: '',
          needsTourGuide: basicDetails.isTourGuideNeeded,
          experienceIds: []
        });
      }
      
      setCityItineraries(initialItineraries);
      
      // Set tour guide option disabled state based on basic details
      setIsTourGuideOptionDisabled(!basicDetails.isTourGuideNeeded);
    } else {
      setTotalSteps(1);
      setCityItineraries([]);
    }
  }, [basicDetails.destinationCities, basicDetails.fromCity, basicDetails.isTourGuideNeeded, basicDetails.startDate, basicDetails.endDate]);
  
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Updated: Calculate the total package price including the last return journey
  const calculatePackagePrice = () => {
    let totalPrice = 0;

    // Add up transportation prices
    cityItineraries.forEach(itinerary => {
      // If transportation is selected, add its price
      if (itinerary.transportId) {
        // In a real implementation, we'd fetch price info for each ID
        // For now using placeholders based on the type of transport
        if (itinerary.transportType === 'flight') {
          totalPrice += 300; // Higher price for flights
        } else if (itinerary.transportType === 'train') {
          totalPrice += 150; // Medium price for trains
        } else if (itinerary.transportType === 'bus') {
          totalPrice += 100; // Lower price for buses
        } else {
          totalPrice += 100; // Default price if type is unknown
        }
      }
      
      // Add accommodation price if selected
      if (itinerary.accommodationId) {
        totalPrice += 150; // Placeholder price for accommodation
      }
      
      // Add tour guide cost if needed
      if (itinerary.needsTourGuide) {
        totalPrice += 75; // Placeholder price for tour guide per itinerary
      }
      
      // Add in experience prices
      totalPrice += itinerary.experienceIds.length * 50; // Placeholder price per experience
    });
    
    // Add the package base fee
    totalPrice += 300;
    
    return totalPrice;
  };
  
  // Update the save function to use async/await for the user ID
  const savePackageData = async (status: 'Active' | 'Draft') => {
    setIsSaving(true);
    try {
      // Get the user ID from the authentication token
      const userId = await getUserId();
      
      // Create the package data with the user ID
      const packageData = preparePackageData(status, userId);
      
      // Log the data being sent to the API
      console.log('Saving package data:', packageData);
      
      // Call the API
      const response = await fetch('http://localhost:3000/api/partners/packageCreation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save package: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      toast({
        title: status === 'Active' ? "Package created successfully" : "Package draft saved",
        description: status === 'Active' 
          ? "Your new package has been published." 
          : "Your package draft has been saved."
      });
      
      navigate('/agency-dashboard');
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: "Failed to save package",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Update the preparePackageData function to handle both File and URL string
  const preparePackageData = (status: 'Active' | 'Draft', userId: number) => {
    const currentDate = new Date().toISOString();
    
    // Get the last destination city (the one before the return journey)
    const lastDestinationCity = cityItineraries.length > 1 ? 
      cityItineraries[cityItineraries.length - 2].toCity : 
      basicDetails.fromCity;
    
    // Prepare the PackageTran array
    const packageTran = cityItineraries.map((itinerary, index) => {
      // Determine if it's an accommodation or transportation
      const isAccommodation = !!itinerary.accommodationId;
      const isTransportation = !!itinerary.transportId;

      // For each itinerary step, include the experiences selected
      return {
        AccommodationID: isAccommodation ? parseInt(itinerary.accommodationId) : null,
        TransportationID: isTransportation ? parseInt(itinerary.transportId) : null,
        IsAccommodation: isAccommodation,
        IsTransportation: isTransportation,
        Sequence: index + 1,
        Status: status,
        FromCityName: itinerary.fromCity, // Using city name instead of ID
        ToCityName: itinerary.toCity, // Using city name instead of ID
        IsTourGuideRequired: itinerary.needsTourGuide,
        Created: currentDate,
        Modified: currentDate,
        ModifiedBy: userId,
        FromDate: itinerary.fromDate ? itinerary.fromDate.toISOString() : null,
        ToDate: itinerary.toDate ? itinerary.toDate.toISOString() : null,
        PackageTranWiseExperience: itinerary.experienceIds.map(expId => ({
          ExperienceID: parseInt(expId.replace('e', '')) // Assuming IDs like 'e1' convert to 1
        }))
      };
    });
    
    // Handle photo URL based on whether it's a File or string URL
    let photoURL = "";
    
    if (typeof basicDetails.packageImage === 'string') {
      // If it's already a URL string, use it directly
      photoURL = basicDetails.packageImage;
    } else if (basicDetails.packageImage instanceof File) {
      // If it's a File object, create a placeholder URL (the actual file would be uploaded separately)
      // In a real implementation, you would upload the file to a storage service
      photoURL = "uploaded-file-placeholder.jpg";
    } else {
      // Fallback to a default image
      photoURL = "https://example.com/default-package.jpg";
    }
    
    return {
      Package: {
        PackageName: basicDetails.packageName,
        FromCityName: basicDetails.fromCity, // Using city name for origin
        ToCityName: lastDestinationCity, // Using city name for final destination
        Price: calculatePackagePrice(),
        RegistrationCap: basicDetails.maxOccupancy,
        Registered: 0,
        Status: status,
        IsTourGuide: basicDetails.isTourGuideNeeded,
        PhotoURL: photoURL,
        Created: currentDate,
        Modified: currentDate,
        ModifiedBy: userId,
        FromDate: basicDetails.startDate ? basicDetails.startDate.toISOString() : null,
        ToDate: basicDetails.endDate ? basicDetails.endDate.toISOString() : null,
        Description: basicDetails.description // Added description field
      },
      PackageTran: packageTran
    };
  };
  
  const handleFinish = () => {
    savePackageData('Active');
  };
  
  const handleSaveAsDraft = () => {
    savePackageData('Draft');
  };
  
  const updateBasicDetails = (data: Partial<PackageBasicDetails>) => {
    setBasicDetails(prevDetails => ({
      ...prevDetails,
      ...data
    }));
  };
  
  const updateCityItinerary = (index: number, data: Partial<CityItinerary>) => {
    setCityItineraries(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], ...data };
      
      // If this is the last itinerary (return to origin), ensure fromDate and toDate are the same
      if (index === prev.length - 1) {
        if (data.toDate) {
          updated[index].fromDate = data.toDate;
        } else if (data.fromDate) {
          updated[index].toDate = data.fromDate;
        }
      }
      
      return updated;
    });
  };

  const getAllowedDestinations = (stepIndex: number) => {
    // For standard itinerary steps (not last/return)
    if (stepIndex < basicDetails.destinationCities.length) {
      // For the first itinerary step, all destinations are available
      if (stepIndex === 0) {
        return basicDetails.destinationCities;
      } 
      
      // For subsequent steps, only allow the destination specified for this step
      // This enforces the sequential city order
      return [basicDetails.destinationCities[stepIndex]];
    }
    
    // For the return step, only origin city is allowed
    return [basicDetails.fromCity];
  };
  
  // Determine which step to render
  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <BasicDetailsStep 
          data={basicDetails} 
          updateData={updateBasicDetails}
          onNext={handleNextStep}
        />
      );
    } else {
      // Render the appropriate city itinerary step
      const itineraryIndex = currentStep - 2;
      
      // Check if this is the last step (return journey)
      const isReturnStep = itineraryIndex === cityItineraries.length - 1;
      
      return (
        <CityItineraryStep
          key={`city-step-${itineraryIndex}`}
          data={cityItineraries[itineraryIndex]}
          updateData={(data) => updateCityItinerary(itineraryIndex, data)}
          packageStartDate={basicDetails.startDate}
          packageEndDate={basicDetails.endDate}
          stepNumber={isReturnStep ? basicDetails.destinationCities.length + 1 : itineraryIndex + 1}
          totalDestinations={basicDetails.destinationCities.length + 1}
          onNext={handleNextStep}
          onBack={handlePreviousStep}
          isLastStep={currentStep === totalSteps}
          allowedDestinations={getAllowedDestinations(itineraryIndex)}
          isTourGuideOptionDisabled={isTourGuideOptionDisabled}
          originCity={basicDetails.fromCity}
        />
      );
    }
  };
  
  // Render the final buttons only on the last step
  const renderFinalButtons = () => {
    if (currentStep === totalSteps) {
      return (
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save as Draft"}
          </Button>
          <Button
            type="button"
            onClick={handleFinish}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Finish"}
          </Button>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Progress indicator */}
      <div className="bg-gray-100 px-6 py-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-medium">
            Step {currentStep} of {totalSteps}
          </h2>
          <div className="text-sm text-gray-500">
            {currentStep === 1 ? 'Basic Details' : 
             currentStep === totalSteps ? 'Return to Origin' : 
             `Destination ${currentStep - 1}: ${basicDetails.destinationCities[currentStep - 2] || ''}`}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Step content */}
      <div className="p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default PackageCreationWizard;
