
import React from 'react';
import { Plane, TrainFront, Bus, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Transportation } from '@/services/transportationService';

interface TransportationCardV2Props {
  transportation: Transportation;
  onSelect?: () => void;
  isSelected?: boolean;
}

export const TransportationCardV2 = ({ 
  transportation, 
  onSelect,
  isSelected = false
}: TransportationCardV2Props) => {
  if (!transportation) {
    console.error('TransportationCardV2: transportation is undefined or null');
    return null; // Don't render anything if transportation is undefined
  }

  // Safe accessor functions to prevent errors
  const getTransportationName = () => transportation?.TransportationName || 'Unknown';
  const getPrice = () => transportation?.Price || '0';
  const getFromCity = () => transportation?.FromCityName || 'Unknown';
  const getToCity = () => transportation?.ToCityName || 'Unknown';

  // Safe time formatters
  const formatTime = (dateString: string | undefined) => {
    if (!dateString) return 'TBD';
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (error) {
      console.error('Error formatting time:', error, dateString);
      return 'Invalid Time';
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'TBD';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid Date';
    }
  };

  // Format duration safely
  const formatDuration = () => {
    const hours = transportation?.Duration?.hours;
    if (hours === undefined) return 'Unknown';
    return hours > 0 ? `${hours}h` : '0h';
  };

  // Determine transportation icon and details
  const getTransportationDetails = () => {
    const typeId = transportation.TransportationTypeID || 0;
    const typeName = transportation.TransportationType || '';
    
    // Default values
    let icon = <Bus className="mr-2" size={20} />;
    let className = 'Standard';
    let stops = 'Direct';
    
    // Check type to assign proper icon and class
    if (typeId === 1 || typeName.toLowerCase().includes('airplane') || typeName.toLowerCase().includes('flight')) {
      icon = <Plane className="mr-2" size={20} />;
      className = transportation.Class || 'Economy';
      stops = transportation.Stops ? `${transportation.Stops} Stop` : 'Direct';
    } else if (typeId === 2 || typeName.toLowerCase().includes('train')) {
      icon = <TrainFront className="mr-2" size={20} />;
      className = transportation.Class || 'Standard';
    }
    
    return { icon, className, stops };
  };

  const details = getTransportationDetails();

  return (
    <Card className={`mb-4 hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary' : ''}`} onClick={onSelect}>
      <CardContent className="p-4 sm:p-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Provider Information */}
          <div className="md:col-span-3">
            <div className="flex items-center">
              {details.icon}
              <h4 className="font-semibold text-lg">{getTransportationName()}</h4>
            </div>
            <p className="text-sm text-gray-600">
              {details.className}, {details.stops}
            </p>
            <div className="text-sm text-gray-600 mt-2 flex items-center">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(transportation.DepartureTime)}</span>
            </div>
          </div>
          
          {/* Time Information */}
          <div className="md:col-span-6">
            <div className="flex items-center justify-between">
              <div className="text-center">
                <div className="font-medium text-lg">{formatTime(transportation.DepartureTime)}</div>
                <div className="text-sm text-gray-500">{getFromCity()}</div>
              </div>
              
              <div className="flex-1 mx-2 sm:mx-4">
                <div className="relative">
                  <div className="border-t border-gray-300"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatDuration()}
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-medium text-lg">{formatTime(transportation.ArrivalTime)}</div>
                <div className="text-sm text-gray-500">{getToCity()}</div>
              </div>
            </div>
          </div>
          
          {/* Price & Action */}
          <div className="md:col-span-3 flex flex-col md:items-end gap-2">
            <div className="text-right">
              <div className="font-bold text-xl">${getPrice()}</div>
              <div className="text-xs text-gray-500">per person</div>
            </div>
            {onSelect && (
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect();
                }}
                variant={isSelected ? "default" : "outline"}
              >
                {isSelected ? "Selected" : "Select"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransportationCardV2;
