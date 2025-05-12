
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TripBuilderWizard from '@/components/trip-builder/TripBuilderWizard';

const CustomTripBuilder = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-10 md:py-16 bg-gray-50">
        <div className="container-custom px-4">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-center">
            Build Your Custom Trip
          </h1>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
            Create your perfect travel experience by selecting transportation, accommodation, 
            rental car, tour guide, and local experiences all in one place.
          </p>
          
          <TripBuilderWizard />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CustomTripBuilder;
