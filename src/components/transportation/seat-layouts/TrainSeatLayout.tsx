
import React from 'react';
import { Train } from 'lucide-react';
import { Seat } from '@/services/seatService';

interface TrainSeatLayoutProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

export const TrainSeatLayout = ({ seats, selectedSeats, onSeatClick }: TrainSeatLayoutProps) => {
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

  // Train layout (2+2 with train cars)
  const seatsPerRow = 4; 
  const seatsPerSide = 2;
  
  // Group seats into rows
  const rows: Seat[][] = [];
  
  for (let i = 0; i < seats.length; i += seatsPerRow) {
    const row = seats.slice(i, i + seatsPerRow);
    rows.push(row);
  }
  
  // Group rows into train cars (10 rows of 4 seats = 40 seats per car)
  const trainCars: Seat[][][] = [];
  let currentCar: Seat[][] = [];
  
  rows.forEach((row, index) => {
    currentCar.push(row);
    
    // 10 rows of 4 seats = 40 seats per car
    if (currentCar.length === 10 || index === rows.length - 1) {
      trainCars.push([...currentCar]);
      currentCar = [];
    }
  });
  
  return (
    <div className="flex flex-col gap-10">
      {trainCars.map((car, carIndex) => (
        <div key={carIndex} className="mb-8">
          {/* Train car outline */}
          <div className="flex items-center mb-4">
            <div className="flex-1 h-1 bg-teal-500"></div>
            <Train className="mx-3 text-teal-600" size={32} strokeWidth={1.5} />
            <h3 className="text-lg font-semibold mr-3 text-teal-600">Car {carIndex + 1}</h3>
            <div className="flex-1 h-1 bg-teal-500"></div>
          </div>
          
          <div className="border-2 border-teal-500 rounded-lg p-6 bg-gray-50">
            {car.map((row, rowIndex) => (
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
      ))}
    </div>
  );
};
