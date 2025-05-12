
import React, { useEffect } from 'react';
import { TrainFront } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { TransportationFilter, FilterValues } from '@/components/transportation/TransportationFilter';
import TransportationCardV2 from '@/components/transportation/TransportationCardV2';
import { useTransportationSearch } from '@/hooks/useTransportationSearch';
import LoadingState from '@/components/destination/LoadingState';
import ErrorState from '@/components/destination/ErrorState';
import useSeo from '@/hooks/useSeo';

const TrainsList = () => {
  const location = useLocation();
  const cityData = location.state || { fromCityName: '', toCityName: '', userCity: '' };
  
  const { 
    onwardItems: onwardTrains, 
    returnItems: returnTrains,
    loading, 
    error, 
    filters, 
    updateFilters, 
    setInitialFilters,
    handleSearch,
    handleInitialSearch,
    initialSearchDone
  } = useTransportationSearch('train');
  
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
      // If we just have fromCity and toCity (direct navigation to trains page)
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
    title: `Trains from ${filters.fromCityName} to ${filters.toCityName} | TravelEase`,
    description: `Find and book train rides from ${filters.fromCityName} to ${filters.toCityName} with TravelEase.`,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 mt-24">
        <div className="container-custom py-8">
          <div className="flex items-center gap-3 mb-6">
            <TrainFront size={24} />
            <h1 className="text-3xl font-display font-bold">Trains</h1>
          </div>
          
          <TransportationFilter 
            defaultFromCity={filters.fromCityName}
            defaultToCity={filters.toCityName}
            onFilterChange={updateFilters}
            onSearchClick={handleSearch}
            transportType="train"
          />
          
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState errorMessage={error} />
          ) : (
            <div className="mb-8">
              {/* Onward Trains Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {filters.tripType === 'round-trip' ? 'Outbound Trains' : 'Available Trains'}
                </h2>
                <p className="text-gray-600 mb-6">
                  {onwardTrains.length > 0 ? (
                    `Found ${onwardTrains.length} trains from ${filters.fromCityName} to ${filters.toCityName}`
                  ) : (
                    `No trains found. Please adjust your search criteria.`
                  )}
                </p>
                
                {onwardTrains.length > 0 ? (
                  onwardTrains.map((train) => (
                    <TransportationCardV2 
                      key={train.TransportationID} 
                      transportation={train} 
                    />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-md">
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No trains available</h3>
                    <p className="text-gray-500">
                      Try adjusting your search criteria or choose a different date.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Return Trains Section - Only show if tripType is round-trip and we have return trains */}
              {filters.tripType === 'round-trip' && returnTrains.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Return Trains</h2>
                  <p className="text-gray-600 mb-6">
                    Found {returnTrains.length} trains from {filters.toCityName} to {filters.fromCityName}
                  </p>
                  
                  {returnTrains.map((train) => (
                    <TransportationCardV2 
                      key={train.TransportationID} 
                      transportation={train} 
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

export default TrainsList;
