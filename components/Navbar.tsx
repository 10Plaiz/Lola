import React, { useState, useEffect } from 'react';
import { Menu, X, Coffee } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use solid background styles if scrolled OR if mobile menu is open
  const isSolid = scrolled || isOpen;

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Visit Us', href: '#location' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isSolid ? 'bg-cream/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Coffee className={`h-8 w-8 ${isSolid ? 'text-coffee-700' : 'text-white'}`} />
            <span className={`text-xl font-serif font-bold tracking-wide ${isSolid ? 'text-coffee-900' : 'text-white'}`}>
              Lola's <span className={`${isSolid ? 'text-coffee-500' : 'text-coffee-200'} text-base font-sans font-normal`}>by Kape Garahe</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-sans font-medium transition-colors ${isSolid ? 'text-coffee-800 hover:text-coffee-600' : 'text-white hover:text-coffee-200'}`}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="#menu" 
              className={`px-5 py-2 rounded-full font-medium transition-colors shadow-lg ${
                isSolid 
                  ? 'bg-coffee-600 text-white hover:bg-coffee-700' 
                  : 'bg-white text-coffee-900 hover:bg-coffee-100'
              }`}
            >
              Order Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${isSolid ? 'text-coffee-800' : 'text-white'} hover:opacity-80 focus:outline-none`}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-cream border-t border-coffee-200 absolute w-full left-0 top-full shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-3 py-3 rounded-lg text-base font-medium text-coffee-800 hover:text-coffee-600 hover:bg-coffee-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
             <a 
                href="#menu" 
                onClick={() => setIsOpen(false)}
                className="block w-full text-center mt-6 bg-coffee-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-coffee-700 shadow-md"
              >
              Order Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;