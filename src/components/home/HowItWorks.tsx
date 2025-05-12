
const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            How TravelEase Works
          </h2>
          <p className="text-lg text-gray-600">
            Your journey across America from planning to destination in just a few simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <span className="text-2xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Tell Us Your Preferences</h3>
            <p className="text-gray-600">
              Choose a destination, dates, and your travel preferences through our simple form.
            </p>
          </div>
          <div className="text-center group">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <span className="text-2xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Customize Your Itinerary</h3>
            <p className="text-gray-600">
              Browse our recommendations and customize your trip with flights, hotels, and experiences.
            </p>
          </div>
          <div className="text-center group">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <span className="text-2xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Book & Go</h3>
            <p className="text-gray-600">
              Secure your trip with a single payment, receive all confirmations, and enjoy your journey!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
