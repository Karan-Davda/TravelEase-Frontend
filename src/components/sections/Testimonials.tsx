
import Testimonial from './Testimonial';

const Testimonials = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-lg text-gray-600">
            Read about real experiences from our satisfied customers
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Testimonial
            quote={"\"Done,\" I smiled proudly, closing my laptop. \"I just finished planning my Las Vegas vacation with TravelEase. It only took me a few minutes to decide whether I wanted a custom plan or a pre-arranged package—so convenient! TravelEase took all the confusing bits of travel planning and turned them into a clear, flexible experience. I'm officially hooked.\""}
            name="Sarah Johnson"
            role="Travel Enthusiast"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
