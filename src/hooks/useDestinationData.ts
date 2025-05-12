
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { searchService, CityResponse } from '@/services/searchService';

export function useDestinationData(citySlug: string | undefined) {
  const [cityData, setCityData] = useState<CityResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userCity, setUserCity] = useState<string>('');
  const { toast } = useToast();

  // Get user location when component mounts
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        console.log("Attempting to get user location...");
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              console.log("Successfully got coordinates:", position.coords);
              const { latitude, longitude } = position.coords;
              
              // Use reverse geocoding to get city name
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
              const data = await response.json();
              
              if (data.address && data.address.city) {
                const city = data.address.city;
                console.log("User city detected:", city);
                setUserCity(city);
              } else if (data.address && data.address.town) {
                const town = data.address.town;
                console.log("User town detected:", town);
                setUserCity(town);
              } else {
                console.log("Could not determine user city from:", data);
              }
            } catch (err) {
              console.error("Error getting user location details:", err);
            }
          },
          (error) => {
            console.log("Geolocation error:", error.message);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser");
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchCityData = async () => {
      if (!citySlug) {
        setLoading(false);
        setError("No destination specified");
        console.log("No citySlug provided to useDestinationData");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Decode the city name from the URL
        const decodedCityName = decodeURIComponent(citySlug);
        console.log(`Fetching data for city: ${decodedCityName}, user city: ${userCity}`);
        
        const data = await searchService.getCityDetails(decodedCityName, userCity);
        console.log("API data received:", data);
        
        // Validate the data structure before updating state
        if (!data || !data.city) {
          console.error("Invalid data structure:", data);
          throw new Error("Invalid data structure received from API");
        }
        
        setCityData(data);
        console.log("City data set successfully", data);
      } catch (err) {
        console.error('Error fetching city data:', err);
        setError('Failed to load city information. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load city information. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, [citySlug, userCity, toast]);

  return { cityData, loading, error, userCity };
}
