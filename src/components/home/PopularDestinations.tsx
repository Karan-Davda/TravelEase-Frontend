
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DestinationCard from '@/components/sections/DestinationCard';

type Destination = {
  name: string;
  image: string;
  packageCount: number;
  link: string;
};

type PopularDestinationsProps = {
  destinations: Destination[];
};

const PopularDestinations = ({ destinations }: PopularDestinationsProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold">
            Popular US Destinations
          </h2>
          <Link 
            to="/packages" 
            className="text-primary font-medium hover:underline inline-flex items-center"
          >
            View all <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <DestinationCard 
              key={index}
              name={destination.name}
              image={destination.image}
              packageCount={destination.packageCount}
              link={destination.link}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
