
import React from 'react';
import { Plane } from 'lucide-react';
import { Seat } from '@/services/seatService';

interface FlightSeatLayoutProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

export const FlightSeatLayout = ({ seats, selectedSeats, onSeatClick }: FlightSeatLayoutProps) => {
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

  // Flight layout (3+3)
  const seatsPerRow = 6;
  const seatsPerSide = 3;
  
  // Group seats into rows
  const rows: Seat[][] = [];
  
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    const row = seats.slice(i, i + seatsPerRow);
    rows.push(row);
  }
  
  // Split rows into two sections to represent front and back of plane
  const midPoint = Math.ceil(rows.length / 2);
  const frontRows = rows.slice(0, midPoint);
  const backRows = rows.slice(midPoint);

  return (
    <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
      {/* Airplane outline */}
      <div className="relative mb-10">
        <Plane className="mx-auto text-teal-600" size={56} strokeWidth={1.5} />
        <div className="text-center text-sm text-teal-600 font-medium mt-2">Flight</div>
      </div>
      
      {/* Front section */}
      <div className="mb-8">
        <h4 className="text-center text-sm font-medium mb-4 text-gray-600">Front Section</h4>
        <div className="px-6">
          {frontRows.map((row, rowIndex) => (
            <div key={`front-${rowIndex}`} className="flex mb-6 justify-between">
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
      
      {/* Wing divider */}
      <div className="flex items-center justify-center my-10">
        <div className="w-1/3 h-1 bg-teal-500"></div>
        <div className="px-4 text-sm text-teal-600 font-medium">Wings</div>
        <div className="w-1/3 h-1 bg-teal-500"></div>
      </div>
      
      {/* Back section */}
      <div className="mt-8">
        <h4 className="text-center text-sm font-medium mb-4 text-gray-600">Back Section</h4>
        <div className="px-6">
          {backRows.map((row, rowIndex) => (
            <div key={`back-${rowIndex}`} className="flex mb-6 justify-between">
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
    </div>
  );
};
