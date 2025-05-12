
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

type DestinationCardProps = {
  name: string;
  image: string;
  packageCount: number;
  link: string;
}

const DestinationCard = ({ name, image, packageCount, link }: DestinationCardProps) => {
  return (
    <Link to={link} className="group block">
      <div className="relative rounded-lg overflow-hidden aspect-[4/3]">
        {/* Background Image */}
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h3 className="text-xl font-semibold text-white mb-1">{name}</h3>
          <div className="flex items-center text-white/80 text-sm">
            <MapPin size={14} className="mr-1" />
            <span>{packageCount} packages available</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
