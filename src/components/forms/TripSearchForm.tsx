
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { searchService, CitySuggestion } from '@/services/searchService';
import { debounce } from '@/utils/debounce';

type TripSearchFormProps = {
  variant?: 'default' | 'hero' | 'integrated';
}

const TripSearchForm = ({ variant = 'default' }: TripSearchFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fromCity, setFromCity] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>();
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  
  // City auto-complete states
  const [fromCitySuggestions, setFromCitySuggestions] = useState<CitySuggestion[]>([]);
  const [toCitySuggestions, setToCitySuggestions] = useState<CitySuggestion[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [isFromSearching, setIsFromSearching] = useState(false);
  const [isToSearching, setIsToSearching] = useState(false);
  const [selectedFromCity, setSelectedFromCity] = useState<CitySuggestion | null>(null);
  const [selectedToCity, setSelectedToCity] = useState<CitySuggestion | null>(null);

  // Debounced search for from city
  const debouncedFromSearch = debounce(async (query: string) => {
    if (query.length >= 3) {
      setIsFromSearching(true);
      try {
        const suggestions = await searchService.getSuggestedCities(query);
        setFromCitySuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
      } finally {
        setIsFromSearching(false);
      }
    } else {
      setFromCitySuggestions([]);
    }
  }, 300);

  // Debounced search for to city
  const debouncedToSearch = debounce(async (query: string) => {
    if (query.length >= 3) {
      setIsToSearching(true);
      try {
        const suggestions = await searchService.getSuggestedCities(query);
        setToCitySuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
      } finally {
        setIsToSearching(false);
      }
    } else {
      setToCitySuggestions([]);
    }
  }, 300);

  // Request location permission when the component mounts
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (navigator.geolocation) {
        setIsLocationLoading(true);
        try {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              try {
                // Use reverse geocoding to get the city name
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
                );
                const data = await response.json();
                
                // Extract city information
                const city = data.address.city || 
                             data.address.town || 
                             data.address.village || 
                             data.address.county || 
                             'Unknown location';
                
                setFromCity(city);
                setSelectedFromCity({ CityName: city });
                setIsLocationLoading(false);
                
                toast({
                  title: "Location detected",
                  description: `Your current location: ${city}`,
                });
              } catch (error) {
                console.error("Error fetching location data:", error);
                setIsLocationLoading(false);
                toast({
                  title: "Could not determine your city",
                  description: "Please enter your location manually",
                  variant: "destructive",
                });
              }
            },
            (error) => {
              setIsLocationLoading(false);
              console.error("Geolocation error:", error);
              if (error.code === error.PERMISSION_DENIED) {
                toast({
                  title: "Location access denied",
                  description: "Please enable location services or enter your location manually",
                  variant: "destructive",
                });
              }
            }
          );
        } catch (error) {
          setIsLocationLoading(false);
          console.error("Geolocation error:", error);
        }
      }
    };

    requestLocationPermission();
  }, [toast]);

  const handleFromCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setFromCity(query);
    setSelectedFromCity(null);
    setShowFromSuggestions(true);
    debouncedFromSearch(query);
  };

  const handleToCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setDestination(query);
    setSelectedToCity(null);
    setShowToSuggestions(true);
    debouncedToSearch(query);
  };

  const handleFromCitySelect = (city: CitySuggestion) => {
    setSelectedFromCity(city);
    setFromCity(city.CityName);
    setShowFromSuggestions(false);
  };

  const handleToCitySelect = (city: CitySuggestion) => {
    setSelectedToCity(city);
    setDestination(city.CityName);
    setShowToSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fromCity || !destination) {
      toast({
        title: "Missing information",
        description: "Please select both departure and destination cities",
        variant: "destructive",
      });
      return;
    }

    if (!departureDate) {
      toast({
        title: "Missing departure date",
        description: "Please select a departure date",
        variant: "destructive",
      });
      return;
    }
    
    // Navigate to builder with all the details
    navigate('/custom-trip/builder', {
      state: {
        fromCity,
        destination,
        departureDate: departureDate ? format(departureDate, 'yyyy-MM-dd') : '',
        returnDate: returnDate ? format(returnDate, 'yyyy-MM-dd') : '',
        adults,
        children,
      }
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* From City Input with Suggestions */}
          <div>
            <label htmlFor="fromCity" className="block text-sm font-medium text-gray-700 mb-1">
              From City
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="fromCity"
                type="text"
                placeholder={isLocationLoading ? "Detecting your location..." : "Your departure city"}
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={fromCity}
                onChange={handleFromCityChange}
                onFocus={() => setShowFromSuggestions(true)}
                onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                required
              />
              {isFromSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* City suggestions dropdown */}
              {showFromSuggestions && fromCitySuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {fromCitySuggestions.map((city, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => handleFromCitySelect(city)}
                    >
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        <span>{city.CityName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Destination City Input with Suggestions */}
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="destination"
                type="text"
                placeholder="City, region, or country"
                className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={destination}
                onChange={handleToCityChange}
                onFocus={() => setShowToSuggestions(true)}
                onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                required
              />
              {isToSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* City suggestions dropdown */}
              {showToSuggestions && toCitySuggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {toCitySuggestions.map((city, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      onMouseDown={() => handleToCitySelect(city)}
                    >
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-2 text-gray-400" />
                        <span>{city.CityName}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Departure Date */}
          <div>
            <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700 mb-1">
              Departure
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="departureDate"
                  type="button"
                  className={cn(
                    "w-full p-3 pl-10 border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-primary/50 relative",
                    !departureDate && "text-gray-500"
                  )}
                >
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {departureDate ? format(departureDate, "MMM d, yyyy") : "Select date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Return Date */}
          <div>
            <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
              Return
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="returnDate"
                  type="button"
                  className={cn(
                    "w-full p-3 pl-10 border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-primary/50 relative",
                    !returnDate && "text-gray-500"
                  )}
                >
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {returnDate ? format(returnDate, "MMM d, yyyy") : "Select date"}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                  disabled={(date) => 
                    departureDate ? date < departureDate : false
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Travelers Selection */}
        <div className="mb-6">
          <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-1">
            Travelers
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                id="travelers"
                type="button"
                className="w-full p-3 pl-10 border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-primary/50 relative"
              >
                <Users size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {adults + children} {adults + children === 1 ? 'Traveler' : 'Travelers'} ({adults} {adults === 1 ? 'Adult' : 'Adults'}, {children} {children === 1 ? 'Child' : 'Children'})
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Adults (18+)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 focus:outline-none"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{adults}</span>
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 focus:outline-none"
                      onClick={() => setAdults(adults + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Children (0-17)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 focus:outline-none"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{children}</span>
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 focus:outline-none"
                      onClick={() => setChildren(children + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button
          type="submit"
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3"
        >
          <Search size={18} className="mr-2" />
          Build your perfect Trip
        </Button>
      </form>
    </div>
  );
};

export default TripSearchForm;
