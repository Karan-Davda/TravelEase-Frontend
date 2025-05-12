
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { fetchApi } from '@/utils/apiHelper';

export interface Accommodation {
  AccommodationID: number;
  AccommodationName: string;
  Address: string;
  Email?: string;
  Phone?: string;
  Rooms?: number;
  Status?: string;
  Created?: string;
  Modified?: string;
  ModifiedBy?: number;
  AccommodationTypeID: number;
  CityID: number;
  Rating: string;
  PricePerNight: string;
  Description: string;
  Type?: string;
}

interface AccommodationSearchParams {
  cityName?: string;
  fromCity?: string;
  toCity?: string;
  fromDate?: string;
  toDate?: string;
}

export const useAccommodations = (params: AccommodationSearchParams) => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAccommodations = async () => {
      // Determine which API endpoint to use based on provided parameters
      if ((!params.fromCity || !params.toCity) && !params.cityName) {
        return; // Don't fetch if required parameters are missing
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        let url = '';
        const queryParts: string[] = [];
        
        // If we have fromCity and toCity, use the new search endpoint
        if (params.fromCity && params.toCity) {
          url = 'http://localhost:3000/api/accommodation/search';
          
          // Use proper encoding for each parameter
          if (params.fromCity) {
            queryParts.push(`FromCity=${encodeURIComponent(params.fromCity)}`);
          }
          
          if (params.toCity) {
            queryParts.push(`ToCity=${encodeURIComponent(params.toCity)}`);
          }
          
          if (params.fromDate) {
            queryParts.push(`FromDate=${encodeURIComponent(params.fromDate)}`);
          }
          
          if (params.toDate) {
            queryParts.push(`ToDate=${encodeURIComponent(params.toDate)}`);
          }
        } else if (params.cityName) {
          // Use the original endpoint for cityName search
          url = 'http://localhost:3000/api/accommodations';
          queryParts.push(`cityName=${encodeURIComponent(params.cityName)}`);
        }
        
        const queryString = queryParts.join('&');
        const fullUrl = `${url}?${queryString}`;
        
        console.log(`Fetching accommodations from: ${fullUrl}`);
        
        const data = await fetchApi<Accommodation[]>(fullUrl);
        
        if (Array.isArray(data)) {
          setAccommodations(data);
          console.log(`Received ${data.length} accommodations`);
        } else {
          console.error('Invalid accommodation data format received:', data);
          setAccommodations([]);
        }
      } catch (err) {
        console.error("Error fetching accommodations:", err);
        setError("Failed to load accommodations");
        toast({
          title: "Error",
          description: "Failed to load accommodations. Please try again.",
          variant: "destructive",
        });
        setAccommodations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccommodations();
  }, [params.cityName, params.fromCity, params.toCity, params.fromDate, params.toDate, toast]);

  return { accommodations, isLoading, error };
};
