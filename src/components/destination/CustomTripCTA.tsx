
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

type CustomTripCTAProps = {
  cityName: string;
};

const CustomTripCTA = ({ cityName }: CustomTripCTAProps) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom text-center">
        <h2 className="text-2xl md:text-3xl font-bold font-display mb-4">Customize your {cityName} trip</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Design your perfect {cityName} vacation with our custom trip planner - 
          choose your dates, activities, and accommodations for a personalized experience.
        </p>
        <Button size="lg" className="animate-pulse" asChild>
          <Link to={`/custom-trip?destination=${encodeURIComponent(cityName)}`}>
            Create Your Custom Trip
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CustomTripCTA;
