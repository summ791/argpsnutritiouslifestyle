import React from 'react';
import { ContactForm } from '../components/ContactForm';

export const Contact: React.FC = () => {
  return (
    <div className="w-full bg-white min-h-screen">
      
      {/* Header */}
      <div className="pt-16 pb-12 text-center max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
          Contact Us
        </h1>
        <p className="text-gray-600 text-lg">
          Ready to start your wellness journey? Reach out and we'll get back to you as soon as possible.
        </p>
        <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full mt-8"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ContactForm />
        <p className="text-center text-gray-500 text-sm mt-8 italic">
          Note: Consultations are by appointment only. Please contact us by filling the contact form to schedule.
        </p>
      </div>
    </div>
  );
};
