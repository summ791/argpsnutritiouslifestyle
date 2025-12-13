import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary-900 text-white pt-16 pb-8 border-t border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand & Desc */}
          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-6">ARGPS Nutritious Lifestyle</h2>
            
            <p className="text-primary-100 text-sm leading-7 mb-6 pr-4 opacity-90">
              Your path to a healthier, more balanced lifestyle through personalized nutrition guidance and sustainable habits.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-primary-50">Quick Links</h3>
            <ul className="space-y-3 text-sm text-primary-100">
              <li><Link to="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">About</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">Services</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors hover:translate-x-1 inline-block duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info (Small) */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-primary-50">Contact</h3>
            <ul className="space-y-4 text-sm text-primary-100">
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-primary-800 rounded-full group-hover:bg-primary-700 transition-colors">
                    <Mail size={16} className="flex-shrink-0" />
                </div>
                <span className="mt-1.5 opacity-90">argpsnutritiouslifestyle25@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="p-2 bg-primary-800 rounded-full group-hover:bg-primary-700 transition-colors">
                    <Phone size={16} className="flex-shrink-0" />
                </div>
                <span className="mt-1.5 opacity-90">+91 8056510590</span>
              </li>
              <li className="flex items-start gap-3 group">
                 <div className="p-2 bg-primary-800 rounded-full group-hover:bg-primary-700 transition-colors">
                    <MapPin size={16} className="flex-shrink-0" />
                 </div>
                <span className="mt-1.5 opacity-90">Chennai, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-primary-300">
          <p>© 2025 ARGPS Nutritious Lifestyle. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
              <a 
                href="https://www.instagram.com/argps_nutritious_lifestyle?igsh=MWN6bzM1aXppNTFuNw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white hover:scale-110 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://www.facebook.com/share/17jSixwQ2w/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white hover:scale-110 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
