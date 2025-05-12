
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from '@/components/ui/dialog';
import { SeatMap } from '@/components/transportation/SeatMap';
import { Seat } from '@/services/seatService';
import { useToast } from '@/hooks/use-toast';

interface SeatMapDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transportationId: number;
  transportationType: 'flight' | 'bus' | 'train';
  transportationName: string;
  transportationPrice?: number;
  fromCityName?: string; 
  toCityName?: string; 
  departureTime?: string;
  arrivalTime?: string;
}

export const SeatMapDialog = ({
  isOpen,
  onOpenChange,
  transportationId,
  transportationType,
  transportationName,
  transportationPrice = 0,
  fromCityName = '',
  toCityName = '',
  departureTime = '',
  arrivalTime = ''
}: SeatMapDialogProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Add debug logging to verify the transportation details
  console.log('SeatMapDialog - transportationType:', transportationType);
  console.log('SeatMapDialog - transportationId:', transportationId);
  console.log('SeatMapDialog - transportationName:', transportationName);
  console.log('SeatMapDialog - transportationPrice:', transportationPrice);
  console.log('SeatMapDialog - fromCityName:', fromCityName);
  console.log('SeatMapDialog - toCityName:', toCityName);
  console.log('SeatMapDialog - departureTime:', departureTime);
  console.log('SeatMapDialog - arrivalTime:', arrivalTime);

  const handleConfirmSeats = (selectedSeats: Seat[]) => {
    // In a real app, you would submit the selected seats to your API
    console.log('Selected seats:', selectedSeats);
    
    // Calculate the total price - use the seat prices, not the transportation price
    const totalSeatsPrice = selectedSeats.reduce((total, seat) => total + (seat.price || transportationPrice), 0);
    const pricePerSeat = totalSeatsPrice / selectedSeats.length;
    
    toast({
      title: 'Seats selected',
      description: `You've selected ${selectedSeats.length} seats for ${transportationName}`,
    });
    
    // Close the dialog
    onOpenChange(false);
    
    // Navigate to checkout page with transportation and seat information
    navigate('/booking-checkout', { 
      state: { 
        transportationId,
        transportationType,
        transportationName,
        selectedSeats,
        transportationPrice: pricePerSeat, // Price per seat
        totalPrice: totalSeatsPrice, // Total price is the sum of seat prices
        isTransportationBooking: true,
        // Additional information for checkout page
        fromCityName,
        toCityName,
        departureTime,
        arrivalTime
      } 
    });
  };

  // Format the departure/arrival time for display
  const formatTime = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error formatting time:', e);
      return dateString;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Seat Selection - {transportationName}</DialogTitle>
          {(fromCityName || toCityName) && (
            <DialogDescription className="mt-2">
              <div className="text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 mb-2">
                  <div className="font-medium text-primary">{fromCityName} to {toCityName}</div>
                  <div className="flex items-center space-x-4">
                    {departureTime && (
                      <span>Departure: {formatTime(departureTime)}</span>
                    )}
                    {arrivalTime && (
                      <span>Arrival: {formatTime(arrivalTime)}</span>
                    )}
                    {transportationPrice > 0 && (
                      <span className="font-semibold">Base price: ${transportationPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            </DialogDescription>
          )}
        </DialogHeader>
        <SeatMap
          transportationId={transportationId}
          transportationType={transportationType}
          onConfirmSeats={handleConfirmSeats}
          onCancel={() => onOpenChange(false)}
          transportationPrice={transportationPrice}
          fromCityName={fromCityName}
          toCityName={toCityName}
          departureTime={departureTime}
          arrivalTime={arrivalTime}
        />
      </DialogContent>
    </Dialog>
  );
};
