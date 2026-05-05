import React, { useRef, useState } from 'react';
import { Mail, MapPin, Instagram, Facebook, Loader2, Check } from 'lucide-react';
import emailjs from '@emailjs/browser';

export const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateForm = () => {
    if (!form.current) return false;
    const formData = new FormData(form.current);
    const email = formData.get('user_email') as string;
    const phone = formData.get('user_phone') as string;
    const newErrors: { email?: string; phone?: string } = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone validation (Strictly 10 digits)
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!form.current) return;

    setIsSending(true);

    emailjs
      .sendForm('service_p4rnj4d', 'template_g9izt6u', form.current, {
        publicKey: 'MFNYuDPIGgrfQhb5C',
      })
      .then(
        () => {
          setIsSending(false);
          setShowSuccessModal(true);
          form.current?.reset();
          setErrors({});
        },
        (error) => {
          setIsSending(false);
          console.error('FAILED...', error.text);
          alert('Failed to send message. Please try again.');
        },
      );
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Info Panel - Green */}
        <div className="bg-[#0d9488] p-6 md:p-8 lg:p-12 lg:w-5/12 text-white flex flex-col justify-between h-auto lg:min-h-[600px]">
          
          <div>
            <h3 className="font-serif text-2xl font-bold mb-6 md:mb-10">Contact Information</h3>
            
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start gap-4">
                 <Mail className="text-white opacity-80 mt-1 flex-shrink-0" size={20} />
                 <div className="overflow-hidden w-full">
                   <p className="font-bold text-white text-sm mb-1">Email</p>
                   <p className="text-sm text-white/90 break-all">argpsnutritiouslifestyle25@gmail.com</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <svg 
                   xmlns="http://www.w3.org/2000/svg" 
                   width="20" 
                   height="20" 
                   viewBox="0 0 24 24" 
                   fill="none" 
                   stroke="currentColor" 
                   strokeWidth="2" 
                   strokeLinecap="round" 
                   strokeLinejoin="round" 
                   className="text-white opacity-80 mt-1 flex-shrink-0"
                 >
                   <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                   <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                 </svg>
                 <div>
                   <p className="font-bold text-white text-sm mb-1">WhatsApp</p>
                   <p className="text-sm text-white/90">+91 8056510590</p>
                 </div>
              </div>

              <div className="flex items-start gap-4">
                 <MapPin className="text-white opacity-80 mt-1 flex-shrink-0" size={20} />
                 <div>
                   <p className="font-bold text-white text-sm mb-1">Location</p>
                   <p className="text-sm text-white/90">Chennai, Tamil Nadu, India</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <h4 className="font-bold text-white mb-4 text-sm">Follow Me on</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/argps_nutritious_lifestyle?igsh=MWN6bzM1aXppNTFuNw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Instagram"
              >
                  <Instagram size={20} />
              </a>
              <a 
                href="https://www.facebook.com/share/1NwZcFCtLQ/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                aria-label="Facebook"
              >
                  <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Form Panel - White */}
        <div className="p-6 md:p-8 lg:p-12 lg:w-7/12 bg-white">
          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                <input 
                type="text" 
                id="name"
                name="user_name"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all bg-white text-base"
                placeholder="Your name"
                />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                id="email"
                name="user_email"
                required
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'} focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all bg-white text-base`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input 
                type="tel" 
                id="phone"
                name="user_phone"
                required
                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'} focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all bg-white text-base`}
                placeholder="9876543210"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
              <textarea 
                id="message"
                name="message"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all bg-white resize-none text-base"
                placeholder="Your message"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={isSending}
              className="w-full font-bold py-3.5 rounded-lg transition-all shadow-sm hover:shadow-md mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[#0d9488] text-white hover:bg-primary-800"
            >
              {isSending ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center transform scale-100 animate-in zoom-in-95 duration-200 relative">
            
            <div className="w-20 h-20 bg-[#0d9488] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-900/20">
              <Check size={40} className="text-white" strokeWidth={3} />
            </div>
            
            <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">Message sent successfully!</h3>
            
            <p className="text-gray-600 mb-8 leading-relaxed">
              Thanks for contacting ARGPS Nutritious Lifestyle.
            </p>
            
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#0d9488] text-white font-bold py-3.5 rounded-lg hover:bg-primary-800 transition-colors shadow-lg hover:shadow-xl"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};
