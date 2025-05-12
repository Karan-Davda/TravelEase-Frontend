
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, ChevronDown } from 'lucide-react';

type Tour = {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  dates: string;
  maxGroupSize: number;
  featured?: boolean;
};

type FeaturedToursProps = {
  tours: Tour[];
};

const FeaturedTours = ({ tours }: FeaturedToursProps) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Featured US Packages
          </h2>
          <Link 
            to="/packages" 
            className="text-primary font-medium hover:underline inline-flex items-center"
          >
            Explore all packages <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
              {tour.featured && (
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                  Featured
                </div>
              )}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={tour.image} 
                  alt={tour.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold mb-2">{tour.title}</h3>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                  <span className="flex items-center"><Calendar size={14} className="mr-1" /> {tour.duration}</span>
                  <span className="flex items-center"><ChevronDown size={14} className="mr-1" /> {tour.dates}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
                <div className="flex justify-between items-center">
                  <div className="font-bold text-lg">
                    ${tour.price} <span className="text-xs text-gray-500 font-normal">/person</span>
                  </div>
                  <Link to={`/packages/${tour.id}`} className="text-primary hover:text-primary/80 text-sm font-medium">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;
