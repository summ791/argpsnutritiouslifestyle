import React from 'react';
import { Check } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="w-full bg-white font-sans text-gray-800">
      
      {/* Header */}
      <div className="pt-20 pb-12 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-4">
          About ARGPS Nutritious <br/> Lifestyle
        </h1>
        <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full mt-8"></div>
      </div>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
         <div className="bg-[#F0FDFA] rounded-2xl p-10 md:p-16 text-center shadow-sm border border-primary-50">
            <h2 className="font-serif text-2xl font-bold text-primary-900 mb-6">Our Mission</h2>
            <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
              At ARGPS Nutritious Lifestyle, we are dedicated to helping you achieve optimal health through personalized nutrition guidance and practical wellness strategies.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto mt-6">
              Our approach combines scientific research with traditional wisdom to create sustainable, balanced eating habits that nourish both body and mind.
            </p>
         </div>
      </section>

      {/* Content Split */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Rithanya Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-10 shadow-lg hover:shadow-xl transition-shadow">
               <h3 className="font-serif text-2xl font-bold text-primary-900 mb-6">About Me</h3>
               <p className="text-gray-600 mb-4 leading-relaxed">
                 I'm Rithanya Gopinathan, a Wellness Consultant dedicated to help you achieve a healthier, more balanced lifestyle through personalized nutrition.
               </p>
               <p className="text-gray-600 mb-8 leading-relaxed">
                 With a holistic approach to wellness, we'll work together to create a nutrition plan that fits your unique needs, preferences, and goals—all delivered conveniently online.
               </p>
               
               <div className="flex items-center gap-5 pt-4 border-t border-gray-50">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-100 flex-shrink-0">
                     <img 
                        src="/rithanya-profile.jpg" 
                        alt="Rithanya Gopinathan" 
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                             e.currentTarget.src = "https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=2070&auto=format&fit=crop";
                        }}
                     />
                  </div>
                  <div>
                     <p className="font-bold text-gray-900">Rithanya Gopinathan</p>
                     <p className="text-sm text-gray-500">Wellness Consultant</p>
                  </div>
               </div>
            </div>

            {/* Approach Card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-10 shadow-lg hover:shadow-xl transition-shadow">
               <h3 className="font-serif text-2xl font-bold text-primary-900 mb-6">Our Approach</h3>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="mt-1 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-primary-600" strokeWidth={3} />
                     </div>
                     <div>
                        <h4 className="font-medium text-gray-900 mb-1">Personalized nutrition plans</h4>
                        <p className="text-sm text-gray-500">tailored to your needs</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-4">
                     <div className="mt-1 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check size={14} className="text-primary-600" strokeWidth={3} />
                     </div>
                     <div>
                        <h4 className="font-medium text-gray-900 mb-1">Sustainable lifestyle changes</h4>
                        <p className="text-sm text-gray-500">for long-term health</p>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </section>
    </div>
  );
};