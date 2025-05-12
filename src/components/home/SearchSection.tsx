
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { searchService, CitySuggestion } from '@/services/searchService';
import { useToast } from '@/hooks/use-toast';
import { debounce } from '@/utils/debounce';

const SearchSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<CitySuggestion[]>([]);
  const [selectedCity, setSelectedCity] = useState<CitySuggestion | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // Create a debounced version of the search function
  const debouncedSearch = debounce(async (query: string) => {
    if (query.length >= 3) {
      setIsSearching(true);
      try {
        const suggestions = await searchService.getSuggestedCities(query);
        setCitySuggestions(suggestions);
      } catch (error) {
        console.error('Error fetching city suggestions:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch city suggestions. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSearching(false);
      }
    } else {
      setCitySuggestions([]);
    }
  }, 300);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedCity(null);
    setIsTyping(true);
    
    // Only trigger search when query is 3+ characters
    debouncedSearch(query);
  };
  
  const handleCitySelect = (city: CitySuggestion) => {
    setSelectedCity(city);
    setSearchQuery(city.CityName);
    setCitySuggestions([]);
  };
  
  const handleSearch = () => {
    if (selectedCity) {
      // Use the selected city name directly without converting to lowercase or replacing spaces
      navigate(`/destination/${encodeURIComponent(selectedCity.CityName)}`);
    } else if (searchQuery.trim()) {
      // If no city is selected but there's a query, use the query
      navigate(`/destination/${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const showSuggestions = searchQuery.length >= 3 && citySuggestions.length > 0;

  return (
    <section className="py-8 bg-white relative">
      <div className="container-custom -mt-20 relative z-20">
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <Popover open={showSuggestions}>
                <PopoverTrigger asChild>
                  <div className="flex">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        type="text"
                        placeholder="Search the desire city you want to visit"
                        className="pl-10 pr-4 py-3 h-12 text-lg rounded-l-md"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <Button 
                      className="rounded-l-none h-12 px-8" 
                      size="lg"
                      disabled={!selectedCity}
                      onClick={handleSearch}
                    >
                      Search
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start" sideOffset={5}>
                  <div className="max-h-72 overflow-y-auto py-2">
                    {citySuggestions.map((city, index) => (
                      <div
                        key={index}
                        className="block px-4 py-2 hover:bg-muted text-sm cursor-pointer"
                        onClick={() => handleCitySelect(city)}
                      >
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2 text-gray-400" />
                          <div>
                            <span className="font-medium">{city.CityName}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
