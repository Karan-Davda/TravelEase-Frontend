
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Calendar, Clock, DollarSign, Search, Loader, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { transportationService, Transportation } from '@/services/transportationService';
import { TransportMode } from '../TripBuilderWizard';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

type TransportOptionsStepProps = {
  transportMode: TransportMode;
  startDate?: Date;
  endDate?: Date;
  destination: string;
  fromCity: string;
  selectedOption?: {
    id: string;
    name: string;
    price: number;
    details: Record<string, any>;
  };
  onUpdate: (option: {
    id: string;
    name: string;
    price: number;
    details: Record<string, any>;
  }) => void;
  onNext: () => void;
  onBack: () => void;
};

interface TransportDropdownOption {
  value: string;
  label: string;
  details: Transportation;
}

const TransportOptionsStep: React.FC<TransportOptionsStepProps> = ({
  transportMode,
  startDate,
  endDate,
  destination,
  fromCity,
  selectedOption,
  onUpdate,
  onNext,
  onBack,
}) => {
  const navigate = useNavigate();
  const [transportationOptions, setTransportationOptions] = useState<Transportation[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<TransportDropdownOption[]>([]);
  const [currentType, setCurrentType] = useState<TransportMode>(transportMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | undefined>(selectedOption?.id);
  const [selectedTransportation, setSelectedTransportation] = useState<Transportation | null>(null);
  
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTransportationOptions(currentType);
  }, [currentType, fromCity, destination, startDate, endDate]);
  
  const fetchTransportationOptions = async (type: TransportMode) => {
    if (!fromCity || !destination) {
      setError("Origin and destination are required");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      let response;
      const filters = {
        fromCityName: fromCity,
        toCityName: destination,
        fromDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        toDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
        tripType: 'one-way' as 'one-way' | 'round-trip'
      };
      
      switch (type) {
        case 'flight':
          response = await transportationService.getFlights(filters);
          break;
        case 'train':
          response = await transportationService.getTrains(filters);
          break;
        case 'bus':
          response = await transportationService.getBuses(filters);
          break;
        case 'car':
          // For car rental, we'd need a different approach
          setTransportationOptions([]);
          setLoading(false);
          return;
      }
      
      // Log the response for debugging
      console.log(`Got ${type} response:`, response);
      
      // Ensure we have valid data
      const validOptions = Array.isArray(response?.onward) ? response.onward.filter(Boolean) : [];
      setTransportationOptions(validOptions);
      
      // Create dropdown options
      const options = validOptions.map(item => ({
        value: String(item.TransportationID),
        label: formatTransportationLabel(item),
        details: item
      }));
      
      setDropdownOptions(options);
    } catch (err) {
      console.error("Error fetching transportation options:", err);
      setError("Failed to load transportation options");
      toast({
        title: "Error",
        description: "Could not load transportation options. Please try again.",
        variant: "destructive",
      });
      setTransportationOptions([]);
      setDropdownOptions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to format transportation labels for dropdown
  const formatTransportationLabel = (transport: Transportation): string => {
    try {
      // Format time for display
      const formatTime = (dateTimeStr: string) => {
        try {
          const date = new Date(dateTimeStr);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
          return "Unknown time";
        }
      };
      
      // Create a descriptive label with key information
      return `${transport.TransportationName} | ${formatTime(transport.DepartureTime)} to ${formatTime(transport.ArrivalTime)} | $${transport.Price}`;
    } catch (error) {
      console.error("Error formatting transportation label", error);
      return `ID: ${transport.TransportationID} - $${transport.Price}`;
    }
  };
  
  const handleSelectTransport = (transportId: string) => {
    const selected = transportationOptions.find(t => String(t.TransportationID) === transportId);
    if (selected) {
      setSelected(transportId);
      setSelectedTransportation(selected);
      
      onUpdate({
        id: transportId,
        name: selected.TransportationName,
        price: parseFloat(selected.Price),
        details: selected
      });
    }
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
  
  const handleNext = (e: React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    if (!selected) {
      toast({
        title: "Selection required",
        description: "Please select a transportation option to continue",
        variant: "destructive",
      });
      return;
    }
    
    onNext();
  };
  
  const handleBack = (e: React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    navigate('/custom-trip'); // Navigate back to custom-trip
  };
  
  const isNextDisabled = !selected;
  
  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-center">
        Select Your Transportation
      </h2>
      
      {/* Transportation type selector */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2">
          <Button 
            variant={currentType === 'flight' ? "default" : "outline"}
            onClick={() => setCurrentType('flight')}
            className="flex items-center justify-center gap-2"
          >
            Flights
          </Button>
          <Button 
            variant={currentType === 'train' ? "default" : "outline"}
            onClick={() => setCurrentType('train')}
            className="flex items-center justify-center gap-2"
          >
            Trains
          </Button>
          <Button 
            variant={currentType === 'bus' ? "default" : "outline"}
            onClick={() => setCurrentType('bus')}
            className="flex items-center justify-center gap-2"
          >
            Buses
          </Button>
          <Button 
            variant={currentType === 'car' ? "default" : "outline"}
            onClick={() => setCurrentType('car')}
            className="flex items-center justify-center gap-2"
          >
            Car
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">From</p>
            <p className="font-medium">{fromCity}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">To</p>
            <p className="font-medium">{destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">{startDate ? format(startDate, 'MMM d, yyyy') : 'Not selected'}</p>
          </div>
        </div>
      </div>
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size={32} className="animate-spin text-primary mb-4" />
          <p className="text-gray-500">Loading transportation options...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => handleBack}
          >
            Go Back and Try Again
          </Button>
        </div>
      )}
      
      {!loading && !error && transportationOptions.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-md mb-6">
          <p>No transportation options found for your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={handleBack}
          >
            Go Back and Try Different Options
          </Button>
        </div>
      )}
      
      {!loading && !error && transportationOptions.length > 0 && (
        <div className="space-y-6">
          {/* Transportation dropdown selector */}
          <div className="space-y-2">
            <Label htmlFor="transportOption">Select {currentType} option</Label>
            <Select
              value={selected}
              onValueChange={handleSelectTransport}
            >
              <SelectTrigger id="transportOption" className="w-full">
                <SelectValue placeholder={`Select a ${currentType} option`} />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Show selected transportation details */}
          {selectedTransportation && (
            <Card className="bg-white border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-3">{selectedTransportation.TransportationName}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Route</p>
                    <p className="font-medium">{selectedTransportation.FromCityName} to {selectedTransportation.ToCityName}</p>
                    
                    <p className="text-sm font-medium text-gray-500 mt-2">Date</p>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      <span>{format(new Date(selectedTransportation.DepartureTime), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <p className="font-semibold">{formatTime(selectedTransportation.DepartureTime)}</p>
                        <p className="text-xs text-gray-500">Departure</p>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {selectedTransportation.Duration.hours}h
                        </div>
                        <div className="w-16 h-px bg-gray-300 my-1"></div>
                      </div>
                      
                      <div>
                        <p className="font-semibold">{formatTime(selectedTransportation.ArrivalTime)}</p>
                        <p className="text-xs text-gray-500">Arrival</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-500">Price</p>
                      <p className="text-xl font-bold text-primary">${selectedTransportation.Price}<span className="text-sm font-normal text-gray-500"> /person</span></p>
                    </div>
                  </div>
                </div>
                
                {selectedTransportation.Class && (
                  <div className="mt-4 text-sm">
                    <span className="font-medium">Class:</span> {selectedTransportation.Class}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button 
          variant="tertiary" 
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isNextDisabled}
          className="gap-2 min-w-[120px]"
        >
          Next <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TransportOptionsStep;
