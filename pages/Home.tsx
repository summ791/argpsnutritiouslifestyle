import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Activity, Heart, ArrowRight, Star, Globe, CheckCircle2 } from 'lucide-react';
import { ContactForm } from '../components/ContactForm';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col w-full font-sans text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50/50 to-white py-12 md:py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-14 lg:gap-20">
            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-900 mb-4 md:mb-6 leading-tight md:leading-[1.2]">
                Your Path to <br/>
                <span className="text-primary-600">Wellness</span> Starts Here
              </h1>
              
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Achieve your health goals with personalized nutrition guidance and practical tips for a balanced lifestyle.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                <Link 
                  to="/contact" 
                  className="px-6 md:px-8 py-3 md:py-3.5 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 duration-200 tracking-wide text-sm md:text-base text-center"
                >
                  Start Your Journey
                </Link>
                <Link 
                  to="/services" 
                  className="px-6 md:px-8 py-3 md:py-3.5 bg-primary-100 text-primary-800 border border-primary-200 rounded-full font-semibold hover:bg-primary-200 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-200 tracking-wide text-sm md:text-base text-center"
                >
                  View Services
                </Link>
              </div>
            </div>
            
            {/* Right Image - Profile Circle */}
            <div className="lg:w-1/2 w-full flex justify-center lg:justify-end relative mt-2 lg:mt-0">
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-primary-200 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-4 border-[6px] border-white rounded-full overflow-hidden shadow-2xl z-10">
                   <img 
                    src="https://raw.githubusercontent.com/summ791/argpsapp2/main/rithanya-profile.jpg" 
                    alt="Rithanya Gopinathan" 
                    className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                {/* Floating Name Card */}
                <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-20 bg-white px-4 md:px-5 py-2.5 md:py-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-2 md:gap-3 whitespace-nowrap animate-bounce-subtle">
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden border border-primary-200 text-primary-600">
                     <Star size={18} fill="currentColor" className="md:w-5 md:h-5" />
                   </div>
                   <div>
                      <p className="font-bold text-gray-900 text-xs md:text-sm">Rithanya Gopinathan</p>
                      <p className="text-xs text-primary-600 font-medium">Wellness Consultant</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 md:w-96 md:h-96 bg-accent-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 md:w-72 md:h-72 bg-primary-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
      </section>

      {/* Deep Dive Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
             <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Deep Dive Into Wellness</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="p-6 md:p-8 bg-[#F0FDFA] rounded-2xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-100 text-center group">
               <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center text-primary-600 mx-auto mb-4 md:mb-6 shadow-sm">
                  <BookOpen size={24} className="w-5 h-5 md:w-6 md:h-6" />
               </div>
               <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Nutrition Science</h3>
               <p className="text-gray-600 text-sm leading-relaxed">
                 Explore the latest research-backed nutrition advice to make informed choices about your diet.
               </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 md:p-8 bg-[#F0FDFA] rounded-2xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-100 text-center group">
               <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center text-primary-600 mx-auto mb-4 md:mb-6 shadow-sm">
                  <Activity size={24} className="w-5 h-5 md:w-6 md:h-6" />
               </div>
               <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Personalized Plans</h3>
               <p className="text-gray-600 text-sm leading-relaxed">
                 Tailored nutrition strategies designed specifically for your body and lifestyle needs.
               </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 md:p-8 bg-[#F0FDFA] rounded-2xl hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-100 text-center group">
               <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl flex items-center justify-center text-primary-600 mx-auto mb-4 md:mb-6 shadow-sm">
                  <Heart size={24} className="w-5 h-5 md:w-6 md:h-6" />
               </div>
               <h3 className="font-serif text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Sustainable Habits</h3>
               <p className="text-gray-600 text-sm leading-relaxed">
                 Learn practical tips and tricks to develop long-lasting healthy eating patterns.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Me & Philosophy Section */}
      <section className="py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row gap-10 md:gap-12 lg:gap-16 items-start mb-12 md:mb-16">
             
             {/* Left Column: About Me Text */}
             <div className="lg:w-1/2">
                <span className="bg-primary-100 text-primary-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 md:mb-4 inline-block">My Approach</span>
                <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">About Me</h2>
                
                <p className="text-gray-600 leading-relaxed mb-4 md:mb-6 text-base md:text-lg">
                  I'm Rithanya Gopinathan, a Wellness Consultant dedicated to help you achieve a healthier, more balanced lifestyle through personalized nutrition.
                </p>
                <p className="text-gray-600 leading-relaxed mb-6 md:mb-8 text-base md:text-lg">
                  With a holistic approach to wellness, we'll work together to create a nutrition plan that fits your unique needs, preferences, and goals—all delivered conveniently online.
                </p>

                <div className="inline-flex items-center gap-3 md:gap-4 bg-white p-3 md:p-4 rounded-xl border border-gray-100 shadow-sm w-full sm:w-auto">
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 flex-shrink-0">
                      <Globe size={20} className="md:w-6 md:h-6" />
                   </div>
                   <div>
                      <p className="font-bold text-gray-900 text-sm">100% Online</p>
                      <p className="text-xs text-gray-500">Consultations available from anywhere</p>
                   </div>
                </div>
             </div>

             {/* Right Column: Philosophy Card */}
             <div className="lg:w-1/2 w-full mt-4 lg:mt-0">
                <div className="bg-white p-6 md:p-10 rounded-2xl shadow-lg border border-gray-100 relative">
                   <h3 className="font-serif text-xl md:text-2xl font-bold text-primary-900 mb-4">My Philosophy</h3>
                   <p className="text-gray-600 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                     I believe in nourishing both body and mind through balanced nutrition that is sustainable, enjoyable, and tailored to your individual needs.
                   </p>
                   
                   <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                      <li className="flex items-start gap-3">
                         <CheckCircle2 className="text-primary-500 mt-0.5 md:mt-1 flex-shrink-0 w-4 h-4 md:w-[18px] md:h-[18px]" />
                         <span className="text-gray-700 text-sm md:text-base">No extreme diets or quick fixes</span>
                      </li>
                      <li className="flex items-start gap-3">
                         <CheckCircle2 className="text-primary-500 mt-0.5 md:mt-1 flex-shrink-0 w-4 h-4 md:w-[18px] md:h-[18px]" />
                         <span className="text-gray-700 text-sm md:text-base">Science-backed nutrition advice</span>
                      </li>
                      <li className="flex items-start gap-3">
                         <CheckCircle2 className="text-primary-500 mt-0.5 md:mt-1 flex-shrink-0 w-4 h-4 md:w-[18px] md:h-[18px]" />
                         <span className="text-gray-700 text-sm md:text-base">Sustainable lifestyle changes</span>
                      </li>
                   </ul>

                   <div className="pt-5 md:pt-6 border-t border-gray-100">
                      <div>
                         <p className="font-bold text-gray-900 text-sm">Rithanya Gopinathan</p>
                         <p className="text-xs text-primary-600 font-medium">Wellness Consultant</p>
                      </div>
                   </div>
                </div>
             </div>
           </div>

           {/* Important Note Card */}
           <div className="bg-primary-50 border border-primary-100 rounded-xl p-6 md:p-8 text-center shadow-sm max-w-4xl mx-auto">
              <h3 className="font-serif text-lg md:text-xl font-bold text-primary-900 mb-2">Important Note</h3>
              <p className="text-gray-700 text-sm md:text-base">
                The outcomes are not typical; Individual outcomes may vary from person to person
              </p>
           </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-10 md:mb-12">
             <span className="bg-primary-50 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 md:mb-4 inline-block">Get In Touch</span>
             <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 md:mb-6">Contact Us</h2>
             <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
               Have questions or ready to start your wellness journey? Reach out and we'll get back to you as soon as possible.
             </p>
           </div>
           <ContactForm />
           <p className="text-center text-gray-500 text-xs md:text-sm mt-8 italic">
              Note: Consultations are by appointment only. Please contact us by filling the contact form to schedule.
           </p>
        </div>
      </section>
    </div>
  );
};
