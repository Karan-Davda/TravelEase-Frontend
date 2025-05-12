import { useState, useEffect } from 'react';
import { PackageBasicDetails } from '../PackageCreationWizard';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from '@/hooks/use-toast';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, Upload, Plus, Trash, Loader2, Link } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useCitySearch } from "@/hooks/useCitySearch";

type BasicDetailsStepProps = {
  data: PackageBasicDetails;
  updateData: (data: Partial<PackageBasicDetails>) => void;
  onNext: () => void;
};

const BasicDetailsStep = ({ data, updateData, onNext }: BasicDetailsStepProps) => {
  const { toast } = useToast();
  const [destinationCity, setDestinationCity] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageTabValue, setImageTabValue] = useState<'upload' | 'url'>('upload');
  
  // Use the city search hook for from city
  const fromCitySearch = useCitySearch();

  // Use a separate instance for destination city
  const destinationCitySearch = useCitySearch();

  // Update fromCity in package data whenever selection changes
  useEffect(() => {
    if (fromCitySearch.query) {
      updateData({ fromCity: fromCitySearch.query });
    }
  }, [fromCitySearch.query, updateData]);

  // Update destination city input whenever selection changes
  useEffect(() => {
    if (destinationCitySearch.query) {
      setDestinationCity(destinationCitySearch.query);
    }
  }, [destinationCitySearch.query]);
  
  // Initialize from city search with existing data
  useEffect(() => {
    if (data.fromCity) {
      fromCitySearch.setQuery(data.fromCity);
    }
  }, []);

  // Set image preview from URL when image URL changes
  useEffect(() => {
    if (data.packageImage && typeof data.packageImage === 'string') {
      setImagePreview(data.packageImage);
      setImageUrl(data.packageImage);
      setImageTabValue('url');
    }
  }, []);
  
  const handleDateSelect = (field: 'startDate' | 'endDate', date: Date | undefined) => {
    updateData({ [field]: date });
  };
  
  const handleAddDestination = () => {
    if (!destinationCity.trim()) return;
    
    if (data.destinationCities.includes(destinationCity.trim())) {
      toast({
        title: "City already added",
        description: "This destination city is already in the list.",
        variant: "destructive",
      });
      return;
    }
    
    updateData({
      destinationCities: [...data.destinationCities, destinationCity.trim()]
    });
    setDestinationCity('');
    destinationCitySearch.setQuery('');
  };
  
  const handleRemoveDestination = (index: number) => {
    const newCities = [...data.destinationCities];
    newCities.splice(index, 1);
    updateData({ destinationCities: newCities });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.size > 5 * 1024 * 1024) {  // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image under 5MB.",
        variant: "destructive",
      });
      return;
    }
    
    updateData({ packageImage: file });
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handleApplyImageUrl = () => {
    if (!imageUrl.trim()) {
      toast({
        title: "URL required",
        description: "Please enter an image URL.",
        variant: "destructive",
      });
      return;
    }

    // Test if URL is valid
    const isValidUrl = /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif|svg))$/i.test(imageUrl);
    if (!isValidUrl) {
      toast({
        title: "Invalid image URL",
        description: "Please enter a valid image URL (png, jpg, jpeg, webp).",
        variant: "destructive",
      });
      return;
    }

    setImagePreview(imageUrl);
    updateData({ packageImage: imageUrl });
    
    toast({
      title: "Image URL added",
      description: "The image URL has been added to your package.",
    });
  };

  const handleRemoveImage = () => {
    updateData({ packageImage: null });
    setImagePreview(null);
    setImageUrl('');
  };
  
  const validateForm = () => {
    if (!data.packageName.trim()) {
      toast({
        title: "Package name required",
        description: "Please enter a name for your package.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!data.description.trim()) {
      toast({
        title: "Description required",
        description: "Please enter a description for your package.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!data.fromCity.trim()) {
      toast({
        title: "Origin city required",
        description: "Please enter the departure city.",
        variant: "destructive",
      });
      return false;
    }
    
    if (data.destinationCities.length === 0) {
      toast({
        title: "Destination required",
        description: "Please add at least one destination city.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!data.startDate) {
      toast({
        title: "Start date required",
        description: "Please select a start date for the package.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!data.endDate) {
      toast({
        title: "End date required",
        description: "Please select an end date for the package.",
        variant: "destructive",
      });
      return false;
    }
    
    if (data.endDate < data.startDate) {
      toast({
        title: "Invalid date range",
        description: "End date must be after the start date.",
        variant: "destructive",
      });
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... keep existing code (grid layout for package name and max occupancy) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Package Name */}
        <div className="space-y-2">
          <Label htmlFor="packageName">Package Name*</Label>
          <Input
            id="packageName"
            value={data.packageName}
            onChange={(e) => updateData({ packageName: e.target.value })}
            placeholder="e.g., Epic Western Adventure"
          />
        </div>
        
        {/* Max Occupancy */}
        <div className="space-y-2">
          <Label htmlFor="maxOccupancy">Maximum Group Size*</Label>
          <Input
            id="maxOccupancy"
            type="number"
            min={1}
            value={data.maxOccupancy}
            onChange={(e) => updateData({ maxOccupancy: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Package Description*</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
          placeholder="Describe the package, highlights, what's included, etc."
          rows={4}
        />
      </div>
      
      {/* ... keep existing code (city selection and tour guide option) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* From City - with search */}
        <div className="space-y-2">
          <Label htmlFor="fromCity">Origin City*</Label>
          <div className="relative">
            <Input
              id="fromCity"
              value={fromCitySearch.query}
              onChange={(e) => fromCitySearch.setQuery(e.target.value)}
              placeholder="Enter origin city"
              onFocus={() => {
                if (fromCitySearch.suggestions.length > 0) {
                  fromCitySearch.setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                // Delay hiding to allow clicks on suggestions
                setTimeout(() => fromCitySearch.setShowSuggestions(false), 200);
              }}
            />
            {fromCitySearch.isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
            
            {/* City suggestions dropdown */}
            {fromCitySearch.showSuggestions && fromCitySearch.suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
                <ul className="py-1">
                  {fromCitySearch.suggestions.map((city, index) => (
                    <li
                      key={`city-${index}`}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => fromCitySearch.handleSelectCity(city.CityName)}
                    >
                      {city.CityName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Tour Guide Needed */}
        <div className="flex items-center justify-between space-x-2 pt-8">
          <Label htmlFor="isTourGuideNeeded">Default Tour Guide for Package</Label>
          <Switch
            id="isTourGuideNeeded"
            checked={data.isTourGuideNeeded}
            onCheckedChange={(checked) => updateData({ isTourGuideNeeded: checked })}
          />
        </div>
      </div>
      
      {/* ... keep existing code (destination cities management) */}
      <div className="space-y-4">
        <Label htmlFor="destinationCity">Destination Cities*</Label>
        
        <div className="flex space-x-2 relative">
          <div className="flex-1 relative">
            <Input
              id="destinationCity"
              value={destinationCitySearch.query}
              onChange={(e) => destinationCitySearch.setQuery(e.target.value)}
              placeholder="Enter destination city"
              onFocus={() => {
                if (destinationCitySearch.suggestions.length > 0) {
                  destinationCitySearch.setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                // Delay hiding to allow clicks on suggestions
                setTimeout(() => destinationCitySearch.setShowSuggestions(false), 200);
              }}
            />
            {destinationCitySearch.isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
            
            {/* City suggestions dropdown for destination */}
            {destinationCitySearch.showSuggestions && destinationCitySearch.suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
                <ul className="py-1">
                  {destinationCitySearch.suggestions.map((city, index) => (
                    <li
                      key={`dest-city-${index}`}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onMouseDown={() => destinationCitySearch.handleSelectCity(city.CityName)}
                    >
                      {city.CityName}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <Button 
            type="button" 
            onClick={handleAddDestination}
            disabled={!destinationCity.trim()}
          >
            <Plus size={16} className="mr-1" /> Add
          </Button>
        </div>
        
        {/* List of added cities */}
        {data.destinationCities.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Added destinations:</p>
            <div className="flex flex-wrap gap-2">
              {data.destinationCities.map((city, index) => (
                <div 
                  key={`city-${index}`}
                  className="bg-gray-100 rounded-full px-3 py-1 flex items-center text-sm"
                >
                  <span>{city}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDestination(index)}
                    className="ml-2 text-gray-500 hover:text-red-500"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* ... keep existing code (date range selection) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="startDate"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.startDate ? format(data.startDate, "PPP") : <span>Select start date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.startDate}
                onSelect={(date) => handleDateSelect('startDate', date)}
                initialFocus
                disabled={(date) => date < new Date()}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="endDate"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !data.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {data.endDate ? format(data.endDate, "PPP") : <span>Select end date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.endDate}
                onSelect={(date) => handleDateSelect('endDate', date)}
                initialFocus
                disabled={(date) => {
                  // Disable dates before start date
                  if (data.startDate) {
                    return date < data.startDate;
                  }
                  return date < new Date();
                }}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Modified Image Upload with URL option */}
      <div className="space-y-4">
        <Label htmlFor="packageImage">Package Image</Label>
        
        {/* Added tabs for upload/URL options */}
        <Tabs value={imageTabValue} onValueChange={(v) => setImageTabValue(v as 'upload' | 'url')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload size={16} /> Upload Image
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link size={16} /> Image URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {imagePreview && imageTabValue === 'upload' ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Package preview" 
                    className="max-h-48 mx-auto rounded"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveImage}
                  >
                    <Trash size={16} className="mr-1" /> Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex flex-col items-center">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG or WEBP (max. 5MB)
                    </p>
                  </div>
                  <Input
                    id="packageImage"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Label 
                    htmlFor="packageImage" 
                    className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  >
                    Choose File
                  </Label>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="url">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview && imageTabValue === 'url' ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Package preview" 
                    className="max-h-48 mx-auto rounded"
                  />
                  <div className="flex justify-center space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleRemoveImage}
                    >
                      <Trash size={16} className="mr-1" /> Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col items-center mb-4">
                    <Link className="h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Enter an image URL
                    </p>
                    <p className="text-xs text-gray-500">
                      Must be a direct link to a JPG, PNG, or WEBP image
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={imageUrl}
                      onChange={handleImageUrlChange}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={handleApplyImageUrl}
                      disabled={!imageUrl.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
};

export default BasicDetailsStep;
