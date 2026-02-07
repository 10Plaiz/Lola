import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="location" className="bg-coffee-950 text-coffee-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white">Lola's <span className="text-coffee-500 text-base">by Kape Garahe</span></h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Brewing memories one cup at a time. Experience the warmth of tradition in every sip.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#home" className="hover:text-coffee-500 transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-coffee-500 transition-colors">About Us</a></li>
              <li><a href="#menu" className="hover:text-coffee-500 transition-colors">Our Menu</a></li>
              <li><a href="#" className="hover:text-coffee-500 transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-coffee-500 mt-0.5" />
                <span>123 Heritage Street, Poblacion,<br/>Makati City, Philippines</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-coffee-500" />
                <span>+63 917 123 4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-coffee-500" />
                <span>hello@kapegarahe.ph</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-white font-bold mb-6 uppercase text-sm tracking-wider">Opening Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between border-b border-coffee-800 pb-2">
                <span>Mon - Fri</span>
                <span className="text-white">7:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between border-b border-coffee-800 pb-2 pt-2">
                <span>Sat - Sun</span>
                <span className="text-white">8:00 AM - 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-coffee-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60">
          <p>&copy; {new Date().getFullYear()} Kape Garahe. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;