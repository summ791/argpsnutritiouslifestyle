import React from 'react';
import { User, Scale, HeartPulse, Check } from 'lucide-react';

export const Services: React.FC = () => {
  return (
    <div className="w-full bg-white font-sans text-gray-800 min-h-screen">
      
      {/* Header */}
      <div className="pt-20 pb-16 text-center max-w-4xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary-900 mb-6">
          Our Services
        </h1>
        <p className="text-gray-600 text-lg">
          Tailored nutrition programs designed to meet your unique health goals and lifestyle needs.
        </p>
        <div className="w-24 h-1.5 bg-primary-500 mx-auto rounded-full mt-10"></div>
      </div>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="bg-[#F0FDFA] rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-100 hover:-translate-y-1">
               <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary-600 mb-6 shadow-sm">
                  <User size={28} />
               </div>
               <h3 className="font-serif text-xl font-bold text-primary-900 mb-4">Personalized Nutrition</h3>
               <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                 Customized meal plans based on your health profile, preferences, and goals.
               </p>
               <ul className="space-y-3.5">
                 {["Initial assessment and analysis", "Personalized recommendations", "Follow-up consultations"].map((item, i) => (
                   <li key={i} className="flex items-start gap-2.5">
                     <Check size={16} className="text-primary-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                     <span className="text-sm text-gray-600 font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-[#F0FDFA] rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-100 hover:-translate-y-1">
               <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary-600 mb-6 shadow-sm">
                  <Scale size={28} />
               </div>
               <h3 className="font-serif text-xl font-bold text-primary-900 mb-4">Weight Management</h3>
               <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                 Sustainable strategies for achieving and maintaining your ideal weight.
               </p>
               <ul className="space-y-3.5">
                 {["Customized weight loss/gain plans", "Metabolic assessment", "Behavioral strategies"].map((item, i) => (
                   <li key={i} className="flex items-start gap-2.5">
                     <Check size={16} className="text-primary-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                     <span className="text-sm text-gray-600 font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-[#F0FDFA] rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-100 hover:-translate-y-1">
               <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary-600 mb-6 shadow-sm">
                  <HeartPulse size={28} />
               </div>
               <h3 className="font-serif text-xl font-bold text-primary-900 mb-4">Health Conditions</h3>
               <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                 Specialized nutrition plans for managing health conditions and improving wellness.
               </p>
               <ul className="space-y-3.5">
                 {["Diabetes management", "Heart health", "Digestive wellness"].map((item, i) => (
                   <li key={i} className="flex items-start gap-2.5">
                     <Check size={16} className="text-primary-500 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                     <span className="text-sm text-gray-600 font-medium">{item}</span>
                   </li>
                 ))}
               </ul>
            </div>

         </div>
      </section>
    </div>
  );
};
