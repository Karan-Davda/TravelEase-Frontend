
import React, { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Seat, seatService } from '@/services/seatService';
import { useToast } from '@/hooks/use-toast';
import { FlightSeatLayout } from './seat-layouts/FlightSeatLayout';
import { TrainSeatLayout } from './seat-layouts/TrainSeatLayout';
import { BusSeatLayout } from './seat-layouts/BusSeatLayout';

interface SeatMapProps {
  transportationId: number;
  transportationType: 'flight' | 'bus' | 'train';
  onConfirmSeats?: (selectedSeats: Seat[]) => void;
  onCancel?: () => void;
  // Add additional props for transportation details
  transportationPrice?: number;
  fromCityName?: string;
  toCityName?: string;
  departureTime?: string;
  arrivalTime?: string;
}

export const SeatMap = ({ 
  transportationId, 
  transportationType, 
  onConfirmSeats, 
  onCancel,
  transportationPrice = 0,
  fromCityName = '',
  toCityName = '',
  departureTime = '',
  arrivalTime = ''
}: SeatMapProps) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const { toast } = useToast();

  // Debug the transportation type
  useEffect(() => {
    console.log('SeatMap rendered with type:', transportationType);
    console.log('SeatMap transportation price:', transportationPrice);
  }, [transportationType, transportationPrice]);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await seatService.getSeats(transportationId);
        
        // If seats have no price, assign the transportation price
        if (transportationPrice > 0) {
          const seatsWithPrice = response.seats.map(seat => ({
            ...seat,
            price: seat.price || transportationPrice
          }));
          setSeats(seatsWithPrice);
        } else {
          setSeats(response.seats);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load seat map');
        toast({
          title: 'Error',
          description: 'Failed to load seat map. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [transportationId, transportationPrice, toast]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.Status === 'Booked') return;

    // Check if seat is already selected
    const isSelected = selectedSeats.some((s) => s.SeatNumber === seat.SeatNumber);

    if (isSelected) {
      // Deselect the seat
      setSelectedSeats(selectedSeats.filter((s) => s.SeatNumber !== seat.SeatNumber));
    } else {
      // Select the seat with price
      setSelectedSeats([...selectedSeats, { 
        ...seat, 
        Status: 'Selected',
        price: seat.price || transportationPrice
      }]);
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: 'No seats selected',
        description: 'Please select at least one seat to continue.',
        variant: 'destructive',
      });
      return;
    }

    if (onConfirmSeats) {
      onConfirmSeats(selectedSeats);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading seat map...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <CircleX className="mx-auto mb-2 text-red-500" size={32} />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Render the appropriate layout based on transportationType
  const renderSeatLayout = () => {
    console.log('Rendering seat layout for type:', transportationType);
    
    switch (transportationType) {
      case 'flight':
        return <FlightSeatLayout 
          seats={seats} 
          selectedSeats={selectedSeats} 
          onSeatClick={handleSeatClick} 
        />;
      case 'train':
        return <TrainSeatLayout 
          seats={seats} 
          selectedSeats={selectedSeats} 
          onSeatClick={handleSeatClick} 
        />;
      case 'bus':
        return <BusSeatLayout 
          seats={seats} 
          selectedSeats={selectedSeats} 
          onSeatClick={handleSeatClick} 
        />;
      default:
        return <div className="text-center">Invalid transportation type</div>;
    }
  };

  // Calculate total price
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + (seat.price || transportationPrice), 0);

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Select Your Seats</h2>
        <p className="text-gray-500 text-sm mb-4">
          Click on available seats to select them. Booked seats cannot be selected.
        </p>
        
        <div className="flex gap-6 mb-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-teal-500 rounded mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span>Booked</span>
          </div>
        </div>
      </div>
      
      <div className="max-h-[60vh] overflow-y-auto p-2">
        {renderSeatLayout()}
      </div>
      
      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <div>
          <p className="font-medium">
            Selected: {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'}
          </p>
          {selectedSeats.length > 0 && (
            <>
              <p className="text-sm text-gray-500">
                {selectedSeats.map(seat => seat.SeatNumber).join(', ')}
              </p>
              <p className="text-sm font-medium text-primary mt-1">
                Total: ${totalPrice.toFixed(2)}
              </p>
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm Selection</Button>
        </div>
      </div>
    </div>
  );
};
