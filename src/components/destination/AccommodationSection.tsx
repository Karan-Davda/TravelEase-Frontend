
import React from 'react';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Accommodation = {
  AccommodationID: number;
  AccommodationName: string;
  Address: string;
  Email: string;
  Phone: string;
  Rooms: number;
  Status: string;
  Created: string;
  Modified: string;
  ModifiedBy: number;
  AccommodationTypeID: number;
  CityID: number;
  Rating: string;
  PricePerNight: string;
  Description: string;
};

type AccommodationSectionProps = {
  accommodations: Accommodation[];
  cityName: string;
};

const AccommodationSection = ({ accommodations, cityName }: AccommodationSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold">
            Stay in {cityName}
          </h2>
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            View all <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((accommodation) => (
            <Card key={accommodation.AccommodationID} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{accommodation.AccommodationName}</h3>
                    <div className="flex items-center bg-primary/10 px-2 py-1 rounded">
                      <Star size={14} className="text-primary fill-primary" />
                      <span className="ml-1 text-sm font-medium">{accommodation.Rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{accommodation.Description}</p>
                  <p className="text-gray-500 text-sm flex items-start mb-4">
                    <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0" />
                    <span>{accommodation.Address}, {cityName}</span>
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="font-bold">
                      ${accommodation.PricePerNight}
                      <span className="text-xs font-normal text-gray-500">/night</span>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AccommodationSection;
