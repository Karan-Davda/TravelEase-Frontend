
import React from 'react';
import { ArrowRight, ArrowLeft, Star, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

type TourGuideOption = {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: string;
  languages: string[];
  specialty: string;
  description: string;
};

type TourGuideStepProps = {
  destination: string;
  startDate?: Date;
  endDate?: Date;
  selectedGuide?: {
    id: string;
    name: string;
    price: number;
    rating: number;
    languages: string[];
    specialty: string;
  };
  onUpdate: (guide: { id: string; name: string; price: number; rating: number; languages: string[]; specialty: string }) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};

// Mock tour guide options
const tourGuideOptions: TourGuideOption[] = [
  {
    id: 'g1',
    name: 'Carlos Rodriguez',
    price: 95,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format',
    languages: ['English', 'Spanish'],
    specialty: 'City Tours',
    description: 'Experienced guide specializing in historical city tours and cultural experiences.',
  },
  {
    id: 'g2',
    name: 'Maria Chen',
    price: 85,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format',
    languages: ['English', 'Mandarin', 'Japanese'],
    specialty: 'Food Tours',
    description: 'Culinary expert who knows all the hidden gems for authentic local cuisine.',
  },
  {
    id: 'g3',
    name: 'Ahmed Hassan',
    price: 110,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format',
    languages: ['English', 'Arabic', 'French'],
    specialty: 'Adventure Tours',
    description: 'Adventure specialist with extensive knowledge of outdoor activities and natural landscapes.',
  },
];

const TourGuideStep: React.FC<TourGuideStepProps> = ({
  destination,
  startDate,
  endDate,
  selectedGuide,
  onUpdate,
  onNext,
  onBack,
  onSkip,
}) => {
  const handleSelectGuide = (guide: TourGuideOption) => {
    onUpdate({
      id: guide.id,
      name: guide.name,
      price: guide.price,
      rating: guide.rating,
      languages: guide.languages,
      specialty: guide.specialty,
    });
  };

  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 text-center">
        Would you like to add a tour guide?
      </h2>
      
      <p className="text-center text-gray-500 mb-6">
        Enhance your trip to {destination} with a knowledgeable local guide (optional)
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {tourGuideOptions.map((guide) => (
          <div 
            key={guide.id}
            className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all ${
              selectedGuide?.id === guide.id ? 'border-primary ring-1 ring-primary' : 'border-gray-200'
            }`}
            onClick={() => handleSelectGuide(guide)}
          >
            <div className="aspect-square relative">
              <img 
                src={guide.image} 
                alt={guide.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold">{guide.name}</h3>
                <div className="flex items-center">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="ml-1">{guide.rating}</span>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Award size={14} className="mr-1" />
                <span>{guide.specialty}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Globe size={14} className="mr-1" />
                <span>{guide.languages.join(', ')}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {guide.description}
              </p>
              
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-lg font-bold text-primary">${guide.price}</div>
                  <div className="text-xs text-gray-500">per day</div>
                </div>
                
                <Button 
                  size="sm" 
                  variant={selectedGuide?.id === guide.id ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectGuide(guide);
                  }}
                >
                  {selectedGuide?.id === guide.id ? 'Selected' : 'Select'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center mt-4 mb-8">
        <p className="text-sm text-gray-500 mb-2">Don't need a guide? Continue without one.</p>
        <Button variant="ghost" size="sm" onClick={onSkip}>
          Skip this step
        </Button>
      </div>

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
          disabled={!selectedGuide}
          className="min-w-[120px]"
        >
          Next <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default TourGuideStep;
