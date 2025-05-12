
import { Link } from 'react-router-dom';
import { Clock, Star, Users } from 'lucide-react';

type TourCardProps = {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  maxGroupSize?: number;
  featured?: boolean;
  hasTourGuide?: boolean;
}

const TourCard = ({ 
  id, 
  title, 
  image, 
  description, 
  price, 
  duration, 
  rating, 
  reviewCount,
  maxGroupSize,
  featured = false,
  hasTourGuide = false
}: TourCardProps) => {
  return (
    <div className={`rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100 group ${featured ? 'ring-2 ring-accent' : ''}`}>
      {/* Tour Image */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {hasTourGuide && (
          <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 text-xs font-medium">
            Tour Guide Included
          </div>
        )}
      </div>

      {/* Tour Details */}
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors text-gray-800">
          {title}
        </h3>
        
        {/* Tour Info */}
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-6">
          <div className="flex items-center">
            <Clock size={16} className="mr-1.5" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <Star size={16} className="mr-1.5 text-yellow-400" />
            <span>{rating} ({reviewCount})</span>
          </div>
          {maxGroupSize && (
            <div className="flex items-center">
              <Users size={16} className="mr-1.5" />
              <span>Max {maxGroupSize}</span>
            </div>
          )}
        </div>
        
        {/* Tour Description */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
          {description}
        </p>
        
        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-gray-900">${price}</span>
            <span className="text-gray-500 text-sm"> / person</span>
          </div>
          <Link to={`/packages/${id}`} className="text-primary font-medium hover:underline">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
