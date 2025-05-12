
import React, { useState } from 'react';
import { Plane, TrainFront, Bus as BusIcon, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import { SeatMapDialog } from '@/components/transportation/SeatMapDialog';

type Transportation = {
  TransportationID: number;
  TransportationName: string;
  Seats: number | null;
  Status: string;
  Created: string;
  Modified: string;
  ModifiedBy: number | null;
  TransportationTypeID: number;
  FromCityID: number;
  ToCityID: number;
  DepartureTime: string;
  ArrivalTime: string;
  Duration: {
    hours: number;
  };
  Price: string;
  Type?: {
    TransportationType: string;
  };
  FromCityName?: string;
  ToCityName?: string;
  TransportationType?: string;
};

type TransportationSectionProps = {
  transportation: Transportation[];
  Flight?: Transportation[];
  Train?: Transportation[];
  Bus?: Transportation[];
  cityName: string;
  userCity?: string;
};

const TransportationSection = ({ Flight = [], Train = [], Bus = [], cityName, userCity }: TransportationSectionProps) => {
  const [selectedTransport, setSelectedTransport] = useState<{
    id: number;
    type: 'flight' | 'train' | 'bus';
    name: string;
    price: number;
    fromCityName: string;
    toCityName: string;
    departureTime: string;
    arrivalTime: string;
  } | null>(null);

  // Format duration in hours and minutes
  const formatDuration = (hours: number) => {
    return hours > 0 ? 
      `${hours}h` : 
      `0h`;
  };

  // Format departure/arrival times
  const formatTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
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

  const openSeatMap = (transport: Transportation, type: 'flight' | 'train' | 'bus') => {
    setSelectedTransport({
      id: transport.TransportationID,
      type,
      name: transport.TransportationName,
      price: parseFloat(transport.Price),
      fromCityName: transport.FromCityName || userCity || '',
      toCityName: transport.ToCityName || cityName || '',
      departureTime: transport.DepartureTime,
      arrivalTime: transport.ArrivalTime
    });
  };

  const renderTransportationItems = (items: Transportation[], icon: React.ReactNode, title: string, type: 'flights' | 'trains' | 'buses') => {
    if (!items || items.length === 0) return null;
    
    // Get the from city for the link (use userCity or the first item's FromCityName)
    const fromCity = userCity || (items[0]?.FromCityName || '');
    
    // Determine the transportation type for seat map
    const seatMapType: 'flight' | 'train' | 'bus' = 
      type === 'flights' ? 'flight' : type === 'trains' ? 'train' : 'bus';
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center">
            {icon} {title}
          </h3>
          <Button variant="link" className="text-primary" asChild>
            <Link 
              to={`/transportation/${type}`} 
              state={{ fromCityName: fromCity, toCityName: cityName }}
            >
              view all
            </Link>
          </Button>
        </div>
        
        <div className="space-y-4">
          {items.map((transport) => (
            <div 
              key={transport.TransportationID} 
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <h4 className="font-medium">{transport.TransportationName}</h4>
                  {transport.FromCityName && (
                    <p className="text-xs text-gray-500 mt-1">
                      From: {transport.FromCityName} to {transport.ToCityName || cityName}
                    </p>
                  )}
                  <div className="text-sm text-gray-600 mt-2">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      <span>{formatDate(transport.DepartureTime)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="text-right mr-2">
                      <div className="font-medium">{formatTime(transport.DepartureTime)}</div>
                    </div>
                    <div className="relative w-20">
                      <div className="absolute top-1/2 w-full h-[1px] bg-gray-300"></div>
                      <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-gray-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="text-left ml-2">
                      <div className="font-medium">{formatTime(transport.ArrivalTime)}</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex justify-center items-center">
                    <Clock size={12} className="mr-1" />
                    {formatDuration(transport.Duration.hours)}
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end">
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      ${transport.Price}
                      <span className="text-xs font-normal text-gray-500">/person</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-4"
                    onClick={() => openSeatMap(transport, seatMapType)}
                  >
                    Select Seats
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-display font-bold">
            Transportation to {cityName}
          </h2>
        </div>
        
        {/* Air Travel */}
        {renderTransportationItems(Flight, <Plane size={20} className="mr-2" />, "Flights", "flights")}
        
        {/* Train Travel */}
        {renderTransportationItems(Train, <TrainFront size={20} className="mr-2" />, "Trains", "trains")}
        
        {/* Bus Travel */}
        {renderTransportationItems(Bus, <BusIcon size={20} className="mr-2" />, "Buses", "buses")}
        
        {/* Seat Map Dialog */}
        {selectedTransport && (
          <SeatMapDialog
            isOpen={!!selectedTransport}
            onOpenChange={(open) => !open && setSelectedTransport(null)}
            transportationId={selectedTransport.id}
            transportationType={selectedTransport.type}
            transportationName={selectedTransport.name}
            transportationPrice={selectedTransport.price}
            fromCityName={selectedTransport.fromCityName}
            toCityName={selectedTransport.toCityName}
            departureTime={selectedTransport.departureTime}
            arrivalTime={selectedTransport.arrivalTime}
          />
        )}
      </div>
    </section>
  );
};

export default TransportationSection;
