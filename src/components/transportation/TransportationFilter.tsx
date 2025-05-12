
import React, { useState, useEffect } from 'react';
import { Calendar, Search, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

interface TransportationFilterProps {
  defaultFromCity: string;
  defaultToCity: string;
  onFilterChange: (filters: FilterValues) => void;
  onSearchClick: () => void;
  transportType: 'flight' | 'bus' | 'train';
}

export interface FilterValues {
  fromCityName: string;
  toCityName: string;
  fromDate?: string;
  toDate?: string;
  minPrice?: string;
  maxPrice?: string;
  numberOfTravelers: number;
  tripType?: 'one-way' | 'round-trip';
}

export const TransportationFilter = ({ 
  defaultFromCity,
  defaultToCity,
  onFilterChange,
  onSearchClick,
  transportType
}: TransportationFilterProps) => {
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>();
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 800]);
  
  const form = useForm<FilterValues>({
    defaultValues: {
      fromCityName: defaultFromCity || '',
      toCityName: defaultToCity || '',
      numberOfTravelers: 1,
      tripType: 'one-way',
      minPrice: '50',
      maxPrice: '800'
    },
  });

  // Update form when defaultFromCity/defaultToCity changes
  useEffect(() => {
    if (defaultFromCity) {
      form.setValue('fromCityName', defaultFromCity);
    }
    if (defaultToCity) {
      form.setValue('toCityName', defaultToCity);
    }
  }, [defaultFromCity, defaultToCity, form]);

  const showRoundTrip = transportType === 'flight';
  const tripType = form.watch('tripType');
  const isRoundTrip = tripType === 'round-trip';

  const handleSubmit = (values: FilterValues) => {
    // Format dates to YYYY-MM-DD
    const formattedValues = {
      ...values,
      fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
      toDate: toDate && isRoundTrip ? format(toDate, 'yyyy-MM-dd') : undefined,
      minPrice: priceRange[0].toString(),
      maxPrice: priceRange[1].toString(),
    };
    
    onFilterChange(formattedValues);
  };

  const handleSearch = () => {
    form.handleSubmit(handleSubmit)();
    onSearchClick();
  };

  const handleReset = () => {
    form.reset({
      fromCityName: '',
      toCityName: '',
      numberOfTravelers: 1,
      tripType: 'one-way',
    });
    setFromDate(new Date());
    setToDate(undefined);
    setPriceRange([50, 800]);
  };
  
  return (
    <Card className="p-4 mb-8 bg-white shadow">
      <Form {...form}>
        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-4">
          {/* Trip Type row - Only for flights */}
          {showRoundTrip && (
            <div className="flex items-center space-x-6">
              <FormField
                control={form.control}
                name="tripType"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-4"
                        value={field.value}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="round-trip" id="round-trip" className="text-pink-500" />
                          <FormLabel htmlFor="round-trip" className="text-sm font-medium cursor-pointer">Round trip</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="one-way" id="one-way" className="text-pink-500" />
                          <FormLabel htmlFor="one-way" className="text-sm font-medium cursor-pointer">One way</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Main filter row - Cities, dates and travelers now on same row */}
          <div className="grid grid-cols-12 gap-4">
            {/* From City */}
            <div className={`${isRoundTrip ? 'col-span-2' : 'col-span-3'}`}>
              <FormField
                control={form.control}
                name="fromCityName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-medium">From</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="From city" className="w-full" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* To City */}
            <div className={`${isRoundTrip ? 'col-span-2' : 'col-span-3'}`}>
              <FormField
                control={form.control}
                name="toCityName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-medium">To</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="To city" className="w-full" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {/* Departure Date */}
            <div className={`${isRoundTrip ? 'col-span-3' : 'col-span-3'}`}>
              <FormItem className="space-y-1">
                <FormLabel className="text-sm font-medium">Departure Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "MMM d, yyyy") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            </div>
            
            {/* Return Date - Only for round-trip */}
            {isRoundTrip && (
              <div className="col-span-3">
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium">Return Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {toDate ? format(toDate, "MMM d, yyyy") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                        disabled={(date) => 
                          (fromDate ? date < fromDate : false)
                        }
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              </div>
            )}
            
            {/* Travelers - Moved to the second line as requested */}
            <div className={`${isRoundTrip ? 'col-span-2' : 'col-span-3'}`}>
              <FormField
                control={form.control}
                name="numberOfTravelers"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-medium">Travelers</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min={1} 
                        className="w-full"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Price Range - Third Row */}
          <div>
            <div className="flex flex-col space-y-1">
              <FormLabel className="text-sm font-medium">Price Range: ${priceRange[0]} - ${priceRange[1]}</FormLabel>
              <Slider 
                defaultValue={[50, 800]} 
                max={900} 
                step={10}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value as [number, number])}
                className="my-2"
              />
            </div>
          </div>

          <Separator className="my-4" />
          
          {/* Buttons - Fourth Row - Reordered with Search first */}
          <div className="flex justify-end space-x-4">
            <Button 
              type="submit" 
              className="bg-[#f1365e] hover:bg-[#d01c45] text-white"
            >
              <Search size={16} className="mr-2" />
              Search
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="bg-gray-200 hover:bg-gray-300"
              onClick={handleReset}
            >
              <RefreshCcw size={16} className="mr-2" />
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};
