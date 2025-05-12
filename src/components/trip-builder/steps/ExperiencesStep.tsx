
import React, { useState } from 'react';
import { ArrowLeft, Star, Users, Clock, Calendar, Tag, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

type ExperienceOption = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  categories: string[];
  date?: string;
};

type ExperiencesStepProps = {
  destination: string;
  startDate?: Date;
  endDate?: Date;
  selectedExperiences?: Array<{
    id: string;
    name: string;
    price: number;
    details: Record<string, any>;
  }>;
  onUpdate: (experiences: Array<{
    id: string;
    name: string;
    price: number;
    details: Record<string, any>;
  }>) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};

// Mock experiences data
const experienceOptions: ExperienceOption[] = [
  {
    id: 'exp1',
    name: 'City Walking Tour',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Discover hidden gems and famous landmarks on this guided walking tour of the city center.',
    price: 40,
    duration: '3 hours',
    rating: 4.8,
    reviewCount: 124,
    categories: ['Historical', 'City', 'Walking']
  },
  {
    id: 'exp2',
    name: 'Local Food Tasting',
    image: 'https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Sample the best local food and drinks at multiple stops with a knowledgeable culinary guide.',
    price: 65,
    duration: '4 hours',
    rating: 4.9,
    reviewCount: 98,
    categories: ['Food', 'Drinks', 'Local Culture']
  },
  {
    id: 'exp3',
    name: 'Sunset Boat Cruise',
    image: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    description: 'Enjoy breathtaking views of the coastline during this relaxing sunset cruise with drinks included.',
    price: 80,
    duration: '2 hours',
    rating: 4.7,
    reviewCount: 76,
    categories: ['Sunset', 'Boat', 'Drinks']
  }
];

const ExperiencesStep: React.FC<ExperiencesStepProps> = ({
  destination,
  startDate,
  endDate,
  selectedExperiences = [],
  onUpdate,
  onBack,
  onSkip
}) => {
  const [selected, setSelected] = useState<string[]>(
    selectedExperiences?.map(exp => exp.id) || []
  );

  const handleToggleExperience = (experience: ExperienceOption) => {
    setSelected(prev => {
      const isSelected = prev.includes(experience.id);
      
      if (isSelected) {
        // Remove from selection
        const updated = prev.filter(id => id !== experience.id);
        
        // Update parent component
        const updatedExperiences = selectedExperiences.filter(exp => exp.id !== experience.id);
        onUpdate(updatedExperiences);
        
        return updated;
      } else {
        // Add to selection
        const updated = [...prev, experience.id];
        
        // Update parent component
        const updatedExperiences = [
          ...selectedExperiences,
          {
            id: experience.id,
            name: experience.name,
            price: experience.price,
            details: experience
          }
        ];
        onUpdate(updatedExperiences);
        
        return updated;
      }
    });
  };

  const getTotalPrice = () => {
    return selected.reduce((total, id) => {
      const experience = experienceOptions.find(exp => exp.id === id);
      return total + (experience?.price || 0);
    }, 0);
  };

  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-center">
        Explore {destination} with These Popular Experiences
      </h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Trip Dates</p>
            <p className="font-medium">
              {startDate ? format(startDate, 'MMM d') : 'TBD'} - {endDate ? format(endDate, 'MMM d, yyyy') : 'TBD'}
            </p>
          </div>
        </div>
      </div>
      
      {selected.length > 0 && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-md mb-6">
          <div className="flex items-center gap-3">
            <Check className="text-green-600" size={20} />
            <div>
              <p className="text-green-800">
                <span className="font-medium">{selected.length}</span> {selected.length === 1 ? 'experience' : 'experiences'} selected
              </p>
              <p className="text-green-600 text-sm">Total: ${getTotalPrice()}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6 mt-6">
        {experienceOptions.map((experience) => (
          <Card key={experience.id}>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 overflow-hidden">
                <div className="aspect-video md:aspect-square relative">
                  <img 
                    src={experience.image} 
                    alt={experience.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center">
                      <Star size={16} className="text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{experience.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({experience.reviewCount})</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 md:col-span-2">
                  <div className="flex flex-col h-full">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{experience.name}</h3>
                        <div className="flex items-center">
                          <Checkbox 
                            id={`select-${experience.id}`}
                            checked={selected.includes(experience.id)}
                            onCheckedChange={() => handleToggleExperience(experience)}
                          />
                          <label htmlFor={`select-${experience.id}`} className="ml-2 text-sm font-medium">
                            Select
                          </label>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {experience.categories.map((category, i) => (
                          <Badge key={i} variant="secondary">{category}</Badge>
                        ))}
                      </div>
                      
                      <p className="text-gray-600 mb-4">{experience.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} />
                          <span>{experience.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={16} />
                          <span>{destination}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-auto flex items-end justify-between pt-4 border-t">
                      <div>
                        {experience.date && (
                          <div className="flex items-center gap-1.5 text-sm">
                            <Calendar size={16} />
                            <span>{experience.date}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-xl">${experience.price}</div>
                        <div className="text-xs text-gray-500">per person</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button 
          variant="tertiary" 
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        
        <div className="ml-auto">
          {selected.length === 0 && (
            <Button 
              variant="ghost"
              onClick={onSkip}
              className="mr-4"
            >
              Skip for now
            </Button>
          )}
          
          <Button 
            onClick={() => {}}
            className="gap-2 min-w-[180px]"
          >
            Complete Trip
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesStep;
