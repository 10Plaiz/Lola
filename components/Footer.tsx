import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Footer: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (isHomePage && href.startsWith('/#')) {
      e.preventDefault();
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="location" className="bg-coffee-50 border-t border-coffee-100 text-coffee-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-coffee-900">Lola's <span className="text-coffee-500 text-base">by Kape Garahe</span></h3>
            <p className="text-sm text-coffee-700 leading-relaxed">
              Brewing memories one cup at a time. Experience the warmth of tradition in every sip.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-coffee-600 hover:text-coffee-900 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-coffee-600 hover:text-coffee-900 transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-coffee-600 hover:text-coffee-900 transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-coffee-900 font-bold mb-6 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" onClick={(e) => handleLinkClick(e, '/')} className="hover:text-coffee-600 transition-colors">Home</Link></li>
              <li><Link to="/#about" onClick={(e) => handleLinkClick(e, '/#about')} className="hover:text-coffee-600 transition-colors">About Us</Link></li>
              <li><Link to="/menu" className="hover:text-coffee-600 transition-colors">Our Menu</Link></li>
              <li><Link to="/visit-us" className="hover:text-coffee-600 transition-colors">Visit Us</Link></li>
              <li><a href="#" className="hover:text-coffee-600 transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-coffee-900 font-bold mb-6 uppercase text-sm tracking-wider">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-coffee-500 mt-0.5" />
                <span className="text-coffee-700">123 Heritage Street, Poblacion,<br/>Makati City, Philippines</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-coffee-500" />
                <span className="text-coffee-700">+63 917 123 4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-coffee-500" />
                <span className="text-coffee-700">hello@kapegarahe.ph</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-coffee-900 font-bold mb-6 uppercase text-sm tracking-wider">Opening Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between border-b border-coffee-100 pb-2">
                <span className="text-coffee-600">Daily</span>
                <span className="text-coffee-900 font-bold">5:00 PM - 3:00 AM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-coffee-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-coffee-500">
          <p>&copy; {new Date().getFullYear()} Kape Garahe. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-coffee-800">Privacy Policy</a>
            <a href="#" className="hover:text-coffee-800">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;