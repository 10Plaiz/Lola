import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Coffee, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const { user, logout } = useAuth();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setIsProfileOpen(false);
    setIsOpen(false); // Close mobile menu if open
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsOpen(false);
  };

  // Use solid background styles if scrolled OR if mobile menu is open OR if not on home page
  const isSolid = scrolled || isOpen || !isHomePage;

  const navLinks = [
    { name: 'Home', href: '/', isHash: false },
    { name: 'About', href: '/#about', isHash: true },
    { name: 'Menu', href: '/menu', isHash: false },
    { name: 'Visit Us', href: '/visit-us', isHash: false },
  ];

  if (user) {
    navLinks.push({ 
      name: user.role === 'admin' ? 'Admin Panel' : 'My Dashboard', 
      href: user.role === 'admin' ? '/admin' : '/dashboard', 
      isHash: false 
    });
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isHash: boolean) => {
    if (isHash && isHomePage) {
      e.preventDefault();
      const id = href.split('#')[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isSolid ? 'bg-cream/95 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Coffee className={`h-8 w-8 ${isSolid ? 'text-coffee-700' : 'text-white'}`} />
              <span className={`text-xl font-serif font-bold tracking-wide ${isSolid ? 'text-coffee-900' : 'text-white'}`}>
                Lola's <span className={`${isSolid ? 'text-coffee-500' : 'text-coffee-200'} text-base font-sans font-normal`}>by Kape Garahe</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleLinkClick(e, link.href, link.isHash)}
                  className={`font-sans font-medium transition-colors ${isSolid ? 'text-coffee-800 hover:text-coffee-600' : 'text-white hover:text-coffee-200'}`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`p-2 rounded-full transition-colors ${
                    isSolid 
                      ? 'text-coffee-800 hover:bg-coffee-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <User size={24} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-coffee-100 overflow-hidden py-1 animate-fade-in-up origin-top-right">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-coffee-50">
                          <p className="text-xs text-coffee-500 font-semibold uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-bold text-coffee-900 truncate">{user.username}</p>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => openAuth('login')}
                          className="w-full text-left px-4 py-2 text-sm text-coffee-800 hover:bg-coffee-50 flex items-center gap-2"
                        >
                          <LogIn size={16} /> Sign In
                        </button>
                        <button 
                          onClick={() => openAuth('signup')}
                          className="w-full text-left px-4 py-2 text-sm text-coffee-800 hover:bg-coffee-50 flex items-center gap-2"
                        >
                          <UserPlus size={16} /> Sign Up
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
               {/* Mobile User Icon */}
               <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`p-1 ${isSolid ? 'text-coffee-800' : 'text-white'}`}
                >
                  <User size={24} />
                </button>

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
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={(e) => handleLinkClick(e, link.href, link.isHash)}
                  className="block px-3 py-3 rounded-lg text-base font-medium text-coffee-800 hover:text-coffee-600 hover:bg-coffee-100 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Profile Dropdown (Separate from main menu for clarity, or could be integrated) */}
        {isProfileOpen && (
          <div className="absolute right-4 top-20 w-56 bg-white rounded-xl shadow-xl border border-coffee-100 overflow-hidden py-1 animate-fade-in-up origin-top-right md:hidden">
             {user ? (
                <>
                  <div className="px-4 py-3 border-b border-coffee-50">
                    <p className="text-xs text-coffee-500 font-semibold uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-bold text-coffee-900 truncate">{user.username}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => openAuth('login')}
                    className="w-full text-left px-4 py-3 text-sm text-coffee-800 hover:bg-coffee-50 flex items-center gap-2 border-b border-coffee-50"
                  >
                    <LogIn size={16} /> Sign In
                  </button>
                  <button 
                    onClick={() => openAuth('signup')}
                    className="w-full text-left px-4 py-3 text-sm text-coffee-800 hover:bg-coffee-50 flex items-center gap-2"
                  >
                    <UserPlus size={16} /> Sign Up
                  </button>
                </>
              )}
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authMode} 
      />
    </>
  );
};

export default Navbar;