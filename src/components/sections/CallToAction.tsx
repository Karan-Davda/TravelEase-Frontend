
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type CallToActionProps = {
  title: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
}

const CallToAction = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundImage = "/images/cta-bg.jpg"
}: CallToActionProps) => {
  return (
    <section 
      className="relative py-20"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {backgroundImage && <div className="absolute inset-0 gradient-overlay"></div>}
      
      <div className="container-custom relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`text-3xl md:text-4xl font-display font-bold mb-4 ${backgroundImage ? 'text-white' : 'text-gray-800'}`}>
            {title}
          </h2>
          <p className={`text-lg mb-8 ${backgroundImage ? 'text-white/90' : 'text-gray-600'}`}>
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to={primaryButtonLink}
              className="btn-accent inline-flex items-center justify-center gap-2"
            >
              {primaryButtonText} <ArrowRight size={18} />
            </Link>
            
            {secondaryButtonText && secondaryButtonLink && (
              <Link 
                to={secondaryButtonLink}
                className={`${backgroundImage ? 'border border-white text-white hover:bg-white/20' : 'btn-outline'} inline-flex items-center justify-center gap-2`}
              >
                {secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
