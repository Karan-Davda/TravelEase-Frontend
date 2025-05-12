
import React from 'react';
import { Users, ArrowRight, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

type TravelersStepProps = {
  adults: number;
  children: number;
  onUpdate: (travelers: { adults: number; children: number }) => void;
  onNext: () => void;
  onBack: () => void;
};

const TravelersStep: React.FC<TravelersStepProps> = ({ 
  adults, 
  children, 
  onUpdate, 
  onNext, 
  onBack 
}) => {
  const handleAdultsChange = (change: number) => {
    const newValue = Math.max(1, adults + change); // Minimum 1 adult
    onUpdate({ adults: newValue, children });
  };

  const handleChildrenChange = (change: number) => {
    const newValue = Math.max(0, children + change);
    onUpdate({ adults, children: newValue });
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    // Store current scroll position
    const currentPosition = window.scrollY;
    
    // Small timeout to allow any state updates to complete before transition
    setTimeout(() => {
      onNext();
      // Restore scroll position
      window.scrollTo(0, currentPosition);
    }, 50);
    
    return false;
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    
    // Store current scroll position
    const currentPosition = window.scrollY;
    
    // Execute the back action
    onBack();
    
    // Restore scroll position
    setTimeout(() => {
      window.scrollTo(0, currentPosition);
    }, 50);
    
    return false;
  };
  
  const isNextDisabled = adults < 1;
  const totalTravelers = adults + children;

  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-center">
        Who's traveling with you?
      </h2>
      
      <div className="max-w-md mx-auto">
        <div className="space-y-8">
          {/* Adults section */}
          <div className="bg-card border rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Adults</h3>
                <p className="text-sm text-muted-foreground">Age 18+</p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleAdultsChange(-1)}
                  disabled={adults <= 1}
                  className="rounded-full"
                >
                  <Minus size={16} />
                </Button>
                <span className="w-8 text-center font-medium text-lg">{adults}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleAdultsChange(1)}
                  className="rounded-full"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Children section */}
          <div className="bg-card border rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg">Children</h3>
                <p className="text-sm text-muted-foreground">Age 0-17</p>
              </div>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleChildrenChange(-1)}
                  disabled={children <= 0}
                  className="rounded-full"
                >
                  <Minus size={16} />
                </Button>
                <span className="w-8 text-center font-medium text-lg">{children}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => handleChildrenChange(1)}
                  className="rounded-full"
                >
                  <Plus size={16} />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Total travelers summary */}
          <div className="bg-muted/40 rounded-lg p-6 border">
            <div className="flex flex-col items-center justify-center gap-2">
              <Users className="text-primary h-8 w-8 mb-2" />
              <span className="font-medium text-xl">
                {totalTravelers} {totalTravelers === 1 ? 'Traveler' : 'Travelers'}
              </span>
              <Progress value={30} className="mt-4 h-2 w-full max-w-xs" />
              <p className="text-sm text-muted-foreground mt-2">Step 3 of 8</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          variant="tertiary" 
          onClick={handleBack}
          className="gap-2"
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={isNextDisabled}
          className="gap-2 min-w-[120px]"
        >
          Next <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TravelersStep;
