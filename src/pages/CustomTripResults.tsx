
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Train, Bus, Car, Hotel, Calendar, MapPin, Users, Wallet, ArrowLeft, ArrowRight } from 'lucide-react';
import { parseISO, differenceInDays } from 'date-fns';

interface TripOption {
  id: string;
  type: 'flight' | 'hotel' | 'train' | 'bus' | 'car';
  name: string;
  description: string;
  price: number;
  image?: string;
  duration?: string;
  rating?: number;
  details?: {
    [key: string]: string | number;
  };
}

const CustomTripResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('');
  const [results, setResults] = useState<{
    flights: TripOption[];
    hotels: TripOption[];
    transport: TripOption[];
  }>({
    flights: [],
    hotels: [],
    transport: [],
  });
  const [selectedOptions, setSelectedOptions] = useState<{
    flight?: TripOption;
    hotel?: TripOption;
    transport?: TripOption;
  }>({});
  
  // Extract search parameters
  const fromCity = searchParams.get('fromCity') || 'Your City';
  const destination = searchParams.get('destination') || '';
  const dates = searchParams.get('dates') || '';
  const departureDate = searchParams.get('departureDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const travelers = parseInt(searchParams.get('travelers') || '1');
  const budget = searchParams.get('budget') || '';
  const includeHotel = searchParams.get('includeHotel') === 'true';
  const transportMode = searchParams.get('transportMode') || 'flight';
  
  // Calculate number of days for the trip
  const calculateDays = () => {
    if (departureDate && returnDate) {
      const start = parseISO(departureDate);
      const end = parseISO(returnDate);
      return Math.max(1, differenceInDays(end, start) + 1);
    }
    return 1;
  };
  
  const days = calculateDays();

  // Determine which tab to show initially
  useEffect(() => {
    let initialTab = transportMode === 'flight' ? 'flights' : 'transport';
    if (!includeHotel && initialTab === 'flights') {
      setActiveTab('flights');
    } else if (!includeHotel && initialTab === 'transport') {
      setActiveTab('transport');
    } else {
      setActiveTab(initialTab);
    }
  }, [includeHotel, transportMode]);
  
  // Simulate fetching results
  useEffect(() => {
    // This would be replaced with actual API calls in a real application
    const fetchResults = async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data based on search parameters
      const mockFlights: TripOption[] = [
        {
          id: 'f1',
          type: 'flight',
          name: `Flight from ${fromCity} to ${destination}`,
          description: 'Economy Class, Direct',
          price: 299,
          duration: '2h 15m',
          details: {
            airline: 'SkyWings',
            departureTime: '08:45',
            arrivalTime: '11:00',
            departureAirport: fromCity.substring(0, 3).toUpperCase(),
            arrivalAirport: destination === 'Las Vegas' ? 'LAS' : 'SFO',
          }
        },
        {
          id: 'f2',
          type: 'flight',
          name: `Budget Flight from ${fromCity} to ${destination}`,
          description: 'Economy Class, 1 Stop',
          price: 199,
          duration: '3h 45m',
          details: {
            airline: 'ValueAir',
            departureTime: '06:30',
            arrivalTime: '10:15',
            departureAirport: fromCity.substring(0, 3).toUpperCase(),
            arrivalAirport: destination === 'Las Vegas' ? 'LAS' : 'SFO',
            stops: 1
          }
        },
        {
          id: 'f3',
          type: 'flight',
          name: `Premium Flight from ${fromCity} to ${destination}`,
          description: 'Business Class, Direct',
          price: 599,
          duration: '2h 10m',
          details: {
            airline: 'LuxAir',
            departureTime: '09:30',
            arrivalTime: '11:40',
            departureAirport: fromCity.substring(0, 3).toUpperCase(),
            arrivalAirport: destination === 'Las Vegas' ? 'LAS' : 'SFO',
          }
        }
      ];
      
      const mockHotels: TripOption[] = includeHotel ? [
        {
          id: 'h1',
          type: 'hotel',
          name: `${destination} Grand Resort`,
          description: '4-star hotel with pool and spa',
          price: 180,
          rating: 4.5,
          details: {
            address: `123 Main St, ${destination}`,
            amenities: 'Pool, Spa, Restaurant, Free WiFi',
            checkIn: '3:00 PM',
            checkOut: '11:00 AM'
          }
        },
        {
          id: 'h2',
          type: 'hotel',
          name: `${destination} Budget Inn`,
          description: '3-star hotel near city center',
          price: 89,
          rating: 3.8,
          details: {
            address: `456 Center Ave, ${destination}`,
            amenities: 'Free WiFi, Continental Breakfast',
            checkIn: '2:00 PM',
            checkOut: '10:00 AM'
          }
        },
        {
          id: 'h3',
          type: 'hotel',
          name: `${destination} Luxury Suites`,
          description: '5-star luxury accommodations',
          price: 350,
          rating: 4.9,
          details: {
            address: `789 Luxury Blvd, ${destination}`,
            amenities: 'Full Spa, Multiple Restaurants, Pool, Concierge',
            checkIn: '4:00 PM',
            checkOut: '12:00 PM'
          }
        }
      ] : [];
      
      // Mock transport options based on selected mode
      let mockTransport: TripOption[] = [];
      
      switch(transportMode) {
        case 'train':
          mockTransport = [
            {
              id: 't1',
              type: 'train',
              name: `Express Train from ${fromCity} to ${destination}`,
              description: 'Business Class, Direct',
              price: 120,
              duration: '3h 30m',
              details: {
                company: 'RailExpress',
                departureTime: '09:00',
                arrivalTime: '12:30'
              }
            },
            {
              id: 't2',
              type: 'train',
              name: `Standard Train from ${fromCity} to ${destination}`,
              description: 'Economy Class, Direct',
              price: 75,
              duration: '4h 15m',
              details: {
                company: 'NationalRail',
                departureTime: '10:15',
                arrivalTime: '14:30'
              }
            }
          ];
          break;
          
        case 'bus':
          mockTransport = [
            {
              id: 'b1',
              type: 'bus',
              name: `Express Bus from ${fromCity} to ${destination}`,
              description: 'Premium Service, Few Stops',
              price: 45,
              duration: '5h 15m',
              details: {
                company: 'PremiumCoach',
                departureTime: '08:00',
                arrivalTime: '13:15'
              }
            },
            {
              id: 'b2',
              type: 'bus',
              name: `Economy Bus from ${fromCity} to ${destination}`,
              description: 'Standard Service, Multiple Stops',
              price: 30,
              duration: '6h 45m',
              details: {
                company: 'RegionalBus',
                departureTime: '07:30',
                arrivalTime: '14:15'
              }
            }
          ];
          break;
          
        case 'car':
          mockTransport = [
            {
              id: 'c1',
              type: 'car',
              name: 'Economy Car Rental',
              description: 'Compact car with good fuel efficiency',
              price: 35,
              details: {
                company: 'EasyCar',
                model: 'Compact Sedan',
                fuelType: 'Gasoline',
                mpg: 35
              }
            },
            {
              id: 'c2',
              type: 'car',
              name: 'Mid-size SUV Rental',
              description: 'Comfortable for 5 passengers with luggage',
              price: 65,
              details: {
                company: 'PremiumAuto',
                model: 'Mid-size SUV',
                fuelType: 'Gasoline',
                mpg: 28
              }
            },
            {
              id: 'c3',
              type: 'car',
              name: 'Luxury Car Rental',
              description: 'Premium experience with all amenities',
              price: 120,
              details: {
                company: 'LuxuryWheels',
                model: 'Luxury Sedan',
                fuelType: 'Gasoline',
                mpg: 22
              }
            }
          ];
          break;
          
        default: // Flights as default
          // Already handled above
          break;
      }
      
      setResults({
        flights: transportMode === 'flight' ? mockFlights : [],
        hotels: mockHotels,
        transport: transportMode !== 'flight' ? mockTransport : []
      });
      
      setLoading(false);
    };
    
    fetchResults();
  }, [destination, dates, travelers, includeHotel, transportMode, budget, fromCity]);
  
  const handleOptionSelect = (type: 'flight' | 'hotel' | 'transport', option: TripOption) => {
    setSelectedOptions(prev => {
      const newSelection = { ...prev };
      
      if (type === 'flight') {
        newSelection.flight = option;
      } else if (type === 'hotel') {
        newSelection.hotel = option;
      } else if (type === 'transport') {
        newSelection.transport = option;
      }
      
      return newSelection;
    });
  };
  
  const calculateTotalPrice = () => {
    let total = 0;
    
    // Add flight/transport price
    if (transportMode === 'flight' && selectedOptions.flight) {
      total += selectedOptions.flight.price * travelers;
    } else if (selectedOptions.transport) {
      if (transportMode === 'car') {
        // Car rental is per day
        total += selectedOptions.transport.price * days;
      } else {
        // Train and bus are per person
        total += selectedOptions.transport.price * travelers;
      }
    }
    
    // Add hotel price (per night)
    if (includeHotel && selectedOptions.hotel) {
      total += selectedOptions.hotel.price * days;
    }
    
    return total;
  };
  
  const handleProceedToCheckout = () => {
    // Calculate total price
    const totalPrice = calculateTotalPrice();
    
    // Store selected options in session storage or state management
    const bookingData = {
      destination,
      dates,
      departureDate,
      returnDate,
      travelers,
      days,
      selectedOptions,
      totalPrice
    };
    
    // Navigate to checkout with all the booking data
    navigate('/booking-checkout', { state: bookingData });
  };
  
  const canProceedToCheckout = () => {
    if (transportMode === 'flight' && !selectedOptions.flight) return false;
    if (includeHotel && !selectedOptions.hotel) return false;
    if (transportMode !== 'flight' && !selectedOptions.transport) return false;
    
    return true;
  };

  // Function to handle tab navigation
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Function to navigate to next tab
  const goToNextTab = () => {
    if (activeTab === 'flights' || activeTab === 'transport') {
      if (includeHotel) {
        setActiveTab('hotels');
      } else {
        setActiveTab('summary');
      }
    } else if (activeTab === 'hotels') {
      setActiveTab('summary');
    }
  };

  // Function to navigate to previous tab
  const goToPreviousTab = () => {
    if (activeTab === 'summary') {
      if (includeHotel) {
        setActiveTab('hotels');
      } else {
        setActiveTab(transportMode === 'flight' ? 'flights' : 'transport');
      }
    } else if (activeTab === 'hotels') {
      setActiveTab(transportMode === 'flight' ? 'flights' : 'transport');
    }
  };

  // Helper function to render transport icon based on mode
  const renderTransportIcon = (type: string) => {
    switch(type) {
      case 'flight': return <Plane size={18} />;
      case 'train': return <Train size={18} />;
      case 'bus': return <Bus size={18} />;
      case 'car': return <Car size={18} />;
      default: return <Plane size={18} />;
    }
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <section className="pt-20 pb-6 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Your Custom Trip to {destination}</h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>From: {fromCity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>{dates || 'Flexible Dates'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}</span>
                </div>
                {budget && (
                  <div className="flex items-center gap-1">
                    <Wallet size={16} />
                    <span>Budget: ${budget}</span>
                  </div>
                )}
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/custom-trip')}
              variant="outline"
              className="whitespace-nowrap"
            >
              Modify Search
            </Button>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-medium">Finding the best options for your trip...</p>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <Tabs 
                  value={activeTab} 
                  onValueChange={handleTabChange}
                  className="w-full"
                >
                  <div className="flex items-center justify-between">
                    <TabsList className="mb-6">
                      {transportMode === 'flight' && <TabsTrigger value="flights">Flights</TabsTrigger>}
                      {includeHotel && <TabsTrigger value="hotels">Hotels</TabsTrigger>}
                      {transportMode !== 'flight' && <TabsTrigger value="transport">{transportMode === 'train' ? 'Trains' : transportMode === 'bus' ? 'Buses' : 'Car Rentals'}</TabsTrigger>}
                      <TabsTrigger value="summary">Trip Summary</TabsTrigger>
                    </TabsList>
                    
                    <div className="mb-6 flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={goToPreviousTab}
                        disabled={activeTab === (transportMode === 'flight' ? 'flights' : 'transport')}
                        className="flex items-center"
                      >
                        <ArrowLeft size={16} className="mr-2" /> Back
                      </Button>
                      <Button
                        variant="outline"
                        onClick={goToNextTab}
                        disabled={activeTab === 'summary'}
                        className="flex items-center"
                      >
                        Next <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                
                  {/* Flights Tab */}
                  {transportMode === 'flight' && (
                    <TabsContent value="flights" className="space-y-4">
                      <h2 className="text-xl font-semibold mb-4">Select your flight</h2>
                      {results.flights.map(flight => (
                        <Card 
                          key={flight.id}
                          className={`overflow-hidden transition-all ${selectedOptions.flight?.id === flight.id ? 'ring-2 ring-primary' : ''}`}
                        >
                          <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                              <div className="p-6 lg:col-span-3">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-lg font-semibold">{flight.name}</h3>
                                    <p className="text-gray-600">{flight.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl font-bold text-primary">${flight.price}</div>
                                    <div className="text-sm text-gray-500">per person</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <div className="text-sm text-gray-500">Airline</div>
                                    <div>{flight.details?.airline}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">Duration</div>
                                    <div>{flight.duration}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">Departure</div>
                                    <div>{flight.details?.departureTime} • {flight.details?.departureAirport}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">Arrival</div>
                                    <div>{flight.details?.arrivalTime} • {flight.details?.arrivalAirport}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-6 flex flex-col justify-center">
                                <Button 
                                  onClick={() => handleOptionSelect('flight', flight)}
                                  variant={selectedOptions.flight?.id === flight.id ? 'default' : 'outline'}
                                  className="w-full mb-2"
                                >
                                  {selectedOptions.flight?.id === flight.id ? 'Selected' : 'Select'}
                                </Button>
                                <Button variant="link" className="text-gray-500">View Details</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  )}
                  
                  {/* Hotels Tab */}
                  {includeHotel && (
                    <TabsContent value="hotels" className="space-y-4">
                      <h2 className="text-xl font-semibold mb-4">Select your hotel</h2>
                      {results.hotels.map(hotel => (
                        <Card 
                          key={hotel.id}
                          className={`overflow-hidden transition-all ${selectedOptions.hotel?.id === hotel.id ? 'ring-2 ring-primary' : ''}`}
                        >
                          <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                              <div className="p-6 lg:col-span-3">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-lg font-semibold">{hotel.name}</h3>
                                    <p className="text-gray-600">{hotel.description}</p>
                                    <div className="flex items-center mt-1">
                                      {[...Array(5)].map((_, i) => (
                                        <svg 
                                          key={i}
                                          className={`w-4 h-4 ${i < Math.floor(hotel.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                                          fill="currentColor" 
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl font-bold text-primary">${hotel.price}</div>
                                    <div className="text-sm text-gray-500">per night</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <div className="text-sm text-gray-500">Address</div>
                                    <div>{hotel.details?.address}</div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-500">Check-in/out</div>
                                    <div>{hotel.details?.checkIn} / {hotel.details?.checkOut}</div>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <div className="text-sm text-gray-500">Amenities</div>
                                    <div>{hotel.details?.amenities}</div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-gray-50 p-6 flex flex-col justify-center">
                                <Button 
                                  onClick={() => handleOptionSelect('hotel', hotel)}
                                  variant={selectedOptions.hotel?.id === hotel.id ? 'default' : 'outline'}
                                  className="w-full mb-2"
                                >
                                  {selectedOptions.hotel?.id === hotel.id ? 'Selected' : 'Select'}
                                </Button>
                                <Button variant="link" className="text-gray-500">View Details</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  )}
                  
                  {/* Transport Tab (Trains/Buses/Cars) */}
                  {transportMode !== 'flight' && (
                    <TabsContent value="transport" className="space-y-4">
                      <h2 className="text-xl font-semibold mb-4">
                        Select your {transportMode === 'train' ? 'train' : transportMode === 'bus' ? 'bus' : 'rental car'}
                      </h2>
                      {results.transport.map(option => (
                        <Card 
                          key={option.id}
                          className={`overflow-hidden transition-all ${selectedOptions.transport?.id === option.id ? 'ring-2 ring-primary' : ''}`}
                        >
                          <CardContent className="p-0">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                              <div className="p-6 lg:col-span-3">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-start gap-3">
                                    <div className="mt-1">{renderTransportIcon(option.type)}</div>
                                    <div>
                                      <h3 className="text-lg font-semibold">{option.name}</h3>
                                      <p className="text-gray-600">{option.description}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl font-bold text-primary">${option.price}</div>
                                    <div className="text-sm text-gray-500">
                                      {transportMode === 'car' ? 'per day' : 'per person'}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                  {transportMode === 'car' ? (
                                    <>
                                      <div>
                                        <div className="text-sm text-gray-500">Company</div>
                                        <div>{option.details?.company}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Model</div>
                                        <div>{option.details?.model}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Fuel Type</div>
                                        <div>{option.details?.fuelType}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Fuel Efficiency</div>
                                        <div>{option.details?.mpg} MPG</div>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div>
                                        <div className="text-sm text-gray-500">Company</div>
                                        <div>{option.details?.company}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Duration</div>
                                        <div>{option.duration}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Departure</div>
                                        <div>{option.details?.departureTime}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-gray-500">Arrival</div>
                                        <div>{option.details?.arrivalTime}</div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="bg-gray-50 p-6 flex flex-col justify-center">
                                <Button 
                                  onClick={() => handleOptionSelect('transport', option)}
                                  variant={selectedOptions.transport?.id === option.id ? 'default' : 'outline'}
                                  className="w-full mb-2"
                                >
                                  {selectedOptions.transport?.id === option.id ? 'Selected' : 'Select'}
                                </Button>
                                <Button variant="link" className="text-gray-500">View Details</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  )}
                  
                  {/* Trip Summary Tab */}
                  <TabsContent value="summary">
                    <Card>
                      <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-6">Your Trip Summary</h2>
                        
                        <div className="space-y-6 mb-8">
                          {/* Destination Info */}
                          <div className="flex items-start gap-4">
                            <MapPin size={24} className="text-primary mt-1" />
                            <div>
                              <h3 className="font-semibold text-lg">Destination</h3>
                              <p>From {fromCity} to {destination}</p>
                              <p className="text-gray-600">{dates || 'Flexible Dates'}</p>
                              <p className="text-gray-600">{travelers} {travelers === 1 ? 'Traveler' : 'Travelers'}</p>
                            </div>
                          </div>
                          
                          {/* Flight Selection */}
                          {transportMode === 'flight' && (
                            <div className="flex items-start gap-4">
                              <Plane size={24} className="text-primary mt-1" />
                              <div>
                                <h3 className="font-semibold text-lg">Flight</h3>
                                {selectedOptions.flight ? (
                                  <div>
                                    <p className="font-medium">{selectedOptions.flight.name}</p>
                                    <p className="text-gray-600">{selectedOptions.flight.description}</p>
                                    <p className="text-gray-600">{selectedOptions.flight.details?.airline} • {selectedOptions.flight.duration}</p>
                                    <p className="mt-1 font-semibold text-primary">${selectedOptions.flight.price} per person</p>
                                  </div>
                                ) : (
                                  <p className="text-gray-500">No flight selected</p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Hotel Selection */}
                          {includeHotel && (
                            <div className="flex items-start gap-4">
                              <Hotel size={24} className="text-primary mt-1" />
                              <div>
                                <h3 className="font-semibold text-lg">Hotel</h3>
                                {selectedOptions.hotel ? (
                                  <div>
                                    <p className="font-medium">{selectedOptions.hotel.name}</p>
                                    <p className="text-gray-600">{selectedOptions.hotel.description}</p>
                                    <div className="flex items-center mt-1 mb-1">
                                      {[...Array(5)].map((_, i) => (
                                        <svg 
                                          key={i}
                                          className={`w-4 h-4 ${i < Math.floor(selectedOptions.hotel?.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                                          fill="currentColor" 
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      ))}
                                    </div>
                                    <p className="mt-1 font-semibold text-primary">${selectedOptions.hotel.price} per night</p>
                                  </div>
                                ) : (
                                  <p className="text-gray-500">No hotel selected</p>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Transport Selection */}
                          {transportMode !== 'flight' && (
                            <div className="flex items-start gap-4">
                              {transportMode === 'train' ? (
                                <Train size={24} className="text-primary mt-1" />
                              ) : transportMode === 'bus' ? (
                                <Bus size={24} className="text-primary mt-1" />
                              ) : (
                                <Car size={24} className="text-primary mt-1" />
                              )}
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {transportMode === 'train' ? 'Train' : transportMode === 'bus' ? 'Bus' : 'Car Rental'}
                                </h3>
                                {selectedOptions.transport ? (
                                  <div>
                                    <p className="font-medium">{selectedOptions.transport.name}</p>
                                    <p className="text-gray-600">{selectedOptions.transport.description}</p>
                                    {transportMode !== 'car' && selectedOptions.transport.duration && (
                                      <p className="text-gray-600">{selectedOptions.transport.details?.company} • {selectedOptions.transport.duration}</p>
                                    )}
                                    <p className="mt-1 font-semibold text-primary">
                                      ${selectedOptions.transport.price} {transportMode === 'car' ? 'per day' : 'per person'}
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-gray-500">
                                    No {transportMode === 'train' ? 'train' : transportMode === 'bus' ? 'bus' : 'car rental'} selected
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Price Breakdown */}
                        <div className="border-t pt-4 mb-6">
                          <h3 className="font-semibold text-lg mb-2">Price Breakdown</h3>
                          <div className="space-y-2">
                            {transportMode === 'flight' && selectedOptions.flight && (
                              <div className="flex justify-between">
                                <span>Flight ({travelers} {travelers === 1 ? 'person' : 'people'})</span>
                                <span>${selectedOptions.flight.price} × {travelers} = ${selectedOptions.flight.price * travelers}</span>
                              </div>
                            )}
                            
                            {transportMode !== 'flight' && selectedOptions.transport && (
                              <div className="flex justify-between">
                                <span>
                                  {transportMode === 'train' ? 'Train' : transportMode === 'bus' ? 'Bus' : 'Car Rental'}
                                  {transportMode !== 'car' ? ` (${travelers} ${travelers === 1 ? 'person' : 'people'})` : ` (${days} ${days === 1 ? 'day' : 'days'})`}
                                </span>
                                <span>
                                  ${selectedOptions.transport.price} × {transportMode === 'car' ? days : travelers} = $
                                  {transportMode === 'car' 
                                    ? selectedOptions.transport.price * days
                                    : selectedOptions.transport.price * travelers
                                  }
                                </span>
                              </div>
                            )}
                            
                            {includeHotel && selectedOptions.hotel && (
                              <div className="flex justify-between">
                                <span>Hotel ({days} {days === 1 ? 'night' : 'nights'})</span>
                                <span>${selectedOptions.hotel.price} × {days} = ${selectedOptions.hotel.price * days}</span>
                              </div>
                            )}
                            
                            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                              <span>Total</span>
                              <span>${calculateTotalPrice()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={handleProceedToCheckout}
                          disabled={!canProceedToCheckout()}
                          className="w-full"
                        >
                          Proceed to Checkout
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CustomTripResults;
