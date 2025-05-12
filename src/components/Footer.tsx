
import { NavLink } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-teal-800 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold">Travel<span className="text-coral-400">Ease</span></h2>
            <p className="text-teal-50/80 max-w-xs">
              All your flights, hotels, and local experiences—in one seamless booking flow.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-coral-400 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="hover:text-coral-400 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="hover:text-coral-400 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className="text-teal-50/80 hover:text-coral-400 transition-colors">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/custom-trip" className="text-teal-50/80 hover:text-coral-400 transition-colors">
                  Custom Trip Planner
                </NavLink>
              </li>
              <li>
                <NavLink to="/packages" className="text-teal-50/80 hover:text-coral-400 transition-colors">
                  Packages & Tours
                </NavLink>
              </li>
              <li>
                <NavLink to="/faq" className="text-teal-50/80 hover:text-coral-400 transition-colors">
                  FAQ
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/privacy-policy" className="text-teal-50/80 hover:text-coral-400 transition-colors">
                  Privacy Policy
                </NavLink>
              </li>
              <li>
                <NavLink to="/terms-conditions" className="text-teal-50/80 hover:text-coral-400 transition-colors">
                  Terms & Conditions
                </NavLink>
              </li>
              <li>
                <NavLink to="/cookie-policy" className="text-teal-50/80 hover:text-coral-400 transition-colors">
                  Cookie Policy
                </NavLink>
              </li>
              <li>
                <NavLink to="/sitemap" className="text-teal-50/80 hover:text-coral-400 transition-colors">
                  Sitemap
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-coral-400" />
                <span className="text-teal-50/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-coral-400" />
                <a href="mailto:info@travelease.com" className="text-teal-50/80 hover:text-coral-400 transition-colors">
                  info@travelease.com
                </a>
              </li>
              <li>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Subscribe to our newsletter</h4>
                  <form className="flex">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="px-3 py-2 rounded-l-md text-gray-800 w-full"
                    />
                    <button 
                      type="submit" 
                      className="bg-coral-600 hover:bg-coral-700 px-3 py-2 rounded-r-md transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-teal-700 mt-8 pt-6">
          <div className="text-sm text-teal-50/70 text-center">
            &copy; {currentYear} TravelEase. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
