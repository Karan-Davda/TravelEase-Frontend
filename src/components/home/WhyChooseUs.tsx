
import { MapPin, Calendar, Search, Mail } from 'lucide-react';

const WhyChooseUs = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Why Choose TravelEase
          </h2>
          <p className="text-lg text-gray-600">
            We simplify your travel planning process from start to finish, 
            giving you more time to enjoy your journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="mb-6 p-3 rounded-full bg-teal-50 inline-block group-hover:bg-primary/10 transition-colors">
              <MapPin size={32} className="text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Custom Trip Builder</h3>
            <p className="text-gray-600">Build a personalized itinerary with flights, hotels, and local experiences, all tailored to your preferences.</p>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="mb-6 p-3 rounded-full bg-teal-50 inline-block group-hover:bg-primary/10 transition-colors">
              <Calendar size={32} className="text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Packages & Local Tours</h3>
            <p className="text-gray-600">Choose from our carefully selected pre-arranged packages and connect with local guides for authentic experiences.</p>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="mb-6 p-3 rounded-full bg-teal-50 inline-block group-hover:bg-primary/10 transition-colors">
              <Search size={32} className="text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-Time Price Comparison</h3>
            <p className="text-gray-600">Compare prices across multiple providers to ensure you're getting the best deal on your bookings.</p>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className="mb-6 p-3 rounded-full bg-teal-50 inline-block group-hover:bg-primary/10 transition-colors">
              <Mail size={32} className="text-primary group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Unified Confirmations</h3>
            <p className="text-gray-600">Receive all your travel confirmations in one place with timely reminders and updates on your trip.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
