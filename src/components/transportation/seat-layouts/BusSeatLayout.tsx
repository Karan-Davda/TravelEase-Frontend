
import React from 'react';
import { Bus } from 'lucide-react';
import { Seat } from '@/services/seatService';

interface BusSeatLayoutProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

export const BusSeatLayout = ({ seats, selectedSeats, onSeatClick }: BusSeatLayoutProps) => {
  const renderSeat = (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.SeatNumber === seat.SeatNumber);
    
    let bgColor = 'bg-gray-200'; // default for available
    if (seat.Status === 'Booked') {
      bgColor = 'bg-red-500';
    } else if (isSelected) {
      bgColor = 'bg-teal-500';
    }

    return (
      <div
        key={seat.SeatNumber}
        className={`w-10 h-10 ${bgColor} rounded flex items-center justify-center cursor-pointer text-sm font-medium transition-colors ${
          seat.Status === 'Booked' ? 'cursor-not-allowed opacity-70' : 'hover:opacity-80'
        }`}
        onClick={() => onSeatClick(seat)}
      >
        <span className={isSelected || seat.Status === 'Booked' ? 'text-white' : ''}>
          {seat.SeatNumber}
        </span>
      </div>
    );
  };

  if (!seats || seats.length === 0) {
    return <div className="text-center">No seats available</div>;
  }

  // Bus layout (2+2)
  const seatsPerRow = 4;
  const seatsPerSide = 2;
  
  // Group seats into rows
  const rows: Seat[][] = [];
  
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    const row = seats.slice(i, i + seatsPerRow);
    rows.push(row);
  }
  
  return (
    <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
      {/* Bus outline */}
      <div className="relative mb-10">
        <Bus className="mx-auto text-teal-600" size={56} strokeWidth={1.5} />
        <div className="text-center text-sm text-teal-600 font-medium mt-2">Bus</div>
      </div>
      
      {/* Driver area */}
      <div className="mb-8 flex justify-center">
        <div className="w-16 h-16 border-2 border-teal-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-teal-600">Driver</span>
        </div>
      </div>
      
      {/* Bus body with seats */}
      <div className="border-2 border-teal-500 rounded-lg p-6">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex mb-6 justify-between">
            {/* Left side seats */}
            <div className="flex gap-4">
              {Array.from({ length: seatsPerSide }).map((_, i) => (
                <React.Fragment key={`left-${i}`}>
                  {i < row.slice(0, seatsPerSide).length ? renderSeat(row[i]) : <div className="w-10 h-10 opacity-0"></div>}
                </React.Fragment>
              ))}
            </div>
            
            {/* Aisle */}
            <div className="w-16"></div>
            
            {/* Right side seats */}
            <div className="flex gap-4">
              {Array.from({ length: seatsPerSide }).map((_, i) => {
                const seatIndex = i + seatsPerSide;
                return (
                  <React.Fragment key={`right-${i}`}>
                    {seatIndex < row.length ? renderSeat(row[seatIndex]) : <div className="w-10 h-10 opacity-0"></div>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
