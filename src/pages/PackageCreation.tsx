
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PackageCreationWizard from '@/components/package-creation/PackageCreationWizard';
import useSeo from '@/hooks/useSeo';

const PackageCreation = () => {
  const navigate = useNavigate();
  
  // Set page SEO
  useSeo({
    title: "Create New Package - TravelEase",
    description: "Create a new travel package for your customers."
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-12 bg-gray-50">
        <div className="container-custom">
          <div className="mb-6">
            <button 
              onClick={() => navigate('/agency-dashboard')}
              className="text-primary hover:underline flex items-center gap-1"
            >
              <span>← Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold mt-4 mb-2">Create New Package</h1>
            <p className="text-gray-600">Follow the steps below to create a new travel package.</p>
          </div>
          
          <PackageCreationWizard />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PackageCreation;
