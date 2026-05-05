import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Instagram, Facebook, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white pt-12 md:pt-16 pb-8 border-t border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">
          
          {/* Brand & Desc */}
          <div className="max-w-md">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-primary-200 mb-4 md:mb-6">ARGPS Nutritious Lifestyle</h2>
            
            <p className="text-primary-100/90 text-sm leading-7 mb-6 pr-4">
              Your path to a healthier, more balanced lifestyle through personalized nutrition guidance and sustainable wellness strategies.
            </p>

            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/argps_nutritious_lifestyle?igsh=MWN6bzM1aXppNTFuNw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center text-primary-100 hover:bg-primary-700 hover:text-white transition-all duration-200 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://www.facebook.com/share/1NwZcFCtLQ/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center text-primary-100 hover:bg-primary-700 hover:text-white transition-all duration-200 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 md:mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm text-primary-100/90">
              <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">About</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">Services</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-4 md:mb-6 text-white">Contact</h3>
            <ul className="space-y-4 text-sm text-primary-100/90">
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-primary-800 rounded-lg group-hover:bg-primary-700 transition-colors flex-shrink-0">
                    <Mail size={18} className="text-primary-100" />
                </div>
                <span className="mt-1.5 break-all">argpsnutritiouslifestyle25@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-primary-800 rounded-lg group-hover:bg-primary-700 transition-colors flex-shrink-0">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="text-primary-100"
                    >
                      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                    </svg>
                </div>
                <span className="mt-1.5">+91 8056510590</span>
              </li>
              <li className="flex items-start gap-3 group">
                 <div className="p-2 bg-primary-800 rounded-lg group-hover:bg-primary-700 transition-colors flex-shrink-0">
                    <MapPin size={18} className="text-primary-100" />
                 </div>
                <span className="mt-1.5">Chennai, Tamil Nadu, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-300 text-center md:text-left">
          <p className="mb-4 md:mb-0">© 2025 ARGPS Nutritious Lifestyle. All rights reserved.</p>
          <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
            <span>Designed with</span>
            <Heart size={14} fill="#F43F5E" className="text-rose-500 animate-pulse" /> 
            <span>for Wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
