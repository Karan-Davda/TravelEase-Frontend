
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import { fetchWithAuth } from '@/utils/apiHelper';
import { Package } from '@/types/packageTypes';
import CallToAction from '@/components/sections/CallToAction';
import { PackagesBrowser } from '@/components/travel-agency/PackagesBrowser';

const Packages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true);
        const data = await fetchWithAuth<Package[]>("http://localhost:3000/api/partners/packages");
        setPackages(data);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackages();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Explore America's Most Beautiful Destinations"
        subtitle="Discover pre-arranged packages and unique experiences across the United States."
        ctaText="Browse Packages"
        ctaLink="#packages-list"
        backgroundImage="https://images.unsplash.com/photo-1501594907352-04cda38ebc29"
      />
      
      {/* Main Content */}
      <section id="packages-list" className="py-16 bg-white scroll-mt-20">
        <div className="container-custom">
          <PackagesBrowser packages={packages} isLoading={isLoading} />
        </div>
      </section>
      
      {/* Call to Action */}
      <CallToAction
        title="Can't Find What You're Looking For?"
        description="Create a customized American adventure tailored specifically to your preferences and budget."
        primaryButtonText="Build Custom Trip"
        primaryButtonLink="/custom-trip"
        backgroundImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
      />
      
      <Footer />
    </div>
  );
};

export default Packages;
