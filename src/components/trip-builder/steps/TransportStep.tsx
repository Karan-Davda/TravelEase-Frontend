
import React from 'react';
import { ArrowRight, ArrowLeft, Plane, Train, Bus, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TransportMode } from '../TripBuilderWizard';

type TransportStepProps = {
  selectedMode?: TransportMode;
  onUpdate: (mode: TransportMode) => void;
  onNext: () => void;
  onBack: () => void;
};

const transportOptions = [
  { id: 'flight' as TransportMode, label: 'Flight', icon: Plane, color: 'bg-blue-50 text-blue-600' },
  { id: 'train' as TransportMode, label: 'Train', icon: Train, color: 'bg-green-50 text-green-600' },
  { id: 'bus' as TransportMode, label: 'Bus', icon: Bus, color: 'bg-amber-50 text-amber-600' },
  { id: 'car' as TransportMode, label: 'Car Rental', icon: Car, color: 'bg-purple-50 text-purple-600' },
];

const TransportStep: React.FC<TransportStepProps> = ({ 
  selectedMode, 
  onUpdate, 
  onNext, 
  onBack 
}) => {
  const handleSelectMode = (mode: TransportMode) => {
    onUpdate(mode);
  };

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

  const isNextDisabled = !selectedMode;

  return (
    <div className="py-6 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 text-center">
        How would you like to travel?
      </h2>
      
      <div className="max-w-xl mx-auto">
        <Tabs 
          defaultValue={selectedMode || ""} 
          onValueChange={(value) => onUpdate(value as TransportMode)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-6 w-full">
            {transportOptions.map((option) => (
              <TabsTrigger 
                key={option.id} 
                value={option.id}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {option.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {transportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <TabsContent key={option.id} value={option.id} className="mt-0">
                <div className="flex flex-col items-center p-6 rounded-lg border border-muted bg-card">
                  <div className={`w-24 h-24 ${option.color} rounded-full flex items-center justify-center mb-6 animate-scale-in`}>
                    <Icon size={48} />
                  </div>
                  <h3 className="text-xl font-medium mb-3">{option.label}</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-4">
                    {option.id === 'flight' && "Convenient air travel to your destination"}
                    {option.id === 'train' && "Scenic and comfortable rail journey"}
                    {option.id === 'bus' && "Affordable and flexible bus travel"}
                    {option.id === 'car' && "Freedom to explore at your own pace"}
                  </p>
                  
                  {/* Progress indicator */}
                  <div className="w-full max-w-xs mt-4">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{width: '40%'}}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
        
        {selectedMode && (
          <div className="mt-6 text-center animate-fade-in">
            <p className="text-muted-foreground">
              {selectedMode === 'flight' && "You'll fly to your destination"}
              {selectedMode === 'train' && "You'll travel by train"}
              {selectedMode === 'bus' && "You'll travel by bus"}
              {selectedMode === 'car' && "You'll rent a car for your trip"}
            </p>
          </div>
        )}
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

export default TransportStep;
