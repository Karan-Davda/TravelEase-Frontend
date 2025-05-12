
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { Accommodation } from '@/hooks/useAccommodations';

interface AccommodationCardProps {
  accommodation: Accommodation;
  isSelected: boolean;
  onSelect: () => void;
  cityName: string;
}

const AccommodationCard = ({ 
  accommodation, 
  isSelected, 
  onSelect,
  cityName
}: AccommodationCardProps) => {
  return (
    <Card className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`} onClick={onSelect}>
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
            <Button 
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccommodationCard;
