
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

type HeroProps = {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  ctaOnClick?: () => void;
  showCta?: boolean;
  backgroundImage?: string;
}

const Hero = ({ 
  title, 
  subtitle, 
  ctaText = "Get Started", 
  ctaLink = "/custom-trip",
  ctaOnClick,
  showCta = true,
  backgroundImage = "/images/hero-bg.jpg"
}: HeroProps) => {
  return (
    <div 
      className="relative min-h-[80vh] flex items-center pt-20" 
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 gradient-overlay"></div>
      <div className="container-custom relative z-10 py-16">
        <div className="max-w-2xl animate-slide-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 text-shadow-sm">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 leading-relaxed max-w-xl">
            {subtitle}
          </p>
          {showCta && (
            ctaOnClick ? (
              <button 
                onClick={ctaOnClick}
                className="btn-accent inline-flex items-center gap-3 text-lg px-8 py-4"
              >
                {ctaText} <ArrowRight size={20} />
              </button>
            ) : (
              <Link 
                to={ctaLink} 
                className="btn-accent inline-flex items-center gap-3 text-lg px-8 py-4"
              >
                {ctaText} <ArrowRight size={20} />
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
