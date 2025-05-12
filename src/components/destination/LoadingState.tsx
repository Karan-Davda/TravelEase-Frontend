
import React from 'react';

const LoadingState = () => {
  console.log("Rendering LoadingState component");
  
  return (
    <div className="flex flex-col items-center py-16">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading destination information...</p>
    </div>
  );
};

export default LoadingState;
