
import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
};

const useSeo = ({ title, description }: SeoProps) => {
  useEffect(() => {
    // Set page title
    document.title = title;
    
    // Create or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
  }, [title, description]);
};

export default useSeo;
