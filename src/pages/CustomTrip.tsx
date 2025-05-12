
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, Wallet, Plane, Train, Bus, Car, Hotel, Search, Compass } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TripSearchForm from '@/components/forms/TripSearchForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import TourCard from '@/components/sections/TourCard';
import { useIsMobile } from '@/hooks/use-mobile';

const popularDestinations = [
  {
    id: 1,
    name: "New York",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1470&auto=format&fit=crop",
    price: 899
  },
  {
    id: 2,
    name: "Miami",
    image: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?q=80&w=1470&auto=format&fit=crop",
    price: 749
  },
  {
    id: 3,
    name: "Las Vegas",
    image: "https://images.unsplash.com/photo-1605833556294-ea5c7a74f57d?q=80&w=1474&auto=format&fit=crop",
    price: 649
  },
  {
    id: 4,
    name: "San Francisco",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1470&auto=format&fit=crop",
    price: 799
  }
];

const dealPackages = [
  {
    id: "1",
    title: "New York Weekend Escape",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
    description: "3-night stay with flights and Broadway show tickets included",
    price: 899,
    duration: "3 days",
    rating: 4.7,
    reviewCount: 86,
    maxGroupSize: 2,
    featured: true
  },
  {
    id: "2",
    title: "Miami Beach Getaway",
    image: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f",
    description: "5-night luxury beach resort with spa treatments and transfers",
    price: 1199,
    duration: "5 days",
    rating: 4.9,
    reviewCount: 112,
    maxGroupSize: 4,
    featured: false
  },
  {
    id: "3",
    title: "Grand Canyon Explorer",
    image: "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722",
    description: "Adventure tour with guided hikes and premium accommodations",
    price: 1299,
    duration: "6 days",
    rating: 4.8,
    reviewCount: 94,
    maxGroupSize: 8,
    featured: false
  }
];

const CustomTrip = () => {
  const navigate = useNavigate();
  const searchFormRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const scrollToSearchForm = () => {
    searchFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section with Search Form - Fixed height and padding */}
      <section className="relative pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2070&auto=format')" }}
        ></div>
        
        <div className="container-custom relative z-20 flex flex-col justify-center py-12">
          <div className="max-w-3xl mx-auto text-center mb-6 px-4">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
              Build Your Perfect Custom Trip
            </h1>
          </div>
          
          {/* Search form without any tabs - they will be contained in the TripSearchForm component */}
          <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto w-full" ref={searchFormRef}>            
            <div className="p-4 md:p-6">
              <TripSearchForm variant="hero" />
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Destinations */}
      <section className="py-12 md:py-16 bg-white overflow-hidden">
        <div className="container-custom px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 md:mb-8">Popular Destinations</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {popularDestinations.map(destination => (
              <div 
                key={destination.id}
                className="relative rounded-lg overflow-hidden h-48 md:h-64 group cursor-pointer shadow-md hover:shadow-xl transition-shadow"
                onClick={() => navigate(`/custom-trip/results?destination=${destination.name}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-10"></div>
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-semibold text-white">{destination.name}</h3>
                  <p className="text-white/90">Packages from <span className="font-bold text-white">${destination.price}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Deal Packages */}
      <section className="py-12 md:py-16 bg-gray-50 overflow-x-hidden">
        <div className="container-custom px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4 md:mb-0">Hot Deals & Packages</h2>
            <Button 
              variant="outline" 
              className="w-full md:w-auto border-primary text-primary hover:bg-primary/10"
              onClick={() => navigate('/packages')}
            >
              View All Packages
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dealPackages.map(pkg => (
              <TourCard
                key={pkg.id}
                id={pkg.id}
                title={pkg.title}
                image={pkg.image}
                description={pkg.description}
                price={pkg.price}
                duration={pkg.duration}
                rating={pkg.rating}
                reviewCount={pkg.reviewCount}
                maxGroupSize={pkg.maxGroupSize}
                featured={pkg.featured}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Trip Builder */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Advanced Trip Builder</h2>
              <p className="text-lg text-gray-600 mb-6">
                Need more options? Our advanced trip builder lets you customize every detail of your journey.
              </p>
              <Button 
                onClick={() => navigate('/custom-trip/builder')}
                className="w-full md:w-auto bg-accent hover:bg-accent/90 text-white"
                size="lg"
              >
                Launch Trip Builder
              </Button>
            </div>
            <div className="md:w-1/2 mt-6 md:mt-0">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <MapPin size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Choose Your Destinations</h3>
                        <p className="text-sm text-gray-600">Add multiple stops to your journey</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <Hotel size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Handpick Accommodations</h3>
                        <p className="text-sm text-gray-600">Select from premium hotels and resorts</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center">
                        <Compass size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Add a Tour Guide</h3>
                        <p className="text-sm text-gray-600">Enhance your trip with a local expert</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Book With Us */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container-custom px-4">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-6 md:mb-10 text-center">Why Book With Us</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Price Guarantee</h3>
              <p className="text-gray-600">
                We'll match any lower price you find elsewhere or refund the difference.
              </p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Our travel experts are available around the clock to assist with any issues.
              </p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Tour Guides</h3>
              <p className="text-gray-600">
                Add a knowledgeable local guide to enhance your travel experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomTrip;
