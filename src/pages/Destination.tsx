
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/destination/HeroBanner';
import ExperienceSection from '@/components/destination/ExperienceSection';
import TransportationSection from '@/components/destination/TransportationSection';
import AccommodationSection from '@/components/destination/AccommodationSection';
import CustomTripCTA from '@/components/destination/CustomTripCTA';
import LoadingState from '@/components/destination/LoadingState';
import ErrorState from '@/components/destination/ErrorState';
import useSeo from '@/hooks/useSeo';
import { useDestinationData } from '@/hooks/useDestinationData';

const Destination = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  console.log("City slug in Destination page:", citySlug);
  
  // Use hook to fetch data
  const { cityData, loading, error, userCity } = useDestinationData(citySlug);
  
  console.log("Destination component state:", { loading, error, hasData: !!cityData, userCity });
  
  // Set SEO data - handle case when data is loading
  useSeo({
    title: cityData ? `${cityData.city.CityName} Travel Guide | TravelEase` : 'Destination | TravelEase',
    description: cityData?.city.Description || 'Explore this amazing destination with TravelEase',
  });

  // Show loading state while data is being fetched
  if (loading) {
    console.log("Showing loading state");
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-16">
          <LoadingState />
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state if there's an error or no data
  if (error || !cityData) {
    console.log("Showing error state:", error, "cityData:", cityData);
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom py-16">
          <ErrorState errorMessage={error || "No data available for this destination"} />
        </div>
        <Footer />
      </div>
    );
  }

  console.log("Rendering destination with data:", cityData);
  const { city, experiences, accommodations, packages, Flight, Train, Bus } = cityData;

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Banner with overlay */}
      <HeroBanner 
        cityName={city.CityName}
        description={city.Description}
        photoURL={city.PhotoURL || "https://source.unsplash.com/featured/?cityscape," + city.CityName}
      />
      
      {/* Experiences Section */}
      <ExperienceSection experiences={experiences || []} cityName={city.CityName} />
      
      {/* Transportation Section - Pass Flight, Train, Bus separately and userCity */}
      <TransportationSection 
        transportation={[]} 
        Flight={Flight || []}
        Train={Train || []}
        Bus={Bus || []} 
        cityName={city.CityName}
        userCity={userCity}
      />
      
      {/* Accommodations Section */}
      <AccommodationSection accommodations={accommodations || []} cityName={city.CityName} />
      
      {/* Packages Section - Only shown if packages exist */}
      {packages && packages.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-display font-bold">
                {city.CityName} Vacation Packages
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Package card contents would go here */}
            </div>
          </div>
        </section>
      )}
      
      {/* Custom Trip CTA */}
      <CustomTripCTA cityName={city.CityName} />
      
      <Footer />
    </div>
  );
};

export default Destination;
