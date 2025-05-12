
import { useState, useEffect } from 'react';
import { searchService, CitySuggestion } from '@/services/searchService';
import { debounce } from '@/utils/debounce';

export const useCitySearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async (searchQuery: string) => {
      if (searchQuery.length >= 3) {
        setIsLoading(true);
        try {
          // Pass the raw query directly - server handles encoding appropriately
          // Don't encode here at all since we'll assume the server already does
          const results = await searchService.getSuggestedCities(searchQuery);
          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch city suggestions:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debouncedFetchSuggestions = debounce(fetchSuggestions, 300);
    
    if (query.length >= 3) {
      debouncedFetchSuggestions(query);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSelectCity = (cityName: string) => {
    setQuery(cityName);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    showSuggestions,
    setShowSuggestions,
    handleSelectCity
  };
};
