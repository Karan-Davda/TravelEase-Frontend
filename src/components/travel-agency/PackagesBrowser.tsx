
import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TourCard from '@/components/sections/TourCard';
import { Package } from '@/types/packageTypes';
import { Skeleton } from '@/components/ui/skeleton';

type PackagesBrowserProps = {
  packages: Package[];
  isLoading: boolean;
};

export const PackagesBrowser = ({ packages, isLoading }: PackagesBrowserProps) => {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold">
          My Packages
        </h2>
        <div className="flex items-center gap-4">
          <Link to="/package-creation">
            <Button className="flex bg-primary text-white items-center gap-2">
              <Plus size={16} />
              Create New Package
            </Button>
          </Link>
          <Link 
            to="/agency-packages" 
            className="text-primary font-medium hover:underline inline-flex items-center"
          >
            View all packages <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeleton cards
          Array(3).fill(0).map((_, index) => (
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
                  <Skeleton className="h-4 w-24" />
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
              onViewClick={() => window.location.href = `/packages/${pkg.PackageID}`}
            />
          ))
        )}
      </div>
    </div>
  );
};
