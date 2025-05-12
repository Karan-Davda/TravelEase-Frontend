
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FaqAccordion from '@/components/ui/FaqAccordion';
import { Search } from 'lucide-react';

const faqCategories = [
  { id: "general", name: "General Questions" },
  { id: "booking", name: "Booking & Payment" },
  { id: "custom", name: "Custom Trips" },
  { id: "packages", name: "Packages & Tours" },
  { id: "support", name: "Customer Support" },
];

const faqItems = [
  {
    question: "How is TravelEase different from other booking sites?",
    answer: "TravelEase combines all aspects of travel planning into a single platform. Unlike other sites that focus only on flights, hotels, or activities separately, we provide a unified booking process where you can plan your entire trip in one place. Our platform also offers both pre-arranged packages and fully customizable trips to suit any traveler's needs.",
    category: "general"
  },
  {
    question: "Which destinations do you currently support?",
    answer: "TravelEase currently supports over 1,000 destinations worldwide across all continents. Our strongest coverage is in Europe, Asia, and North America, with rapidly expanding options in South America, Africa, and Oceania. If you don't see your desired destination, contact our team and we'll work to arrange custom options for you.",
    category: "general"
  },
  {
    question: "How do I create a custom trip?",
    answer: "Creating a custom trip is easy! Simply navigate to our Custom Trip Builder, enter your destination, travel dates, number of travelers, and budget (optional), and select your preferred transportation mode. Our system will generate personalized recommendations for flights, accommodations, and activities, which you can further customize before booking.",
    category: "custom"
  },
  {
    question: "Can I modify a package or add extra services?",
    answer: "Yes! While our packages are pre-arranged, they offer flexibility. During the booking process, you'll have options to add hotel upgrades, additional activities, or special requests. For significant modifications, we recommend starting with our Custom Trip Builder instead for a fully tailored experience.",
    category: "packages"
  },
  {
    question: "What payment methods do you accept?",
    answer: "TravelEase accepts all major credit and debit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. For select destinations, we also offer payment plans that allow you to split your payment into multiple installments at no extra cost.",
    category: "booking"
  },
  {
    question: "Is there a fee for using TravelEase?",
    answer: "TravelEase doesn't charge any additional booking fees beyond what's clearly listed in your trip cost breakdown. The prices you see include our service fee, which allows us to provide 24/7 customer support, price matching, and our seamless booking platform.",
    category: "booking"
  },
  {
    question: "What if I need to cancel my trip?",
    answer: "Cancellation policies vary depending on the services included in your booking and how close to the departure date you cancel. Our packages clearly outline the cancellation policy before you book. For custom trips, each component (flight, hotel, activities) may have different policies. In case of unexpected circumstances, we recommend purchasing travel insurance, which we offer during checkout.",
    category: "booking"
  },
  {
    question: "How do I contact customer support?",
    answer: "Our customer support team is available 24/7 through multiple channels. You can reach us via live chat on our website, email at support@travelease.com, or phone at +1 (555) 123-4567. For travelers on the go, we also offer WhatsApp support for quick assistance during your journey.",
    category: "support"
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes! For groups of 8 or more travelers booking the same itinerary, we offer special group rates. Contact our group specialist at groups@travelease.com with your requirements for a customized quote and additional perks like complimentary upgrades or exclusive experiences.",
    category: "booking"
  },
  {
    question: "Are flights included in your packages?",
    answer: "Most of our packages include flights, but we also offer land-only options for travelers who prefer to arrange their own air travel. During the booking process, you can easily toggle the flight option on or off to see pricing for both options.",
    category: "packages"
  },
  {
    question: "What happens if a flight gets canceled or delayed?",
    answer: "If any part of your booked itinerary changes due to provider issues (like flight delays or cancellations), our support team will automatically work to find alternatives and notify you immediately. We'll present options based on your preferences and handle all the rebooking details so you don't have to stress about last-minute changes.",
    category: "support"
  },
  {
    question: "Can TravelEase accommodate special dietary requirements or accessibility needs?",
    answer: "Absolutely! During the booking process, you'll have the opportunity to specify any special requirements including dietary preferences, accessibility needs, or other accommodations. For complex requirements, we recommend contacting our support team directly so we can ensure all aspects of your trip are suitable for your needs.",
    category: "custom"
  }
];

const Faq = () => {
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFaqs = searchTerm
    ? faqItems.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : faqItems.filter(faq => faq.category === activeCategory);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-display font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600">
              Find answers to common questions about TravelEase services and features
            </p>
            
            {/* Search */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="pl-10 w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {!searchTerm && (
            <div className="mb-8 flex overflow-x-auto pb-2">
              <div className="flex space-x-2">
                {faqCategories.map(category => (
                  <button
                    key={category.id}
                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                      activeCategory === category.id 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="max-w-3xl mx-auto">
            {searchTerm && filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-gray-600">
                  Try using different keywords or browse by category
                </p>
                <button
                  className="mt-4 text-primary hover:underline"
                  onClick={() => setSearchTerm("")}
                >
                  Clear search
                </button>
              </div>
            ) : (
              <FaqAccordion faqs={filteredFaqs} />
            )}
          </div>
          
          {/* Contact Section */}
          <div className="mt-16 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-4">
              Still have questions?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/contact" 
                className="btn-primary inline-block"
              >
                Contact Support
              </a>
              <a 
                href="mailto:support@travelease.com" 
                className="btn-outline inline-block"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Faq;
