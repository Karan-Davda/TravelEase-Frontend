
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PackageCreationWizard from '@/components/package-creation/PackageCreationWizard';
import useSeo from '@/hooks/useSeo';
import { Skeleton } from '@/components/ui/skeleton';

const PackageEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [packageData, setPackageData] = useState(null);
  
  // Set page SEO
  useSeo({
    title: "Edit Package - TravelEase",
    description: "Edit your travel package."
  });
  
  useEffect(() => {
    // In a real implementation, we would fetch package data from API
    // For now we'll just simulate a loading state
    const fetchPackageData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPackageData({});
      } catch (error) {
        console.error('Error fetching package data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPackageData();
  }, [id]);

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
            <h1 className="text-3xl font-bold mt-4 mb-2">Edit Package</h1>
            <p className="text-gray-600">Make changes to your existing travel package.</p>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-12 w-1/3 ml-auto" />
            </div>
          ) : (
            <PackageCreationWizard isEditMode={true} packageId={id} />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PackageEdit;
