
import { fetchApi } from '@/utils/apiHelper';

const API_BASE_URL = 'http://localhost:3000/api';

// Interface for city suggestion response
export interface CitySuggestion {
  CityName: string;
}

// Transportation type interface
interface Transportation {
  TransportationID: number;
  TransportationName: string;
  Seats: number | null;
  Status: string;
  Created: string;
  Modified: string;
  ModifiedBy: number | null;
  TransportationTypeID: number;
  FromCityID: number;
  ToCityID: number;
  DepartureTime: string;
  ArrivalTime: string;
  Duration: {
    hours: number;
  };
  Price: string;
  Type?: {
    TransportationType: string;
  };
  FromCityName?: string;
  ToCityName?: string;
  TransportationType?: string;
}

// Interface for city data response
export interface CityResponse {
  city: {
    CityID: number;
    CityName: string;
    StateID: number;
    Description: string;
    PhotoURL: string;
    Created: string;
    Modified: string;
    ModifiedBy: number;
  };
  experiences: Array<{
    ExperienceID: number;
    ExperienceName: string;
    IsTicket: boolean;
    Amount: string;
    CityID: number;
    Description: string;
    PhotoURL: string;
    Status: string;
    Created: string;
    Modified: string;
    ModifiedBy: number;
  }>;
  accommodations: Array<{
    AccommodationID: number;
    AccommodationName: string;
    Address: string;
    Email: string;
    Phone: string;
    Rooms: number;
    Status: string;
    Created: string;
    Modified: string;
    ModifiedBy: number;
    AccommodationTypeID: number;
    CityID: number;
    Rating: string;
    PricePerNight: string;
    Description: string;
  }>;
  packages: Array<any>;
  transportation?: Array<Transportation>;
  Flight?: Array<Transportation>;
  Train?: Array<Transportation>;
  Bus?: Array<Transportation>;
}

export const searchService = {
  /**
   * Get city suggestions based on search query
   * Only called when query is 3+ characters
   */
  getSuggestedCities: async (query: string): Promise<CitySuggestion[]> => {
    if (query.length < 3) {
      return [];
    }
    
    try {
      // For city suggestions, we send the raw query - server handles encoding
      // This prevents double encoding issues
      console.log('Raw query for city search:', query);
      const response = await fetchApi<CitySuggestion[]>(
        `${API_BASE_URL}/search/suggestCities?q=${query}`
      );
      console.log('City suggestions response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
      return [];
    }
  },

  /**
   * Get detailed city information including experiences, accommodations, and transportation options
   */
  getCityDetails: async (cityName: string, userCity: string = ''): Promise<CityResponse> => {
    try {
      // For city details, we use the raw city names - server handles encoding
      // This prevents double encoding issues
      console.log('Raw city name:', cityName);
      console.log('Raw user city:', userCity);
      
      const response = await fetchApi<CityResponse>(
        `${API_BASE_URL}/search/city?searchedCityName=${cityName}&userCity=${userCity}`
      );
      console.log('City details response:', response);
      return response;
    } catch (error) {
      console.error('Error fetching city details:', error);
      throw error;
    }
  }
};
