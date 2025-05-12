
import { useState, useEffect, useCallback } from 'react';
import { transportationService, Transportation, TransportationResponse } from '@/services/transportationService';
import { useToast } from '@/hooks/use-toast';
import { FilterValues } from '@/components/transportation/TransportationFilter';

type TransportationType = 'flight' | 'bus' | 'train';

export interface TransportDropdownOption {
  value: string;
  label: string;
  details: Transportation;
}

export const useTransportationSearch = (type: TransportationType) => {
  const [onwardItems, setOnwardItems] = useState<Transportation[]>([]);
  const [returnItems, setReturnItems] = useState<Transportation[]>([]);
  const [dropdownOptions, setDropdownOptions] = useState<TransportDropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterValues>({
    fromCityName: '',
    toCityName: '',
    numberOfTravelers: 1,
    tripType: 'one-way',
  });
  const [initialSearchDone, setInitialSearchDone] = useState(false);
  const [shouldSearch, setShouldSearch] = useState(false);
  const { toast } = useToast();

  // Function to fetch data based on filters
  const fetchTransportation = useCallback(async (currentFilters: FilterValues) => {
    if (!currentFilters.fromCityName || !currentFilters.toCityName) {
      return; // Don't fetch if required fields are not set
    }
    
    console.log(`useTransportationSearch - Starting search for ${type}`);
    console.log(`useTransportationSearch - fromCityName: "${currentFilters.fromCityName}"`);
    console.log(`useTransportationSearch - toCityName: "${currentFilters.toCityName}"`);
    
    setLoading(true);
    setError(null);
    
    try {
      let response: TransportationResponse = { onward: [] };
      
      // Pass the filters without additional processing
      switch(type) {
        case 'flight':
          response = await transportationService.getFlights(currentFilters);
          break;
        case 'bus':
          response = await transportationService.getBuses(currentFilters);
          break;
        case 'train':
          response = await transportationService.getTrains(currentFilters);
          break;
      }
      
      // Log the response to debug any issues
      console.log(`Transportation response for ${type}:`, response);
      
      // Check if the onward and return arrays exist and are valid
      if (!response) {
        console.error('Received null or undefined response');
        setOnwardItems([]);
        setReturnItems([]);
        setDropdownOptions([]);
        return;
      }
      
      // Safely set the onward and return items with extensive validation
      const validOnward = Array.isArray(response.onward) ? response.onward.filter(Boolean) : [];
      const validReturn = Array.isArray(response.return) ? response.return.filter(Boolean) : [];
      
      console.log(`Got ${validOnward.length} valid onward items`);
      console.log(`Got ${validReturn.length} valid return items`);
      
      setOnwardItems(validOnward);
      setReturnItems(validReturn);
      
      // Create dropdown options from valid onward items
      const options: TransportDropdownOption[] = validOnward.map(item => ({
        value: String(item.TransportationID),
        label: formatTransportationLabel(item),
        details: item,
      }));
      
      setDropdownOptions(options);
    } catch (err) {
      console.error(`Error fetching ${type} data:`, err);
      setError('Failed to load transportation options');
      toast({
        title: 'Error',
        description: 'Failed to load transportation options. Please try again.',
        variant: 'destructive',
      });
      
      // Reset items to empty arrays on error
      setOnwardItems([]);
      setReturnItems([]);
      setDropdownOptions([]);
    } finally {
      setLoading(false);
      setShouldSearch(false);
    }
  }, [type, toast]);
  
  // Helper function to format transportation labels for dropdown
  const formatTransportationLabel = (transport: Transportation): string => {
    try {
      // Format time for display
      const formatTime = (dateTimeStr: string) => {
        try {
          const date = new Date(dateTimeStr);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
          return "Unknown time";
        }
      };
      
      // Create a descriptive label with key information
      return `${transport.TransportationName} | ${formatTime(transport.DepartureTime)} to ${formatTime(transport.ArrivalTime)} | $${transport.Price}`;
    } catch (error) {
      console.error("Error formatting transportation label", error);
      return `ID: ${transport.TransportationID} - $${transport.Price}`;
    }
  };

  // Effect to handle search when shouldSearch is true
  useEffect(() => {
    if (shouldSearch) {
      fetchTransportation(filters);
    }
  }, [shouldSearch, fetchTransportation, filters]);

  // Set initial filters but don't automatically search
  const setInitialFilters = useCallback((newFilters: FilterValues) => {
    console.log('Setting initial filters:', newFilters);
    setFilters(newFilters);
  }, []);

  // Function to update filters without searching
  const updateFilters = useCallback((newFilters: FilterValues) => {
    console.log('Updating filters:', newFilters);
    setFilters(newFilters);
  }, []);

  // Function for search button click
  const handleSearch = useCallback(() => {
    console.log('Search button clicked with filters:', filters);
    setShouldSearch(true);
  }, [filters]);

  // Function to handle initial search with data from previous page
  const handleInitialSearch = useCallback((initialFilters: FilterValues) => {
    if (!initialSearchDone && initialFilters.fromCityName && initialFilters.toCityName) {
      console.log('Doing initial search with:', initialFilters);
      setInitialSearchDone(true);
      setFilters(initialFilters);
      setShouldSearch(true);
    }
  }, [initialSearchDone]);
  
  // Function to get transportation details by ID
  const getTransportationById = useCallback((id: string): Transportation | undefined => {
    return onwardItems.find(item => String(item.TransportationID) === id);
  }, [onwardItems]);

  return {
    onwardItems,
    returnItems,
    dropdownOptions,
    loading,
    error,
    filters,
    updateFilters,
    setInitialFilters,
    handleSearch,
    handleInitialSearch,
    initialSearchDone,
    getTransportationById,
  };
};
