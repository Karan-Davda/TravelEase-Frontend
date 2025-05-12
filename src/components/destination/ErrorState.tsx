
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type ErrorStateProps = {
  errorMessage: string | null;
};

const ErrorState = ({ errorMessage }: ErrorStateProps) => {
  console.log("Rendering ErrorState with:", errorMessage);
  
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-6">{errorMessage || 'Could not load destination information.'}</p>
      <div className="space-y-4">
        <Button asChild className="mr-4">
          <Link to="/">Return Home</Link>
        </Button>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;
