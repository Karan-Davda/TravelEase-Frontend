
import { fetchApi } from '@/utils/apiHelper';

export interface Transportation {
  TransportationID: number;
  TransportationName: string;
  Seats?: number | null;
  Status?: string;
  Created?: string;
  Modified?: string;
  ModifiedBy?: number | null;
  TransportationTypeID?: number;
  FromCityID?: number;
  ToCityID?: number;
  DepartureTime: string;
  ArrivalTime: string;
  Duration: {
    hours: number;
  };
  Price: string;
  Type?: {
    TransportationType: string;
  };
  FromCityName: string;
  ToCityName: string;
  TransportationType?: string;
  Class?: string;
  Stops?: number;
  Airline?: string;
}

export interface TransportationResponse {
  onward: Transportation[];
  return?: Transportation[];
}

interface TransportationFilters {
  fromCityName: string;
  toCityName: string;
  fromDate?: string;
  toDate?: string; // Only for round-trip flights
  minPrice?: string;
  maxPrice?: string;
  numberOfTravelers?: number;
  tripType?: 'one-way' | 'round-trip'; // For flights
}

const API_BASE_URL = 'http://localhost:3000/api';

export const transportationService = {
  // Get transportation with robust error handling and encoding
  getTransportation: async (type: string, filters: TransportationFilters): Promise<TransportationResponse> => {
    try {
      // Use URLSearchParams for proper encoding of query parameters
      const params = new URLSearchParams();
      const queryParts: string[] = [];
      
      // Process each filter parameter
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Don't encode here - we'll pass the raw values and let fetchApi handle encoding correctly
          queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
        }
      });
      
      const queryString = queryParts.join('&');
      const url = `${API_BASE_URL}/transportation/${type}s?${queryString}`;
      
      console.log(`Fetching from URL: ${url}`);
      
      const response = await fetchApi<TransportationResponse>(url);
      
      // Ensure we have valid arrays even if the API returns null or undefined
      return {
        onward: Array.isArray(response?.onward) ? response.onward.filter(Boolean) : [],
        return: Array.isArray(response?.return) ? response.return.filter(Boolean) : []
      };
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      // Return empty arrays to avoid undefined errors
      return { onward: [] };
    }
  },
  
  // Get flights with optional filters
  getFlights: async (filters: TransportationFilters): Promise<TransportationResponse> => {
    return transportationService.getTransportation('flight', filters);
  },
  
  // Get buses with optional filters
  getBuses: async (filters: TransportationFilters): Promise<TransportationResponse> => {
    return transportationService.getTransportation('bus', filters);
  },
  
  // Get trains with optional filters
  getTrains: async (filters: TransportationFilters): Promise<TransportationResponse> => {
    return transportationService.getTransportation('train', filters);
  },
  
  // Format transportation for dropdown display
  formatForDropdown: (transportation: Transportation[]): { value: string, label: string }[] => {
    return transportation.map(item => ({
      value: String(item.TransportationID),
      label: `${item.TransportationName} - ${item.FromCityName} to ${item.ToCityName} - $${item.Price}`
    }));
  }
};
