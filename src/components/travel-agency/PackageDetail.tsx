
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import { Package } from '@/types/packageTypes';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import PaymentForm from '@/components/ui/PaymentForm';
import { useNavigate } from 'react-router-dom';

type PackageDetailProps = {
  packageData: Package;
  showPaymentButton?: boolean;
};

export const PackageDetail = ({ packageData, showPaymentButton = false }: PackageDetailProps) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Calculate dates if transportation data is available
  const getDates = () => {
    if (!packageData || packageData.PackageTrans.length === 0) return null;
    
    // Sort by sequence
    const sortedTrans = [...packageData.PackageTrans].sort(
      (a, b) => parseInt(a.Sequence) - parseInt(b.Sequence)
    );
    
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    
    // Find first transportation with departure time
    for (const trans of sortedTrans) {
      if (trans.IsTransportation && trans.Transportation?.DepartureTime) {
        startDate = new Date(trans.Transportation.DepartureTime);
        break;
      }
    }
    
    // Find last transportation with arrival time
    for (let i = sortedTrans.length - 1; i >= 0; i--) {
      const trans = sortedTrans[i];
      if (trans.IsTransportation && trans.Transportation?.ArrivalTime) {
        endDate = new Date(trans.Transportation.ArrivalTime);
        break;
      }
    }
    
    return { startDate, endDate };
  };

  const dates = getDates();
  
  const getFormattedDate = (date: Date | null) => {
    return date ? format(date, "MMM d, yyyy") : "N/A";
  };
  
  const getDuration = () => {
    if (!dates?.startDate || !dates?.endDate) return "N/A";
    
    const diffTime = Math.abs(dates.endDate.getTime() - dates.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const handleBookNow = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    setShowPaymentForm(false);
    toast({
      title: "Booking Successful!",
      description: `Your booking for ${packageData.PackageName} has been confirmed.`,
    });
    // Redirect to homepage or booking confirmation page after a delay
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const price = parseFloat(packageData.Price);

  return (
    <div className="w-full overflow-auto max-h-[90vh]">
      {/* Package Image and Details Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 pb-0">
        {/* Package Image */}
        <div 
          className="h-64 md:h-72 bg-cover bg-center relative rounded-lg" 
          style={{ backgroundImage: `url(${packageData.PhotoURL || "https://images.unsplash.com/photo-1469474968028-56623f02e42e"})` }}
        >
          {/* Tour Guide Badge */}
          {packageData.IsTourGuide && (
            <div className="absolute bottom-4 left-4 bg-[#9b87f5] text-white px-3 py-1 text-sm font-medium rounded">
              Tour Guide Included
            </div>
          )}
        </div>
        
        {/* Package Details */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">{packageData.PackageName}</h2>
              <p className="text-[#8E9196] mb-4 flex items-center">
                <MapPin size={16} className="mr-1" />
                {packageData.SourceCity.CityName} to {packageData.DestinationCity.CityName}
              </p>
            </div>
            <div className="bg-[#E5DEFF] p-3 rounded text-right">
              <p className="text-sm text-[#7E69AB]">Price per person</p>
              <p className="text-2xl font-bold text-[#6E59A5]">${price.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#7E69AB]" />
              <div>
                <p className="text-sm text-[#8E9196]">Duration</p>
                <p className="font-medium">{getDuration()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users size={18} className="text-[#7E69AB]" />
              <div>
                <p className="text-sm text-[#8E9196]">Group Size</p>
                <p className="font-medium">Max {packageData.RegistrationCap}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-[#7E69AB]" />
              <div>
                <p className="text-sm text-[#8E9196]">Start Date</p>
                <p className="font-medium">{getFormattedDate(dates?.startDate)}</p>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">Package Overview</h3>
          <p className="text-gray-600 mb-6">
            Experience an unforgettable journey from {packageData.SourceCity.CityName} to {packageData.DestinationCity.CityName}. 
            This {getDuration()} adventure includes {packageData.IsTourGuide ? 'expert tour guides, ' : ''}
            comfortable accommodations and convenient transportation options.
          </p>
        </div>
      </div>
      
      {/* Itinerary Section */}
      <div className="p-6 pt-4">
        <h2 className="text-2xl font-bold mb-4 text-[#1A1F2C]">Itinerary</h2>
        <div className="space-y-6 mb-8">
          {packageData.PackageTrans
            .sort((a, b) => parseInt(a.Sequence) - parseInt(b.Sequence))
            .map((tran, index) => (
              <div key={tran.PackageTranID} className="border-l-2 border-[#9b87f5] pl-4 pb-6 relative">
                <div className="absolute -left-2 top-0 h-4 w-4 rounded-full bg-[#9b87f5]"></div>
                <h3 className="text-lg font-bold mb-2 text-[#1A1F2C]">Day {index + 1}: {tran.FromCity.CityName} to {tran.ToCity.CityName}</h3>
                
                {/* Transportation Details */}
                {tran.IsTransportation && tran.Transportation && (
                  <div className="bg-[#f8f7ff] p-4 rounded mb-3 border border-[#D6BCFA]">
                    <h4 className="font-medium mb-2 text-[#7E69AB]">Transportation</h4>
                    <p className="text-[#1A1F2C]">{tran.Transportation.TransportationName}</p>
                    {tran.Transportation.DepartureTime && tran.Transportation.ArrivalTime && (
                      <p className="text-sm text-[#8E9196]">
                        {format(new Date(tran.Transportation.DepartureTime), "MMM d, h:mm a")} - 
                        {format(new Date(tran.Transportation.ArrivalTime), " MMM d, h:mm a")}
                      </p>
                    )}
                    <p className="text-sm text-[#8E9196]">Price: ${parseFloat(tran.Transportation.Price).toLocaleString()}</p>
                  </div>
                )}
                
                {/* Accommodation Details */}
                {tran.IsAccommodation && tran.Accommodation && (
                  <div className="bg-[#f8f7ff] p-4 rounded mb-3 border border-[#D6BCFA]">
                    <h4 className="font-medium mb-2 text-[#7E69AB]">Accommodation</h4>
                    <p className="text-[#1A1F2C]">{tran.Accommodation.AccommodationName}</p>
                    <p className="text-sm text-[#8E9196]">Price per night: ${parseFloat(tran.Accommodation.PricePerNight).toLocaleString()}</p>
                  </div>
                )}
                
                {/* Tour Guide Required */}
                {tran.IsTourGuideRequired && (
                  <div className="bg-[#f8f7ff] p-4 rounded mb-3 border border-[#D6BCFA]">
                    <h4 className="font-medium mb-2 text-[#7E69AB]">Tour Guide</h4>
                    <p className="text-sm text-[#8E9196]">Tour guide services included for this leg of the journey</p>
                  </div>
                )}
                
                {/* If neither transportation nor accommodation */}
                {!tran.IsTransportation && !tran.IsAccommodation && (
                  <p className="text-[#8E9196]">Free day to explore {tran.ToCity.CityName}</p>
                )}
              </div>
            ))}
        </div>
      </div>
      
      {/* Payment/Booking Section */}
      <div className="p-6 pt-0 border-t border-gray-100">
        {showPaymentButton ? (
          showPaymentForm ? (
            <div className="w-full">
              <PaymentForm 
                amount={price} 
                onSuccess={handlePaymentSuccess} 
              />
            </div>
          ) : (
            <div className="flex flex-col items-start md:flex-row md:items-center gap-4 w-full">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-primary">${price.toLocaleString()}</p>
              </div>
              <Button 
                onClick={handleBookNow}
                className="bg-accent hover:bg-accent/90 ml-auto"
                size="lg"
              >
                Book Now
              </Button>
            </div>
          )
        ) : (
          <Button
            onClick={() => navigate(`/packages/${packageData.PackageID}`)}
            variant="outline"
            className="w-full md:w-auto"
          >
            View Details
          </Button>
        )}
      </div>
    </div>
  );
};
