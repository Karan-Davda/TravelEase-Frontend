
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Wallet, Hotel, Plane, Train, Bus, Car } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import FeatureCard from '@/components/sections/FeatureCard';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const FindMyPerfectTrip = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState([2000]);
  const [includeHotel, setIncludeHotel] = useState(true);
  const [transportMode, setTransportMode] = useState('flight');
  const [interests, setInterests] = useState<string[]>([]);
  
  const interestOptions = [
    'Beach', 'Mountains', 'City', 'Culture', 'Food', 'Adventure', 'Relaxation', 'Nature'
  ];

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build search parameters
    const searchParams = new URLSearchParams({
      destination,
      date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
      travelers: travelers.toString(),
      budget: budget[0].toString(),
      includeHotel: includeHotel.toString(),
      transportMode,
      interests: interests.join(',')
    });
    
    navigate(`/custom-trip/results?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Find Your Perfect Travel Experience"
        subtitle="Tell us what you're looking for and we'll create the ideal trip just for you."
        ctaText="Start Exploring"
        ctaLink="#trip-finder"
        backgroundImage="https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?q=80&w=2070"
      />
      
      {/* Trip Finder Form */}
      <section id="trip-finder" className="py-16 scroll-mt-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Trip Finder</h2>
            <p className="text-gray-600">
              Answer a few questions and we'll match you with your dream destination and travel itinerary.
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto shadow-lg border-0">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit}>
                <div className="space-y-8">
                  {/* Destination */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Where would you like to go?</h3>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <Input 
                        placeholder="Enter a destination or 'Anywhere'"
                        className="pl-10"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">When would you like to travel?</h3>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  {/* Travelers */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">How many travelers?</h3>
                    <div className="flex items-center gap-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => setTravelers(prev => Math.max(1, prev - 1))}
                      >
                        -
                      </Button>
                      <div className="flex items-center gap-2">
                        <Users size={18} className="text-gray-600" />
                        <span className="font-medium">{travelers} {travelers === 1 ? 'Person' : 'People'}</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => setTravelers(prev => prev + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  
                  {/* Budget */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold">What's your budget?</h3>
                      <span className="font-medium text-primary">${budget[0].toLocaleString()}</span>
                    </div>
                    <div className="px-1">
                      <Slider
                        defaultValue={[2000]}
                        max={10000}
                        min={500}
                        step={100}
                        value={budget}
                        onValueChange={setBudget}
                      />
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <span>$500</span>
                        <span>$10,000</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Accommodation & Transport */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Include Hotel */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Include accommodation?</h3>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300"
                          checked={includeHotel}
                          onChange={() => setIncludeHotel(!includeHotel)}
                        />
                        <div className="ml-2 flex items-center gap-2">
                          <Hotel size={18} className="text-gray-600" />
                          <span>Include Hotel in Search</span>
                        </div>
                      </label>
                    </div>
                    
                    {/* Transport Mode */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Preferred transport:</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <label className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer ${transportMode === 'flight' ? 'bg-primary/10 border-primary' : 'border-gray-200'}`}>
                          <input
                            type="radio"
                            name="transportMode"
                            className="sr-only"
                            value="flight"
                            checked={transportMode === 'flight'}
                            onChange={() => setTransportMode('flight')}
                          />
                          <Plane size={18} className={transportMode === 'flight' ? 'text-primary' : 'text-gray-600'} />
                          <span>Flight</span>
                        </label>
                        <label className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer ${transportMode === 'train' ? 'bg-primary/10 border-primary' : 'border-gray-200'}`}>
                          <input
                            type="radio"
                            name="transportMode"
                            className="sr-only"
                            value="train"
                            checked={transportMode === 'train'}
                            onChange={() => setTransportMode('train')}
                          />
                          <Train size={18} className={transportMode === 'train' ? 'text-primary' : 'text-gray-600'} />
                          <span>Train</span>
                        </label>
                        <label className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer ${transportMode === 'bus' ? 'bg-primary/10 border-primary' : 'border-gray-200'}`}>
                          <input
                            type="radio"
                            name="transportMode"
                            className="sr-only"
                            value="bus"
                            checked={transportMode === 'bus'}
                            onChange={() => setTransportMode('bus')}
                          />
                          <Bus size={18} className={transportMode === 'bus' ? 'text-primary' : 'text-gray-600'} />
                          <span>Bus</span>
                        </label>
                        <label className={`border rounded-lg p-3 flex items-center gap-2 cursor-pointer ${transportMode === 'car' ? 'bg-primary/10 border-primary' : 'border-gray-200'}`}>
                          <input
                            type="radio"
                            name="transportMode"
                            className="sr-only"
                            value="car"
                            checked={transportMode === 'car'}
                            onChange={() => setTransportMode('car')}
                          />
                          <Car size={18} className={transportMode === 'car' ? 'text-primary' : 'text-gray-600'} />
                          <span>Car</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Interests */}
                  <div>
                    <h3 className="text-xl font-semibold mb-4">What interests you? (Optional)</h3>
                    <div className="flex flex-wrap gap-2">
                      {interestOptions.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`py-2 px-4 rounded-full text-sm ${
                            interests.includes(interest)
                              ? 'bg-accent text-white'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Submit */}
                  <div className="pt-4">
                    <Button type="submit" className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white">
                      Find My Perfect Trip
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Why Use Trip Finder */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Why Use Our Trip Finder?
            </h2>
            <p className="text-lg text-gray-600">
              Our smart algorithm matches you with destinations and experiences you'll love
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="Personalized Recommendations"
              description="Get customized trip suggestions based on your preferences, interests, and budget."
              icon={MapPin}
              iconColor="#0694a2"
            />
            <FeatureCard
              title="Save Time & Money"
              description="Skip hours of research and find the best deals across flights, hotels, and activities in one place."
              icon={Wallet}
              iconColor="#0694a2"
            />
            <FeatureCard
              title="Discover Hidden Gems"
              description="Uncover unique destinations and experiences that match your travel style perfectly."
              icon={MapPin}
              iconColor="#0694a2"
            />
          </div>
        </div>
      </section>
      
      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-primary mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <blockquote className="text-xl md:text-2xl text-gray-800 mb-6 font-display">
              "Done," Sarah Johnson smiled proudly, closing her laptop. "I just finished planning my Las Vegas vacation with TravelEase. It only took me a few minutes to decide whether I wanted a custom plan or a pre-arranged package—so convenient! TravelEase took all the confusing bits of travel planning and turned them into a clear, flexible experience. I'm officially hooked."
            </blockquote>
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-300 mr-3">
                <div className="h-full w-full bg-gray-300"></div>
              </div>
              <div>
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-sm text-gray-600">Traveler, New York</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default FindMyPerfectTrip;
