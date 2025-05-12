
import React, { useState } from 'react';
import { MapPin, Search, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DestinationStepProps = {
  fromCity: string;
  destination: string;
  onUpdate: (data: {fromCity?: string, destination?: string}) => void;
  onNext: () => void;
};

const popularDestinations = [
  { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=500&auto=format' },
  { name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=500&auto=format' },
  { name: 'New York, USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=500&auto=format' },
  { name: 'Rome, Italy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=500&auto=format' },
  { name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=500&auto=format' },
  { name: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=500&auto=format' },
];

const DestinationStep: React.FC<DestinationStepProps> = ({ fromCity, destination, onUpdate, onNext }) => {
  const [fromCityInput, setFromCityInput] = useState(fromCity);
  const [destinationInput, setDestinationInput] = useState(destination);
  const isNextDisabled = !fromCityInput.trim() || !destinationInput.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNextDisabled) {
      onUpdate({ fromCity: fromCityInput, destination: destinationInput });
      handleNext(e);
    }
  };

  const handleNext = (e: React.MouseEvent | React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    const currentPosition = window.scrollY;
    
    setTimeout(() => {
      onUpdate({ fromCity: fromCityInput, destination: destinationInput });
      onNext();
      window.scrollTo(0, currentPosition);
    }, 50);
    
    return false;
  };

  const selectDestination = (dest: string) => {
    setDestinationInput(dest);
    onUpdate({ destination: dest });
  };

  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-center">
        Where would you like to go?
      </h2>
      
      <div className="max-w-xl mx-auto">
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <div>
            <label htmlFor="fromCity" className="block text-sm font-medium text-gray-700 mb-1">
              From City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                id="fromCity"
                placeholder="Your departure city"
                className="pl-10 py-6 text-lg"
                value={fromCityInput}
                onChange={(e) => setFromCityInput(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              To City
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                id="destination"
                placeholder="Enter destination city or country"
                className="pl-10 py-6 text-lg"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                required
              />
              <Button 
                type="submit"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                disabled={isNextDisabled}
              >
                <Search size={18} />
              </Button>
            </div>
          </div>
        </form>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Popular destinations</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularDestinations.map((dest, index) => (
              <div 
                key={index}
                className={`rounded-lg overflow-hidden cursor-pointer transition-all hover:shadow-md ${
                  destinationInput === dest.name ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => selectDestination(dest.name)}
              >
                <div className="relative h-32">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-2">
                    <span className="text-white font-medium text-sm">{dest.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleNext}
          disabled={isNextDisabled}
          className="min-w-[120px]"
        >
          Next <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DestinationStep;
