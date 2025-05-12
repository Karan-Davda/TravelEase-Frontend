
import React from 'react';

type HeroBannerProps = {
  cityName: string;
  description: string;
  photoURL: string;
};

const HeroBanner = ({ cityName, description, photoURL }: HeroBannerProps) => {
  console.log("Rendering HeroBanner with:", { cityName, description, photoURL });
  
  return (
    <div 
      className="relative h-[50vh] flex items-center"
      style={{
        backgroundImage: `url(${photoURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container-custom relative z-10 text-center py-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4">
          {cityName || 'Destination'}
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-white/90">
          {description || 'Explore this amazing destination with TravelEase'}
        </p>
      </div>
    </div>
  );
};

export default HeroBanner;
