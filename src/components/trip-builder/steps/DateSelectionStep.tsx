import React from 'react';
import { format } from 'date-fns';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

type DateSelectionStepProps = {
  startDate?: Date;
  endDate?: Date;
  onUpdate: (dates: { startDate?: Date; endDate?: Date }) => void;
  onNext: () => void;
  onBack: () => void;
};

const DateSelectionStep: React.FC<DateSelectionStepProps> = ({ 
  startDate, 
  endDate, 
  onUpdate, 
  onNext, 
  onBack 
}) => {
  // Keep track of current position to prevent page jump
  const handleNext = (e: React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    const currentPosition = window.scrollY;
    
    setTimeout(() => {
      onNext();
      window.scrollTo(0, currentPosition);
    }, 50);
    
    return false;
  };

  const handleBack = (e: React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    const currentPosition = window.scrollY;
    
    onBack();
    
    setTimeout(() => {
      window.scrollTo(0, currentPosition);
    }, 50);
    
    return false;
  };

  const handleDepartureChange = (date: Date | undefined) => {
    onUpdate({ 
      startDate: date, 
      endDate: date && endDate && date > endDate ? date : endDate 
    });
  };

  const handleReturnChange = (date: Date | undefined) => {
    onUpdate({ startDate, endDate: date });
  };

  const isNextDisabled = !startDate;

  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-center">
        When would you like to travel?
      </h2>
      
      <div className="max-w-md mx-auto">
        <div className="space-y-6 mb-8">
          {/* Departure Date */}
          <div className="space-y-2">
            <label htmlFor="departure-date" className="block text-sm font-medium text-gray-700">
              Departure Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="departure-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "MMM d, yyyy")
                  ) : (
                    <span>Select departure date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={handleDepartureChange}
                  disabled={{ before: new Date() }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Return Date */}
          <div className="space-y-2">
            <label htmlFor="return-date" className="block text-sm font-medium text-gray-700">
              Return Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="return-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate ? (
                    format(endDate, "MMM d, yyyy")
                  ) : (
                    <span>Select return date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={handleReturnChange}
                  disabled={{ before: startDate || new Date() }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {startDate && endDate && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Departure</p>
                <p className="font-semibold">{format(startDate, "MMM d, yyyy")}</p>
              </div>
              <ArrowRight className="text-gray-400" size={20} />
              <div>
                <p className="text-sm text-gray-500">Return</p>
                <p className="font-semibold">{endDate ? format(endDate, "MMM d, yyyy") : "Not set"}</p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-500">
                Duration: {endDate ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) : 0} days
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isNextDisabled}
          className="min-w-[120px]"
        >
          Next <ArrowRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DateSelectionStep;
