import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Star, Filter, Search, Wifi, Coffee, Waves, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { format } from 'date-fns';
import { useAccommodations } from '@/hooks/useAccommodations';

type AccommodationOption = {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
};

type AccommodationStepProps = {
  destination: string;
  origin?: string;
  startDate?: Date;
  endDate?: Date;
  travelers: number;
  selectedAccommodation?: {
    id: string;
    name: string;
    price: number;
    rating: number;
    amenities: string[];
  };
  onUpdate: (accommodation: { id: string; name: string; price: number; rating: number; amenities: string[] }) => void;
  onNext: () => void;
  onBack: () => void;
};

// Mock accommodation options will be replaced with API data
const mockAccommodationOptions: AccommodationOption[] = [
  {
    id: 'h1',
    name: 'Grand Hotel',
    price: 189,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format',
    amenities: ['Free WiFi', 'Breakfast included', 'Pool', 'Fitness center'],
  },
  {
    id: 'h2',
    name: 'City Suites',
    price: 149,
    rating: 4.2,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=300&auto=format',
    amenities: ['Free WiFi', 'Restaurant', 'Parking'],
  },
  {
    id: 'h3',
    name: 'Boutique Inn',
    price: 120,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?q=80&w=300&auto=format',
    amenities: ['Free WiFi', 'Breakfast included', 'Parking'],
  },
  {
    id: 'h4',
    name: 'Luxury Resort & Spa',
    price: 299,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=300&auto=format',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Fitness center'],
  },
];

const AccommodationStep: React.FC<AccommodationStepProps> = ({
  destination,
  origin,
  startDate,
  endDate,
  travelers,
  selectedAccommodation,
  onUpdate,
  onNext,
  onBack,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 500]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
  
  // Format dates for API call
  const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
  const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;
  
  // Use the updated accommodation hook with the new search parameters
  const { accommodations, isLoading, error } = useAccommodations({
    fromCity: origin || destination, // If no origin is provided, use destination as both
    toCity: destination,
    fromDate: formattedStartDate,
    toDate: formattedEndDate
  });
  
  const toggleAmenityFilter = (amenity: string) => {
    setAmenityFilters(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };
  
  // Filter accommodations based on UI filters
  const filteredOptions = accommodations
    .filter(option => {
      // Price filter (convert string to number)
      const price = parseFloat(option.PricePerNight);
      const priceInRange = price >= priceRange[0] && price <= priceRange[1];
      
      // Name/text filter
      const nameMatch = option.AccommodationName.toLowerCase().includes(searchFilter.toLowerCase());
      
      // Amenity filters (would need proper amenity data from API)
      // For now, we'll assume all meet amenity requirements since API doesn't provide amenities
      
      return priceInRange && nameMatch;
    })
    .map(option => ({
      id: option.AccommodationID.toString(),
      name: option.AccommodationName,
      price: parseFloat(option.PricePerNight),
      rating: parseFloat(option.Rating),
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=300&auto=format', // Placeholder image
      amenities: ['Free WiFi', 'Parking'] // Placeholder amenities
    }));
  
  const handleSelectAccommodation = (accommodation: AccommodationOption) => {
    onUpdate({
      id: accommodation.id,
      name: accommodation.name,
      price: accommodation.price,
      rating: accommodation.rating,
      amenities: accommodation.amenities,
    });
  };

  const isNextDisabled = !selectedAccommodation;
  
  const calculateTotalPrice = (price: number) => {
    if (!startDate || !endDate) return price;
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return price * nights;
  };

  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-center">
        Choose your accommodation in {destination}
      </h2>
      
      {startDate && endDate && (
        <p className="text-center text-gray-500 mb-6">
          {format(startDate, "MMM d, yyyy")} - {format(endDate, "MMM d, yyyy")} •{' '}
          {Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} nights •{' '}
          {travelers} {travelers === 1 ? 'guest' : 'guests'}
        </p>
      )}
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search accommodations, amenities..."
            className="pl-10"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Filters</h3>
          <Button variant="ghost" size="sm" onClick={() => setFilterOpen(!filterOpen)}>
            {filterOpen ? 'Hide Filters' : 'Show Filters'} <Filter size={16} className="ml-1" />
          </Button>
        </div>

        {filterOpen && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="mb-4">
              <h4 className="font-medium mb-2">Price per night</h4>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  min={0}
                  max={500}
                  step={10}
                  onValueChange={setPriceRange}
                />
                <div className="flex justify-between mt-2 text-sm text-gray-500">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Amenities</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="amenity-wifi" 
                    checked={amenityFilters.includes('wifi')}
                    onCheckedChange={() => toggleAmenityFilter('wifi')}
                  />
                  <label htmlFor="amenity-wifi" className="flex items-center">
                    <Wifi size={16} className="mr-1" /> WiFi
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="amenity-breakfast" 
                    checked={amenityFilters.includes('breakfast')}
                    onCheckedChange={() => toggleAmenityFilter('breakfast')}
                  />
                  <label htmlFor="amenity-breakfast" className="flex items-center">
                    <Coffee size={16} className="mr-1" /> Breakfast
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="amenity-pool" 
                    checked={amenityFilters.includes('pool')}
                    onCheckedChange={() => toggleAmenityFilter('pool')}
                  />
                  <label htmlFor="amenity-pool" className="flex items-center">
                    <Waves size={16} className="mr-1" /> Pool
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-500">Loading accommodations...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">Failed to load accommodations. Please try again.</p>
        </div>
      ) : filteredOptions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No accommodations found. Please adjust your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {filteredOptions.map((option) => (
            <div 
              key={option.id}
              className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all ${
                selectedAccommodation?.id === option.id ? 'border-primary ring-1 ring-primary' : 'border-gray-200'
              }`}
              onClick={() => handleSelectAccommodation(option)}
            >
              <div className="aspect-video relative">
                <img 
                  src={option.image} 
                  alt={option.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold">{option.name}</h3>
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="ml-1">{option.rating}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-500 mb-2">
                  {option.amenities.slice(0, 3).join(' • ')}
                  {option.amenities.length > 3 && ' • ...'}
                </div>
                
                <div className="flex justify-between items-end mt-2">
                  <div>
                    <div className="text-lg font-bold text-primary">${option.price}</div>
                    <div className="text-xs text-gray-500">per night</div>
                  </div>
                  
                  {startDate && endDate && (
                    <div className="text-right">
                      <div className="text-sm font-medium">${calculateTotalPrice(option.price)}</div>
                      <div className="text-xs text-gray-500">total</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Button 
          onClick={onNext}
          disabled={isNextDisabled}
          className="min-w-[120px]"
        >
          Next <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default AccommodationStep;
