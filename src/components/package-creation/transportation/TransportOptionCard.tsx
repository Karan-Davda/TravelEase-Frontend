
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transportation } from '@/services/transportationService';
import { format, parseISO } from 'date-fns';

interface TransportOptionCardProps {
  transportation: Transportation;
  isSelected: boolean;
  onSelect: () => void;
}

const TransportOptionCard = ({ 
  transportation, 
  isSelected, 
  onSelect 
}: TransportOptionCardProps) => {
  // Format departure/arrival times
  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (error) {
      console.error('Error formatting time:', error);
      return dateString;
    }
  };

  // Format duration in hours
  const formatDuration = (hours: number) => {
    return hours > 0 ? `${hours}h` : '0h';
  };

  // Determine transportation type
  const getTransportDetails = () => {
    // First check based on explicit TransportationType
    if (transportation.TransportationType === 'Airplane' || 
        transportation.TransportationTypeID === 1) {
      return {
        class: transportation.Class || 'Economy Class',
        isDirectOrStops: transportation.Stops ? `${transportation.Stops} Stop` : 'Direct',
        provider: transportation.Airline || transportation.TransportationName,
      };
    } else if (transportation.TransportationType === 'Train' || 
               transportation.TransportationTypeID === 2) {
      return {
        class: transportation.Class || 'Standard',
        isDirectOrStops: transportation.Stops ? `${transportation.Stops} Stop` : 'Direct',
        provider: transportation.TransportationName,
      };
    } else {
      return {
        class: transportation.Class || 'Standard',
        isDirectOrStops: transportation.Stops ? `${transportation.Stops} Stop` : 'Direct',
        provider: transportation.TransportationName,
      };
    }
  };

  const details = getTransportDetails();

  return (
    <Card className={`mb-4 hover:shadow-md transition-shadow cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`} onClick={onSelect}>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Provider Information */}
          <div>
            <h4 className="font-semibold text-lg">{details.provider}</h4>
            <p className="text-sm text-gray-600">
              {details.class}, {details.isDirectOrStops}
            </p>
            <div className="text-sm text-gray-600 mt-2 flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{format(parseISO(transportation.DepartureTime), 'MMM d, yyyy')}</span>
            </div>
          </div>
          
          {/* Time Information */}
          <div className="col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="font-medium text-lg">{formatTime(transportation.DepartureTime)}</div>
                <div className="text-sm text-gray-500">{transportation.FromCityName}</div>
              </div>
              
              <div className="flex-1 mx-4">
                <div className="relative">
                  <div className="border-t border-gray-300"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatDuration(transportation.Duration.hours)}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-medium text-lg">{formatTime(transportation.ArrivalTime)}</div>
                <div className="text-sm text-gray-500">{transportation.ToCityName}</div>
              </div>
            </div>
          </div>
          
          {/* Price & Action */}
          <div className="flex flex-col md:items-end gap-2">
            <div className="text-right">
              <div className="font-bold text-xl">${transportation.Price}</div>
              <div className="text-xs text-gray-500">per person</div>
            </div>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              variant={isSelected ? "default" : "outline"}
            >
              {isSelected ? "Selected" : "Select"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportOptionCard;
