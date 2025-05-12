
import Navbar from '@/components/Navbar';
import Hero from '@/components/sections/Hero';
import Footer from '@/components/Footer';
import CallToAction from '@/components/sections/CallToAction';
import SearchSection from '@/components/home/SearchSection';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import HowItWorks from '@/components/home/HowItWorks';
import FeaturedTours from '@/components/home/FeaturedTours';
import PopularDestinations from '@/components/home/PopularDestinations';
import { featuredTours, popularDestinations } from '@/data/homeData';
import useSeo from '@/hooks/useSeo';

const Index = () => {
  // Set page SEO
  useSeo({
    title: "TravelEase - Discover America's Most Beautiful Destinations",
    description: "Plan your perfect American vacation with TravelEase. All your flights, hotels, and local experiences across the USA—in one seamless booking flow."
  });
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <Hero 
        title="Discover America's Most Beautiful Destinations"
        subtitle="From coast to coast, explore the diverse landscapes and vibrant cities of the USA with our curated travel experiences."
        backgroundImage="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80"
        showCta={false}
      />
      
      {/* Search Form */}
      <SearchSection />

      {/* Features with gradient background */}
      <WhyChooseUs />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Featured Tours */}
      <FeaturedTours tours={featuredTours} />
      
      {/* Popular Destinations */}
      <PopularDestinations destinations={popularDestinations} />
      
      {/* Call to Action */}
      <CallToAction
        title="Ready to Explore America?"
        description="Plan your dream US vacation today with our all-in-one travel platform."
        primaryButtonText="Plan Custom Trip"
        primaryButtonLink="/custom-trip"
        secondaryButtonText="Browse Packages"
        secondaryButtonLink="/packages"
        backgroundImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80"
      />
      
      <Footer />
    </div>
  );
};

export default Index;
