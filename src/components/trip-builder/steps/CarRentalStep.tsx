
import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Car, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

type CarRentalStepProps = {
  destination: string;
  startDate?: Date;
  endDate?: Date;
  selectedRentalCar?: {
    id: string;
    name: string;
    price: number;
    details: Record<string, any>;
  };
  onUpdate: (rentalCar: {
    id: string;
    name: string;
    price: number;
    details: Record<string, any>;
  }) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
};

// Mock car rental options
const carOptions = [
  {
    id: 'car1',
    name: 'Economy - Toyota Corolla or similar',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    price: 45,
    features: ['Automatic', '5 Seats', 'A/C', '2 Bags'],
    mileage: 'Unlimited',
    fuelPolicy: 'Full to Full',
    company: 'Avis'
  },
  {
    id: 'car2',
    name: 'SUV - Jeep Compass or similar',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    price: 75,
    features: ['Automatic', '5 Seats', 'A/C', '3 Bags'],
    mileage: 'Unlimited',
    fuelPolicy: 'Full to Full',
    company: 'Hertz'
  },
  {
    id: 'car3',
    name: 'Premium - Mercedes C-Class or similar',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    price: 120,
    features: ['Automatic', '5 Seats', 'A/C', '4 Bags'],
    mileage: 'Unlimited',
    fuelPolicy: 'Full to Full',
    company: 'Enterprise'
  }
];

const CarRentalStep: React.FC<CarRentalStepProps> = ({
  destination,
  startDate,
  endDate,
  selectedRentalCar,
  onUpdate,
  onNext,
  onBack,
  onSkip
}) => {
  const [selected, setSelected] = useState<string | undefined>(selectedRentalCar?.id);

  const handleSelectCar = (car: any) => {
    setSelected(car.id);
    onUpdate({
      id: car.id,
      name: car.name,
      price: car.price,
      details: car
    });
  };

  // Calculate number of rental days
  const getDays = () => {
    if (!startDate || !endDate) return 1;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const rentalDays = getDays();

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onNext();
  };

  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-center">
        Do you need a rental car in {destination}?
      </h2>
      
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pick-up Date</p>
            <p className="font-medium">{startDate ? format(startDate, 'MMM d, yyyy') : 'Not selected'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Drop-off Date</p>
            <p className="font-medium">{endDate ? format(endDate, 'MMM d, yyyy') : 'Not selected'}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-blue-600 mt-0.5" size={20} />
          <div>
            <p className="text-blue-700 font-medium">Add flexibility to your trip</p>
            <p className="text-blue-600 text-sm">A rental car gives you the freedom to explore {destination} at your own pace.</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mt-6">
        {carOptions.map(car => (
          <Card 
            key={car.id} 
            className={`cursor-pointer transition-all ${selected === car.id ? 'ring-2 ring-primary' : ''}`}
            onClick={() => handleSelectCar(car)}
          >
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 overflow-hidden">
                <div className="aspect-video md:aspect-square relative">
                  <img 
                    src={car.image} 
                    alt={car.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="col-span-2 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Car size={18} className="text-primary" />
                    <h3 className="font-semibold text-lg">{car.name}</h3>
                  </div>
                  
                  <div className="text-gray-500 text-sm mb-3">
                    <p>Provided by {car.company}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {car.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div>
                      <span className="font-medium">Mileage:</span> {car.mileage}
                    </div>
                    <div>
                      <span className="font-medium">Fuel Policy:</span> {car.fuelPolicy}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-between p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">${car.price} × {rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">${car.price * rentalDays}</div>
                    <div className="text-xs text-gray-500">Total for {rentalDays} {rentalDays === 1 ? 'day' : 'days'}</div>
                  </div>
                  
                  <Button 
                    variant={selected === car.id ? "default" : "outline"}
                    className="mt-4 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCar(car);
                    }}
                  >
                    {selected === car.id ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button 
          variant="tertiary" 
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        
        <Button 
          variant="ghost"
          onClick={onSkip}
        >
          Skip for now
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!selected}
          className="gap-2 min-w-[120px]"
        >
          Next <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CarRentalStep;
