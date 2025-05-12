
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  faqs: FaqItem[];
  className?: string;
}

const FaqAccordion = ({ faqs, className = '' }: FaqAccordionProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className={`border rounded-lg overflow-hidden transition-all duration-200 ${
            activeIndex === index ? 'border-primary shadow-sm' : 'border-gray-200'
          }`}
        >
          <button
            className="flex justify-between items-center w-full p-5 text-left focus:outline-none"
            onClick={() => toggleFaq(index)}
            aria-expanded={activeIndex === index}
          >
            <h3 className="font-medium text-gray-900">{faq.question}</h3>
            <div className={`transition-all duration-200 ${activeIndex === index ? 'rotate-0 bg-primary text-white' : 'rotate-0 bg-gray-100'} p-1 rounded-full`}>
              {activeIndex === index ? (
                <Minus size={16} />
              ) : (
                <Plus size={16} />
              )}
            </div>
          </button>
          <div 
            className={`transition-all duration-200 overflow-hidden ${
              activeIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-5 pt-0 text-gray-600">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
