
import React, { useEffect } from 'react';
import { Bus } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TransportationFilter, FilterValues } from '@/components/transportation/TransportationFilter';
import TransportationCardV2 from '@/components/transportation/TransportationCardV2';
import { useTransportationSearch } from '@/hooks/useTransportationSearch';
import LoadingState from '@/components/destination/LoadingState';
import ErrorState from '@/components/destination/ErrorState';
import useSeo from '@/hooks/useSeo';

const BusesList = () => {
  const location = useLocation();
  const cityData = location.state || { fromCityName: '', toCityName: '', userCity: '' };
  
  const { 
    onwardItems: onwardBuses, 
    returnItems: returnBuses,
    loading, 
    error, 
    filters, 
    updateFilters, 
    setInitialFilters,
    handleSearch,
    handleInitialSearch,
    initialSearchDone
  } = useTransportationSearch('bus');
  
  useEffect(() => {
    // Check if we have data from location state (coming from destination page)
    if (!initialSearchDone) {
      // If we have city data from destination page, use that
      if (cityData.toCityName && cityData.userCity) {
        console.log('Setting filters from destination page data:', cityData);
        const initialFilters: FilterValues = {
          fromCityName: cityData.userCity || '',
          toCityName: cityData.toCityName || '',
          numberOfTravelers: 1,
          tripType: 'one-way',
          minPrice: '0',
          maxPrice: '900'
        };
        
        console.log('Setting initial filters from location state:', initialFilters);
        setInitialFilters(initialFilters);
        handleInitialSearch(initialFilters);
      }
      // If we just have fromCity and toCity (direct navigation to buses page)
      else if (cityData.fromCityName && cityData.toCityName) {
        const initialFilters: FilterValues = {
          fromCityName: cityData.fromCityName,
          toCityName: cityData.toCityName,
          numberOfTravelers: 1,
          tripType: 'one-way',
          minPrice: '0',
          maxPrice: '900'
        };
        
        console.log('Setting initial filters from location state:', initialFilters);
        setInitialFilters(initialFilters);
        handleInitialSearch(initialFilters);
      }
    }
  }, [cityData, setInitialFilters, handleInitialSearch, initialSearchDone]);
  
  useSeo({
    title: `Buses from ${filters.fromCityName} to ${filters.toCityName} | TravelEase`,
    description: `Find and book bus trips from ${filters.fromCityName} to ${filters.toCityName} with TravelEase.`,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 mt-24">
        <div className="container-custom py-8">
          <div className="flex items-center gap-3 mb-6">
            <Bus size={24} />
            <h1 className="text-3xl font-display font-bold">Buses</h1>
          </div>
          
          <TransportationFilter 
            defaultFromCity={filters.fromCityName}
            defaultToCity={filters.toCityName}
            onFilterChange={updateFilters}
            onSearchClick={handleSearch}
            transportType="bus"
          />
          
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState errorMessage={error} />
          ) : (
            <div className="mb-8">
              {/* Onward Buses Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {filters.tripType === 'round-trip' ? 'Outbound Buses' : 'Available Buses'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {onwardBuses.length > 0 ? (
                    `Found ${onwardBuses.length} buses from ${filters.fromCityName} to ${filters.toCityName}`
                  ) : (
                    `No buses found. Please adjust your search criteria.`
                  )}
                </p>
                
                {onwardBuses.length > 0 ? (
                  onwardBuses.map((bus) => (
                    <TransportationCardV2 
                      key={bus.TransportationID} 
                      transportation={bus} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-md">
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No buses available</h3>
                    <p className="text-gray-500">
                      Try adjusting your search criteria or choose a different date.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Return Buses Section - Only show if tripType is round-trip and we have return buses */}
              {filters.tripType === 'round-trip' && returnBuses.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Return Buses</h2>
                  <p className="text-gray-600 mb-6">
                    Found {returnBuses.length} buses from {filters.toCityName} to {filters.fromCityName}
                  </p>
                  
                  {returnBuses.map((bus) => (
                    <TransportationCardV2 
                      key={bus.TransportationID} 
                      transportation={bus} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BusesList;
