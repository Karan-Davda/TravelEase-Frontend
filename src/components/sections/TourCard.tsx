
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface TourCardProps {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  maxGroupSize: number;
  hasTourGuide?: boolean;
  onViewClick?: () => void;
  featured?: boolean; // Added the missing featured prop
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
  hasTourGuide = false,
  onViewClick,
  featured = false // Added with a default value of false
}: TourCardProps) => {
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border ${featured ? 'border-primary' : 'border-gray-100'}`}>
      {/* Card Image */}
      <div 
        className="h-56 bg-cover bg-center relative" 
        style={{ backgroundImage: `url(${image})` }}
      >
        {/* Tour Guide Badge */}
        {hasTourGuide && (
          <div className="absolute bottom-4 left-4 bg-[#9b87f5] text-white px-3 py-1 text-sm font-medium rounded">
            Tour Guide Included
          </div>
        )}
        
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 text-sm font-bold rounded-full">
            Featured
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-lg font-bold mb-1 leading-tight">{title}</h3>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center text-amber-500 mr-2">
            {Array(5).fill(0).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${i < Math.floor(rating) ? 'fill-amber-500' : 'fill-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500">{reviewCount} reviews</span>
        </div>
        
        {/* Description */}
        <p className="text-gray-600 mb-3 text-sm">{description}</p>
        
        {/* Details */}
        <div className="flex items-center mb-3">
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full mr-2">{duration}</span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Max {maxGroupSize} people</span>
        </div>
        
        {/* Price and Action */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div>
            <span className="text-sm text-gray-500">Starting from</span>
            <p className="text-primary font-bold">${price.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            {onViewClick && (
              <Button 
                onClick={onViewClick} 
                variant="outline" 
                size="sm"
              >
                View
              </Button>
            )}
            <Link to={`/packages/${id}`}>
              <Button size="sm">Book Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourCard;
