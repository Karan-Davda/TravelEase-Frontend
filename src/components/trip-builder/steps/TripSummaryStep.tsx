
import React from 'react';
import { format } from 'date-fns';
import { Save, Edit, CreditCard, MapPin, Calendar, Users, Plane, Train, Bus, Car, Hotel, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TripDetails, TransportMode } from '../TripBuilderWizard';

type TripSummaryStepProps = {
  tripDetails: TripDetails;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSaveForLater: () => void;
};

const TripSummaryStep: React.FC<TripSummaryStepProps> = ({ 
  tripDetails, 
  onBack,
  onEdit,
  onSaveForLater
}) => {
  const getTransportIcon = () => {
    switch (tripDetails.transportMode) {
      case 'flight':
        return <Plane size={20} />;
      case 'train':
        return <Train size={20} />;
      case 'bus':
        return <Bus size={20} />;
      case 'car':
        return <Car size={20} />;
      default:
        return null;
    }
  };
  
  const calculateTotalPrice = () => {
    let total = 0;
    
    // Add transport cost
    if (tripDetails.transportOption) {
      if (tripDetails.transportMode === 'car') {
        // For car rentals, multiply by number of days
        if (tripDetails.startDate && tripDetails.endDate) {
          const days = Math.ceil((tripDetails.endDate.getTime() - tripDetails.startDate.getTime()) / (1000 * 60 * 60 * 24));
          total += tripDetails.transportOption.price * days;
        } else {
          total += tripDetails.transportOption.price;
        }
      } else {
        // For flights, trains, buses - multiply by number of travelers
        total += tripDetails.transportOption.price * (tripDetails.adults + tripDetails.children);
      }
    }
    
    // Add accommodation cost
    if (tripDetails.accommodation && tripDetails.startDate && tripDetails.endDate) {
      const nights = Math.ceil((tripDetails.endDate.getTime() - tripDetails.startDate.getTime()) / (1000 * 60 * 60 * 24));
      total += tripDetails.accommodation.price * nights;
    }
    
    // Add tour guide cost
    if (tripDetails.tourGuide && tripDetails.startDate && tripDetails.endDate) {
      const days = Math.ceil((tripDetails.endDate.getTime() - tripDetails.startDate.getTime()) / (1000 * 60 * 60 * 24));
      total += tripDetails.tourGuide.price * days;
    }
    
    return total;
  };
  
  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-center">
        Your Trip Summary
      </h2>
      
      <div className="max-w-3xl mx-auto">
        {/* Destination */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Destination</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(1)}
              className="h-8 gap-1"
            >
              <Edit size={14} /> Edit
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
            <MapPin className="text-primary mt-1" size={20} />
            <div>
              <p className="font-medium">{tripDetails.destination}</p>
            </div>
          </div>
        </div>
        
        {/* Dates */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Travel Dates</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(2)}
              className="h-8 gap-1"
            >
              <Edit size={14} /> Edit
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
            <Calendar className="text-primary mt-1" size={20} />
            <div>
              {tripDetails.startDate && tripDetails.endDate ? (
                <div>
                  <p className="font-medium">
                    {format(tripDetails.startDate, "MMM d, yyyy")} - {format(tripDetails.endDate, "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.ceil((tripDetails.endDate.getTime() - tripDetails.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No dates selected</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Travelers */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Travelers</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(3)}
              className="h-8 gap-1"
            >
              <Edit size={14} /> Edit
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
            <Users className="text-primary mt-1" size={20} />
            <div>
              <p className="font-medium">
                {tripDetails.adults + tripDetails.children} {tripDetails.adults + tripDetails.children === 1 ? 'Traveler' : 'Travelers'}
              </p>
              <p className="text-sm text-gray-500">
                {tripDetails.adults} {tripDetails.adults === 1 ? 'Adult' : 'Adults'}
                {tripDetails.children > 0 && `, ${tripDetails.children} ${tripDetails.children === 1 ? 'Child' : 'Children'}`}
              </p>
            </div>
          </div>
        </div>
        
        {/* Transportation */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Transportation</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(4)}
              className="h-8 gap-1"
            >
              <Edit size={14} /> Edit
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
            {getTransportIcon()}
            <div>
              {tripDetails.transportMode && tripDetails.transportOption ? (
                <div>
                  <p className="font-medium">
                    {tripDetails.transportMode === 'flight' && 'Flight'}
                    {tripDetails.transportMode === 'train' && 'Train'}
                    {tripDetails.transportMode === 'bus' && 'Bus'}
                    {tripDetails.transportMode === 'car' && 'Car Rental'}
                  </p>
                  <p>{tripDetails.transportOption.name}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    ${tripDetails.transportOption.price} 
                    {tripDetails.transportMode === 'car' ? ' per day' : ' per person'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No transportation selected</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Accommodation */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Accommodation</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(6)}
              className="h-8 gap-1"
            >
              <Edit size={14} /> Edit
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
            <Hotel className="text-primary mt-1" size={20} />
            <div>
              {tripDetails.accommodation ? (
                <div>
                  <p className="font-medium">{tripDetails.accommodation.name}</p>
                  <div className="flex gap-1 text-xs text-gray-500 my-1">
                    {tripDetails.accommodation.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="bg-gray-100 px-2 py-0.5 rounded">{amenity}</span>
                    ))}
                    {tripDetails.accommodation.amenities.length > 3 && (
                      <span className="bg-gray-100 px-2 py-0.5 rounded">+{tripDetails.accommodation.amenities.length - 3} more</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    ${tripDetails.accommodation.price} per night
                    {tripDetails.startDate && tripDetails.endDate && (
                      <> • ${tripDetails.accommodation.price * Math.ceil((tripDetails.endDate.getTime() - tripDetails.startDate.getTime()) / (1000 * 60 * 60 * 24))} total</>
                    )}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No accommodation selected</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Tour Guide */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Tour Guide</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit(7)}
              className="h-8 gap-1"
            >
              <Edit size={14} /> Edit
            </Button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
            <User className="text-primary mt-1" size={20} />
            <div>
              {tripDetails.tourGuide ? (
                <div>
                  <p className="font-medium">{tripDetails.tourGuide.name}</p>
                  <p className="text-sm">Specialty: {tripDetails.tourGuide.specialty}</p>
                  <p className="text-sm">Languages: {tripDetails.tourGuide.languages.join(', ')}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    ${tripDetails.tourGuide.price} per day
                    {tripDetails.startDate && tripDetails.endDate && (
                      <> • ${tripDetails.tourGuide.price * Math.ceil((tripDetails.endDate.getTime() - tripDetails.startDate.getTime()) / (1000 * 60 * 60 * 24))} total</>
                    )}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">No tour guide selected</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Total Price */}
        <div className="border-t mt-8 pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Total Price</h3>
            <div className="text-2xl font-bold text-primary">${calculateTotalPrice()}</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={onSaveForLater}
            className="gap-2"
          >
            <Save size={18} /> Save for Later
          </Button>
          <Button 
            onClick={() => alert("Booking feature will be implemented in the next phase!")}
            className="gap-2 bg-primary"
          >
            <CreditCard size={18} /> Proceed to Booking
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TripSummaryStep;
