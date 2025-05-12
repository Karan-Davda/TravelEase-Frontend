
import { useState, useEffect } from 'react';
import { CityItinerary } from '../PackageCreationWizard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from '@/hooks/use-toast';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Plus, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransportationTypes } from "@/hooks/useTransportationTypes";
import { useTransportationSearch, TransportDropdownOption } from "@/hooks/useTransportationSearch";
import { useAccommodations } from "@/hooks/useAccommodations";
import AccommodationCard from "../accommodation/AccommodationCard";
import { Transportation } from '@/services/transportationService';

// Mock data for experiences - will be replaced with API in future updates
const mockExperiences = [
  { id: 'e1', name: 'City Walking Tour', duration: '2 hours', price: 45 },
  { id: 'e2', name: 'Museum Pass', duration: '1 day', price: 30 },
  { id: 'e3', name: 'Food Tasting Tour', duration: '3 hours', price: 65 },
  { id: 'e4', name: 'Harbor Cruise', duration: '1.5 hours', price: 40 }
];

type CityItineraryStepProps = {
  data: CityItinerary;
  updateData: (data: Partial<CityItinerary>) => void;
  packageStartDate: Date | undefined;
  packageEndDate: Date | undefined;
  stepNumber: number;
  totalDestinations: number;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
  allowedDestinations?: string[];
  isTourGuideOptionDisabled?: boolean;
  originCity?: string; // Added originCity prop for the last step
};

const CityItineraryStep = ({ 
  data, 
  updateData, 
  packageStartDate, 
  packageEndDate,
  stepNumber,
  totalDestinations,
  onNext, 
  onBack,
  isLastStep,
  allowedDestinations = [],
  isTourGuideOptionDisabled = false,
  originCity,
}: CityItineraryStepProps) => {
  const { toast } = useToast();
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [isSameCity, setIsSameCity] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<Transportation | null>(null);
  
  // Fetch transportation types
  const { types: transportationTypes, isLoading: loadingTypes } = useTransportationTypes();
  
  // State for transportation loading and search
  const [transportTypeName, setTransportTypeName] = useState<string>('');
  
  // Initialize transportation search with empty params
  const {
    onwardItems: transportOptions,
    dropdownOptions,
    loading: loadingTransport,
    filters,
    updateFilters,
    handleSearch: searchTransportation,
    setInitialFilters,
    getTransportationById,
  } = useTransportationSearch(data.transportType || 'flight');
  
  // Check if from and to cities are the same
  useEffect(() => {
    const sameCity = data.fromCity === data.toCity;
    setIsSameCity(sameCity);
    
    // If cities are the same, clear transportation selection
    if (sameCity && data.transportId) {
      updateData({ transportId: '' });
    }
  }, [data.fromCity, data.toCity, updateData]);
  
  // When transportation type changes, update the hook type
  useEffect(() => {
    // Find the name of the transport type from the ID
    if (data.transportType && transportationTypes.length > 0) {
      const typeObj = transportationTypes.find(t => 
        t.TransportationType.toLowerCase() === data.transportType);
      if (typeObj) {
        setTransportTypeName(typeObj.TransportationType);
      }
    }
  }, [data.transportType, transportationTypes]);
  
  // Set up search parameters when required fields are available
  useEffect(() => {
    if (data.fromCity && data.toCity && data.transportType && !isSameCity) {
      // For the last step (return journey), we only need the toDate as departure date
      const fromDate = isLastStep 
        ? data.toDate 
        : data.fromDate;
        
      if (!fromDate) return; // Don't search if we don't have the required date
        
      // Log the raw city names to debug encoding
      console.log('Raw from city:', data.fromCity);
      console.log('Raw to city:', data.toCity);
      
      const searchParams = {
        fromCityName: data.fromCity,
        toCityName: data.toCity,
        fromDate: format(fromDate, 'yyyy-MM-dd'),
        toDate: undefined, // Not needed for one-way transport search
        numberOfTravelers: 1,
        tripType: 'one-way' as const,
      };
      
      setInitialFilters(searchParams);
    }
  }, [data.fromCity, data.toCity, data.fromDate, data.toDate, data.transportType, isLastStep, setInitialFilters, isSameCity]);
  
  // Format dates for accommodation API
  const fromDateFormatted = data.fromDate ? format(data.fromDate, 'yyyy-MM-dd') : undefined;
  const toDateFormatted = data.toDate ? format(data.toDate, 'yyyy-MM-dd') : undefined;
  
  // Fetch accommodations for the destination city using the updated hook with new API endpoint
  // Don't fetch accommodations for the last step (return journey)
  const { 
    accommodations, 
    isLoading: loadingAccommodations 
  } = useAccommodations({
    fromCity: !isLastStep ? data.fromCity : '',
    toCity: !isLastStep ? data.toCity : '',
    fromDate: !isLastStep ? fromDateFormatted : undefined,
    toDate: !isLastStep ? toDateFormatted : undefined
  });
  
  // Only search for transportation when explicitly requested
  const handleTransportSearch = () => {
    if (data.fromCity && data.toCity && data.transportType && !isSameCity) {
      // For the last step (return journey), we use toDate as the departure date
      const fromDate = isLastStep 
        ? data.toDate 
        : data.fromDate;
        
      if (!fromDate) return; // Don't search if we don't have the required date
      
      updateFilters({
        fromCityName: data.fromCity,
        toCityName: data.toCity,
        fromDate: format(fromDate, 'yyyy-MM-dd'),
        toDate: undefined, // Not needed for one-way search
        numberOfTravelers: 1,
        tripType: 'one-way' as const,
      });
      searchTransportation();
    }
  };
  
  // When transport type changes, set up for a new search
  useEffect(() => {
    if (data.transportType) {
      handleTransportSearch();
    }
  }, [data.transportType]);
  
  // When transportId changes, update the selected transport
  useEffect(() => {
    if (data.transportId) {
      const transport = getTransportationById(data.transportId);
      if (transport) {
        setSelectedTransport(transport);
      }
    } else {
      setSelectedTransport(null);
    }
  }, [data.transportId, getTransportationById]);
  
  // Form validation
  const validateForm = () => {
    if (!data.toCity) {
      toast({
        title: "Destination city required",
        description: "Please enter a destination city.",
        variant: "destructive",
      });
      return false;
    }
    
    if (allowedDestinations.length > 0 && !allowedDestinations.includes(data.toCity)) {
      toast({
        title: "Invalid destination city",
        description: "Please select from the allowed destination cities.",
        variant: "destructive",
      });
      return false;
    }
    
    // Only validate fromDate if not the last step (return to origin)
    if (!isLastStep && !data.fromDate) {
      toast({
        title: "From date required",
        description: "Please select a date to depart from " + data.fromCity,
        variant: "destructive",
      });
      return false;
    }
    
    // Only validate to date if not the last step
    if (!isLastStep && !data.toDate) {
      toast({
        title: "To date required",
        description: "Please select a date to depart from " + data.toCity,
        variant: "destructive",
      });
      return false;
    }
    
    // For the last step, we need toDate (return date)
    if (isLastStep && !data.toDate) {
      toast({
        title: "Return date required",
        description: "Please select a return date to " + data.toCity,
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };
  
  const handleAddExperience = () => {
    if (!selectedExperience) return;
    
    if (data.experienceIds.includes(selectedExperience)) {
      toast({
        title: "Experience already added",
        description: "This experience is already in your itinerary.",
        variant: "destructive",
      });
      return;
    }
    
    updateData({
      experienceIds: [...data.experienceIds, selectedExperience]
    });
    setSelectedExperience('');
  };
  
  const handleRemoveExperience = (id: string) => {
    updateData({
      experienceIds: data.experienceIds.filter(expId => expId !== id)
    });
  };
  
  const handleSelectTransport = (transportId: string) => {
    updateData({
      transportId: transportId
    });
  };
  
  // Format time helper function
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return "Invalid time";
    }
  };
  
  const handleSelectAccommodation = (accommodationId: number) => {
    updateData({
      accommodationId: accommodationId.toString()
    });
  };
  
  // Build the list of cities for the ToCity dropdown
  const getToDestinations = () => {
    // For the last step, only allow returning to origin
    if (isLastStep && originCity) {
      return [originCity];
    }
    
    // For other steps, use allowed destinations or add origin city as an option
    let destinations = [...(allowedDestinations || [])];
    if (originCity && !destinations.includes(originCity)) {
      destinations.push(originCity);
    }
    return destinations;
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        {isLastStep 
          ? `Return to Origin (${originCity || 'Home'})` 
          : `Destination ${stepNumber} of ${totalDestinations}: ${data.toCity || "Select destination"}`}
      </h3>
      
      {/* From and To City fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From City (disabled/readonly) */}
        <div className="space-y-2">
          <Label htmlFor="fromCity">From City</Label>
          <Input
            id="fromCity"
            value={data.fromCity}
            disabled
            className="bg-gray-50"
          />
        </div>
        
        {/* To City - with dropdown based on allowedDestinations */}
        <div className="space-y-2">
          <Label htmlFor="toCity">To City*</Label>
          {isLastStep ? (
            <Input
              id="toCity"
              value={data.toCity}
              disabled
              className="bg-gray-50"
            />
          ) : getToDestinations().length > 0 ? (
            <Select
              value={data.toCity}
              onValueChange={(value) => updateData({ toCity: value })}
            >
              <SelectTrigger id="toCity">
                <SelectValue placeholder="Select destination city" />
              </SelectTrigger>
              <SelectContent>
                {getToDestinations().map(city => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="toCity"
              value={data.toCity}
              onChange={(e) => updateData({ toCity: e.target.value })}
              placeholder="Enter destination city"
            />
          )}
        </div>
      </div>
      
      {/* Date selections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From Date - Not shown in last step */}
        {!isLastStep && (
          <div className="space-y-2">
            <Label htmlFor="fromDate">Departure Date*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="fromDate"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.fromDate ? format(data.fromDate, "PPP") : <span>Select departure date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.fromDate}
                  onSelect={(date) => updateData({ fromDate: date })}
                  initialFocus
                  disabled={(date) => {
                    if (!packageStartDate || !packageEndDate) return true;
                    return date < packageStartDate || date > packageEndDate;
                  }}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        {/* To Date / Return Date */}
        <div className={isLastStep ? "md:col-span-2" : ""}>
          <div className="space-y-2">
            <Label htmlFor="toDate">{isLastStep ? "Return Date*" : "Departure Date for Next Destination*"}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="toDate"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.toDate ? format(data.toDate, "PPP") : <span>Select date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.toDate}
                  onSelect={(date) => updateData({ toDate: date })}
                  initialFocus
                  disabled={(date) => {
                    if (!packageStartDate || !packageEndDate) return true;
                    
                    // Must be within package dates and after fromDate
                    if (date < packageStartDate || date > packageEndDate) return true;
                    if (data.fromDate && date <= data.fromDate) return true;
                    
                    return false;
                  }}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      {/* Transportation Selection - Hide if same city */}
      {!isSameCity && (
        <div className="space-y-4">
          <h4 className="font-medium">Transportation (Optional)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transport Type */}
            <div className="space-y-2">
              <Label htmlFor="transportType">Transport Type</Label>
              <Select
                value={data.transportType}
                onValueChange={(value: 'flight' | 'bus' | 'train') => {
                  updateData({ 
                    transportType: value,
                    transportId: '' // Reset selected transport when type changes
                  });
                }}
                disabled={loadingTypes}
              >
                <SelectTrigger id="transportType">
                  {loadingTypes ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <SelectValue placeholder="Select transport type" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight">Flight</SelectItem>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Search Button */}
            <div className="flex items-end">
              <Button 
                type="button"
                onClick={handleTransportSearch}
                disabled={loadingTransport}
                className="w-full"
              >
                {loadingTransport ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>Search Options</>
                )}
              </Button>
            </div>
          </div>
          
          {/* Transport Options Dropdown */}
          {data.transportType && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="transportOption">Select {data.transportType} option</Label>
                
                {loadingTransport ? (
                  <div className="h-10 flex items-center px-3 border rounded-md bg-gray-50">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-gray-500">Loading options...</span>
                  </div>
                ) : dropdownOptions.length === 0 ? (
                  <div className="h-10 flex items-center px-3 border rounded-md bg-gray-50">
                    <span className="text-gray-500">No options available. Try searching again.</span>
                  </div>
                ) : (
                  <Select
                    value={data.transportId}
                    onValueChange={handleSelectTransport}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select a ${data.transportType} option`} />
                    </SelectTrigger>
                    <SelectContent>
                      {dropdownOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              
              {/* Show selected transport details */}
              {selectedTransport && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                  <h5 className="font-medium mb-2">Selected Option Details</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><span className="font-medium">Provider:</span> {selectedTransport.TransportationName}</p>
                      <p><span className="font-medium">From:</span> {selectedTransport.FromCityName}</p>
                      <p><span className="font-medium">To:</span> {selectedTransport.ToCityName}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Departure:</span> {formatTime(selectedTransport.DepartureTime)}</p>
                      <p><span className="font-medium">Arrival:</span> {formatTime(selectedTransport.ArrivalTime)}</p>
                      <p><span className="font-medium">Price:</span> ${selectedTransport.Price}</p>
                    </div>
                    <div className="flex items-center col-span-2">
                      <Clock size={16} className="mr-1" />
                      <span className="text-sm text-gray-500">
                        Duration: {selectedTransport.Duration.hours} hour{selectedTransport.Duration.hours !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Accommodation Selection - Only shown for non-last steps */}
      {!isLastStep && (
        <div className="space-y-4">
          <h4 className="font-medium">Accommodation (Optional)</h4>
          
          {loadingAccommodations ? (
            <div className="py-10 flex flex-col items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
              <p className="text-sm text-gray-500">Loading accommodations...</p>
            </div>
          ) : accommodations.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <p className="text-gray-500">
                No accommodation options available for {data.toCity}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accommodations.map(accommodation => (
                <AccommodationCard
                  key={accommodation.AccommodationID}
                  accommodation={accommodation}
                  cityName={data.toCity}
                  isSelected={data.accommodationId === accommodation.AccommodationID.toString()}
                  onSelect={() => handleSelectAccommodation(accommodation.AccommodationID)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Tour Guide Selection - Not showing in last step */}
      {!isLastStep && (
        <div className="space-y-4">
          <h4 className="font-medium">Tour Guide</h4>
          
          <div className="space-y-2">
            <Label htmlFor="needsTourGuide">Need a Tour Guide?</Label>
            <Select
              value={data.needsTourGuide ? "yes" : "no"}
              onValueChange={(value) => updateData({ needsTourGuide: value === "yes" })}
              disabled={isTourGuideOptionDisabled}
            >
              <SelectTrigger id="needsTourGuide">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
            {isTourGuideOptionDisabled && (
              <p className="text-xs text-gray-500">
                Tour guide option is disabled because it was turned off in basic details.
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Experiences Selection - Not showing in last step */}
      {!isLastStep && (
        <div className="space-y-4">
          <h4 className="font-medium">Experiences (Optional)</h4>
          
          <div className="flex space-x-2">
            <Select
              value={selectedExperience}
              onValueChange={setSelectedExperience}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select experiences" />
              </SelectTrigger>
              <SelectContent>
                {mockExperiences.map(exp => (
                  <SelectItem key={exp.id} value={exp.id}>
                    {exp.name} - {exp.duration} - ${exp.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              type="button" 
              onClick={handleAddExperience}
              disabled={!selectedExperience}
            >
              <Plus size={16} className="mr-1" /> Add
            </Button>
          </div>
          
          {/* List of selected experiences */}
          {data.experienceIds.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Selected experiences:</p>
              <div className="space-y-2">
                {data.experienceIds.map(expId => {
                  const experience = mockExperiences.find(exp => exp.id === expId);
                  return (
                    <div 
                      key={expId}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{experience?.name}</p>
                        <p className="text-sm text-gray-500">
                          {experience?.duration} - ${experience?.price}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveExperience(expId)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          Back
        </Button>
        
        <Button
          type="button"
          onClick={handleNext}
        >
          {isLastStep ? 'Finish' : 'Next Destination'}
        </Button>
      </div>
    </div>
  );
};

export default CityItineraryStep;
