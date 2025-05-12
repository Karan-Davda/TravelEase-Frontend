
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import { fetchWithAuth } from '@/utils/apiHelper';
import { Package } from '@/types/packageTypes';
import CallToAction from '@/components/sections/CallToAction';
import TourCard from '@/components/sections/TourCard';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PackageDetail } from '@/components/travel-agency/PackageDetail';
import { Skeleton } from '@/components/ui/skeleton';

const Packages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithAuth<Package[]>("http://localhost:3000/api/partners/packages");
        setPackages(data);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  // Calculate duration in days between first and last transaction for each package
  const getPackageDuration = (pkg: Package): string => {
    if (pkg.Duration > 0) {
      return `${pkg.Duration} days`;
    }
    
    if (pkg.PackageTrans.length === 0) {
      return "N/A";
    }
    
    // Sort by sequence
    const sortedTrans = [...pkg.PackageTrans].sort((a, b) => 
      parseInt(a.Sequence) - parseInt(b.Sequence)
    );
    
    const firstLeg = sortedTrans[0];
    const lastLeg = sortedTrans[sortedTrans.length - 1];
    
    let startDate: Date | null = null;
    let endDate: Date | null = null;
    
    // Find start date from first transportation
    if (firstLeg.IsTransportation && firstLeg.Transportation) {
      startDate = new Date(firstLeg.Transportation.DepartureTime);
    }
    
    // Find end date from last transportation
    if (lastLeg.IsTransportation && lastLeg.Transportation) {
      endDate = new Date(lastLeg.Transportation.ArrivalTime);
    }
    
    if (startDate && endDate) {
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    
    return "N/A";
  };

  const handleViewPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Explore America's Most Beautiful Destinations"
        subtitle="Discover pre-arranged packages and unique experiences across the United States."
        ctaText="Browse Packages"
        ctaLink="#packages-list"
        backgroundImage="https://images.unsplash.com/photo-1501594907352-04cda38ebc29"
      />
      
      {/* Main Content */}
      <section id="packages-list" className="py-16 bg-white scroll-mt-20">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-8">
            Available Packages
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton cards
              Array(6).fill(0).map((_, index) => (
                <div key={`skeleton-${index}`} className="rounded-lg overflow-hidden border border-gray-100">
                  <Skeleton className="h-56 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="flex space-x-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <div className="pt-4 flex justify-between items-center">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              packages.map((pkg) => (
                <TourCard
                  key={pkg.PackageID}
                  id={pkg.PackageID.toString()}
                  title={pkg.PackageName}
                  image={pkg.PhotoURL || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80"}
                  description={`From ${pkg.SourceCity.CityName} to ${pkg.DestinationCity.CityName}`}
                  price={parseFloat(pkg.Price)}
                  duration={getPackageDuration(pkg)}
                  rating={4.7} // Default rating since it's not in the API
                  reviewCount={0} // Default since it's not in the API
                  maxGroupSize={pkg.RegistrationCap}
                  hasTourGuide={pkg.IsTourGuide}
                  onViewClick={() => handleViewPackage(pkg)}
                />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Package Detail Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedPackage(null);
        }}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto p-0">
          {selectedPackage && (
            <PackageDetail 
              packageData={selectedPackage} 
              showPaymentButton={true}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Call to Action */}
      <CallToAction
        title="Can't Find What You're Looking For?"
        description="Create a customized American adventure tailored specifically to your preferences and budget."
        primaryButtonText="Build Custom Trip"
        primaryButtonLink="/custom-trip"
        backgroundImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
      />
      
      <Footer />
    </div>
  );
};

export default Packages;
