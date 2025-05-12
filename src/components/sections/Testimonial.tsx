
import { User } from 'lucide-react';

type TestimonialProps = {
  quote: string;
  name: string;
  role?: string;
  image?: string;
}

const Testimonial = ({
  quote,
  name,
  role,
  image
}: TestimonialProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">
      <div className="flex items-center mb-6">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-12 h-12 rounded-full object-cover mr-4" 
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mr-4">
            <User size={24} className="text-teal-600" />
          </div>
        )}
        <div>
          <h4 className="font-semibold">{name}</h4>
          {role && <p className="text-sm text-gray-500">{role}</p>}
        </div>
      </div>
      <blockquote className="text-gray-700 italic relative">
        <span className="text-5xl text-teal-200 absolute -top-6 -left-3">"</span>
        <p className="relative z-10 pl-2">{quote}</p>
      </blockquote>
    </div>
  );
};

export default Testimonial;
