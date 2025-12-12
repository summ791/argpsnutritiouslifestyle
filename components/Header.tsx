import React, { useState } from 'react';
import { NavLink as RouterNavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NavLink } from '../types';

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
];

export const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo & Brand Name */}
          <div className="flex-shrink-0 flex items-center gap-4 cursor-pointer" onClick={() => navigate('/')}>
             <img 
               src="https://raw.githubusercontent.com/summ791/argpsapp2/main/logo.jpg" 
               alt="ARGPS Logo" 
               className="h-16 w-auto object-contain"
             />
             <div className="flex flex-col justify-center">
                <span className="font-serif text-2xl font-bold text-gray-900 leading-none">ARGPS</span>
                <span className="text-xs uppercase tracking-[0.15em] text-primary-600 font-semibold mt-1">Nutritious Lifestyle</span>
             </div>
          </div>

          {/* Desktop Nav - Classic Horizontal Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-10">
              {navLinks.map((link) => (
                <RouterNavLink
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(link.path)
                      ? 'text-primary-700 font-semibold border-b-2 border-primary-600 pb-1'
                      : 'text-gray-600 hover:text-primary-600 pb-1 border-b-2 border-transparent'
                  }`}
                >
                  {link.name}
                </RouterNavLink>
              ))}
            </nav>
            <div className="pl-8 border-l border-gray-200">
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-primary-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-800 transition-colors shadow-sm text-sm tracking-wide transform hover:-translate-y-0.5 duration-200"
                >
                  Book Consultation
                </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-primary-600 focus:outline-none p-2"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full shadow-lg z-50">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navLinks.map((link) => (
              <RouterNavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-800 bg-primary-50'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                }`}
              >
                {link.name}
              </RouterNavLink>
            ))}
            <div className="pt-4 mt-2 border-t border-gray-100">
                <button 
                onClick={() => {
                    navigate('/contact');
                    setIsOpen(false);
                }}
                className="w-full bg-primary-700 text-white px-4 py-3 rounded-md font-medium hover:bg-primary-800 transition-colors"
                >
                Book Consultation
                </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
