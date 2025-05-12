
import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export interface TransportationType {
  TransportationTypeID: number;
  TransportationType: string;
}

export const useTransportationTypes = () => {
  const [types, setTypes] = useState<TransportationType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTransportationTypes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3000/api/transportation/types');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch transportation types: ${response.status}`);
        }
        
        const data = await response.json();
        setTypes(data);
      } catch (err) {
        console.error("Error fetching transportation types:", err);
        setError("Failed to load transportation types");
        toast({
          title: "Error",
          description: "Failed to load transportation types. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransportationTypes();
  }, [toast]);

  return { types, isLoading, error };
};
