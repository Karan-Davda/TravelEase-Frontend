
import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Transportation } from '@/services/transportationService';
import { SeatMapDialog } from '@/components/transportation/SeatMapDialog';

interface TransportationCardProps {
  transportation: Transportation;
}

export const TransportationCard = ({ transportation }: TransportationCardProps) => {
  const [seatMapOpen, setSeatMapOpen] = useState(false);

  // Format departure/arrival times
  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (error) {
      console.error('Error formatting time:', error);
      return dateString;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
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
        type: 'flight' as const
      };
    } else if (transportation.TransportationType === 'Train' || 
               transportation.TransportationTypeID === 2) {
      return {
        class: transportation.Class || 'Standard',
        isDirectOrStops: transportation.Stops ? `${transportation.Stops} Stop` : 'Direct',
        provider: transportation.TransportationName,
        type: 'train' as const
      };
    } else {
      return {
        class: transportation.Class || 'Standard',
        isDirectOrStops: transportation.Stops ? `${transportation.Stops} Stop` : 'Direct',
        provider: transportation.TransportationName,
        type: 'bus' as const
      };
    }
  };

  const details = getTransportDetails();
  
  // Debug transportation details
  console.log('TransportationCard - details:', { 
    id: transportation.TransportationID,
    name: transportation.TransportationName,
    type: details.type,
    typeID: transportation.TransportationTypeID,
    transportationType: transportation.TransportationType,
    price: transportation.Price,
    fromCity: transportation.FromCityName,
    toCity: transportation.ToCityName,
    departure: transportation.DepartureTime,
    arrival: transportation.ArrivalTime
  });

  return (
    <>
      <Card className="mb-4 hover:shadow-md transition-shadow">
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
                <span>{formatDate(transportation.DepartureTime)}</span>
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
              <Button onClick={() => setSeatMapOpen(true)}>Select</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Seat Map Dialog */}
      <SeatMapDialog
        isOpen={seatMapOpen}
        onOpenChange={setSeatMapOpen}
        transportationId={transportation.TransportationID}
        transportationType={details.type}
        transportationName={details.provider}
        transportationPrice={parseFloat(transportation.Price)}
        fromCityName={transportation.FromCityName}
        toCityName={transportation.ToCityName}
        departureTime={transportation.DepartureTime}
        arrivalTime={transportation.ArrivalTime}
      />
    </>
  );
};
