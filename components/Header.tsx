import React from 'react';
import { NavLink as RouterNavLink, useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from '../types';

const navLinks: NavLink[] = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Courses', path: '/courses' },
  { name: 'Services', path: '/services' },
  { name: 'Contact', path: '/contact' },
];

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
          {/* Logo & Brand Name */}
          <div className="flex-shrink-0 flex items-center gap-2 md:gap-3 lg:gap-4 cursor-pointer group" onClick={() => navigate('/')}>
             <img 
               src="https://raw.githubusercontent.com/summ791/argpsapp2/main/logo.jpg" 
               alt="ARGPS Logo" 
               className="h-10 md:h-12 lg:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
             />
             <div className="flex flex-col justify-center">
                <span className="font-serif text-lg md:text-xl lg:text-2xl font-bold text-gray-900 leading-none transition-all">ARGPS</span>
                <span className="text-[10px] md:text-[11px] lg:text-xs uppercase tracking-[0.15em] text-primary-600 font-semibold mt-0.5 md:mt-1">Nutritious Lifestyle</span>
             </div>
          </div>

          <div className="flex min-w-0 items-center gap-3 lg:gap-8">
            <nav className="hidden items-center space-x-4 lg:flex lg:space-x-10">
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
            <div className="hidden border-l border-gray-200 pl-4 lg:block lg:pl-8">
                <button 
                  onClick={() => navigate('/contact')}
                  className="bg-primary-700 text-white px-4 lg:px-6 py-2 md:py-2.5 rounded-lg font-medium hover:bg-primary-800 transition-colors shadow-sm text-xs md:text-sm tracking-wide transform hover:-translate-y-0.5 duration-200 whitespace-nowrap"
                >
                  Get Started
                </button>
            </div>
          </div>

            <button
              onClick={() => navigate('/courses')}
              className="rounded-full bg-primary-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-primary-800"
            >
              Courses
            </button>
          </div>
      </div>
    </header>
  );
};
