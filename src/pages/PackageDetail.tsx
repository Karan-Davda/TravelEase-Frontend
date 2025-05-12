import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Package } from '@/types/packageTypes';
import { fetchWithAuth } from '@/utils/apiHelper';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ArrowLeft, Calendar, Users, Clock, MapPin } from 'lucide-react';

const PackageDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPackageData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await fetchWithAuth<Package[]>("http://localhost:3000/api/partners/packages");
        const foundPackage = data.find(p => p.PackageID.toString() === id);
        
        if (foundPackage) {
          setPackageData(foundPackage);
        } else {
          toast({
            title: "Package not found",
            description: "The requested package could not be found.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to fetch package details:", error);
        toast({
          title: "Error",
          description: "Failed to load package details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageData();
  }, [id, toast]);

  // Calculate estimated dates if transportation data is available
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container-custom py-8 mt-20">
          <div className="mb-6">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-6 w-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Skeleton className="h-80 w-full mb-6" />
              <Skeleton className="h-8 w-40 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div>
              <Skeleton className="h-64 w-full mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!packageData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container-custom py-8 mt-20">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
            <p className="mb-6">The requested package could not be found.</p>
            <Link to="/agency-dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow container-custom py-8 mt-20">
        {/* Back to Dashboard Link */}
        <Link 
          to="/agency-dashboard" 
          className="flex items-center text-primary mb-6 hover:underline"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
        </Link>
        
        {/* Package Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[#1A1F2C]">{packageData.PackageName}</h1>
        <p className="text-[#8E9196] mb-6">
          <MapPin size={16} className="inline-block mr-1" />
          {packageData.SourceCity.CityName} to {packageData.DestinationCity.CityName}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column (Image and Details) */}
          <div className="md:col-span-2">
            {/* Package Image */}
            <div 
              className="h-80 bg-cover bg-center rounded-lg mb-6 relative" 
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
            <h2 className="text-2xl font-bold mb-4 text-[#1A1F2C]">Package Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#E5DEFF] p-4 rounded">
                <p className="text-sm text-[#7E69AB]">Price per person</p>
                <p className="text-xl font-bold text-[#6E59A5]">${parseFloat(packageData.Price).toLocaleString()}</p>
              </div>
              <div className="bg-[#E5DEFF] p-4 rounded">
                <p className="text-sm text-[#7E69AB]">Duration</p>
                <p className="text-xl font-bold text-[#6E59A5]">{getDuration()}</p>
              </div>
              <div className="bg-[#E5DEFF] p-4 rounded">
                <p className="text-sm text-[#7E69AB]">Group Size</p>
                <p className="text-xl font-bold text-[#6E59A5]">Max {packageData.RegistrationCap}</p>
              </div>
              <div className="bg-[#E5DEFF] p-4 rounded">
                <p className="text-sm text-[#7E69AB]">Start Date</p>
                <p className="text-xl font-bold text-[#6E59A5]">{getFormattedDate(dates?.startDate)}</p>
              </div>
              <div className="bg-[#E5DEFF] p-4 rounded">
                <p className="text-sm text-[#7E69AB]">End Date</p>
                <p className="text-xl font-bold text-[#6E59A5]">{getFormattedDate(dates?.endDate)}</p>
              </div>
              <div className="bg-[#E5DEFF] p-4 rounded">
                <p className="text-sm text-[#7E69AB]">Status</p>
                <p className="text-xl font-bold text-[#6E59A5]">{packageData.Status}</p>
              </div>
            </div>
            
            {/* Itinerary */}
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
          
          {/* Right Column (Sidebar) */}
          <div>
            <div className="bg-[#f8f7ff] p-6 rounded-lg sticky top-24 border border-[#D6BCFA]">
              <h3 className="text-xl font-bold mb-4 text-[#1A1F2C]">Package Summary</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-[#8E9196]">Price per person:</span>
                  <span className="font-medium text-[#1A1F2C]">${parseFloat(packageData.Price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E9196]">Max group size:</span>
                  <span className="font-medium text-[#1A1F2C]">{packageData.RegistrationCap}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E9196]">Current bookings:</span>
                  <span className="font-medium text-[#1A1F2C]">{packageData.Registered}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E9196]">Available slots:</span>
                  <span className="font-medium text-[#1A1F2C]">{packageData.RegistrationCap - packageData.Registered}</span>
                </div>
                <div className="flex justify-between border-t pt-3 border-[#D6BCFA]">
                  <span className="text-[#8E9196]">Status:</span>
                  <span className="font-medium">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      packageData.Status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {packageData.Status}
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="space-y-4">
                {packageData.Status === 'Active' ? (
                  <Button className="w-full bg-amber-500 hover:bg-amber-600" variant="destructive">
                    Deactivate Package
                  </Button>
                ) : (
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Activate Package
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PackageDetail;
