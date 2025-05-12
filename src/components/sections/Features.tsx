
import { MapPin, Calendar, Search, Mail } from 'lucide-react';
import FeatureCard from './FeatureCard';

const Features = () => {
  const features = [
    {
      title: "Custom Trip Builder",
      description: "Build a personalized itinerary with flights, hotels, and local experiences, all tailored to your preferences.",
      icon: MapPin,
    },
    {
      title: "Packages & Local Tours",
      description: "Choose from our carefully selected pre-arranged packages and connect with local guides for authentic experiences.",
      icon: Calendar,
    },
    {
      title: "Real-Time Price Comparison",
      description: "Compare prices across multiple providers to ensure you're getting the best deal on your bookings.",
      icon: Search,
    },
    {
      title: "Unified Confirmations",
      description: "Receive all your travel confirmations in one place with timely reminders and updates on your trip.",
      icon: Mail,
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Choose TravelEase</h2>
          <p className="text-lg text-gray-600">
            We simplify your travel planning process from start to finish, 
            giving you more time to enjoy your journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
