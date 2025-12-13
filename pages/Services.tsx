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

      {/* How It Works Section */}
      <section className="py-20 bg-[#F9FAFB] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-bold tracking-wider uppercase text-sm block mb-2">How It Works</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Journey to Better Health</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              A simple, structured approach to achieving your nutrition goals.
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Connector Line (Desktop only) */}
            <div className="hidden lg:block absolute top-[4.5rem] left-0 right-0 h-0.5 bg-gray-200 -z-10 mx-16"></div>

            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative group hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
              <div className="w-12 h-12 bg-[#0d9488] rounded-lg flex items-center justify-center text-white font-bold text-lg mb-6 shadow-md flex-shrink-0">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">Initial Consultation</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                We start with a comprehensive assessment of your health history, lifestyle, and goals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative group hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
              <div className="w-12 h-12 bg-[#0d9488] rounded-lg flex items-center justify-center text-white font-bold text-lg mb-6 shadow-md flex-shrink-0">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">Personalized Plan</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                I begin by understanding your daily routine meal plan and I create a customized nutrition strategy tailored specifically to your needs and your daily routine.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative group hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
              <div className="w-12 h-12 bg-[#0d9488] rounded-lg flex items-center justify-center text-white font-bold text-lg mb-6 shadow-md flex-shrink-0">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">Implementation</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                Based on that, you will receive detailed meal plans, water intake and support to help you put your nutrition plan into action.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative group hover:-translate-y-1 transition-transform duration-300 h-full flex flex-col">
              <div className="w-12 h-12 bg-[#0d9488] rounded-lg flex items-center justify-center text-white font-bold text-lg mb-6 shadow-md flex-shrink-0">
                04
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-3">Ongoing Support</h3>
              <p className="text-sm text-gray-600 leading-relaxed flex-grow">
                Regular check-ins and adjustments ensure you stay on track and achieve lasting results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Important Note Card */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-primary-50 border border-primary-100 rounded-xl p-8 text-center shadow-sm">
              <h3 className="font-serif text-xl font-bold text-primary-900 mb-2">Important Note</h3>
              <p className="text-gray-700">
                These outcomes are not typical; individual outcomes may vary from person to person
              </p>
           </div>
        </div>
      </section>
    </div>
  );
};
