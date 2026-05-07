import React from 'react';
import { Check } from 'lucide-react';

const PROFILE_URL = new URL('../rithanya-profile.jpg', import.meta.url).href;

export const About: React.FC = () => {
  return (
    <div className="bg-white text-gray-800">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 md:pb-32 md:pt-24 lg:px-8">
        <div className="text-center">
          <h1 className="mx-auto max-w-3xl font-serif text-3xl font-black leading-tight text-primary-900 sm:text-4xl md:text-[42px]">
            About ARGPS Nutritious
            <span className="block">Lifestyle</span>
          </h1>
          <div className="mx-auto mt-7 h-1.5 w-24 rounded-full bg-primary-500" />
        </div>

        <article className="mx-auto mt-14 max-w-6xl rounded-2xl bg-primary-50 px-6 py-9 text-center sm:px-10 md:px-20 md:py-12">
          <h2 className="font-serif text-2xl font-black text-primary-900">Our Mission</h2>
          <div className="mx-auto mt-7 max-w-5xl space-y-7 text-[15px] leading-7 text-gray-700 sm:text-base">
            <p>
              At ARGPS Nutritious Lifestyle, we are dedicated to help you achieve optimal health
              through personalized nutrition guidance and practical wellness strategies.
            </p>
            <p>
              Our approach combines scientific research with traditional wisdom to create
              sustainable, balanced eating habits that nourish both body and mind.
            </p>
          </div>
        </article>

        <div className="mx-auto mt-28 grid max-w-6xl gap-8 md:grid-cols-2 md:gap-10">
          <article className="flex min-h-[420px] flex-col rounded-2xl border border-gray-100 bg-white px-8 py-9 shadow-[0_10px_28px_rgba(15,23,42,0.10)] sm:px-10">
            <h2 className="font-serif text-2xl font-black text-primary-900">About Me</h2>
            <div className="mt-7 space-y-5 text-[15px] leading-7 text-gray-700">
              <p>
                I'm Rithanya Gopinathan, a Wellness Consultant dedicated to help you achieve a
                healthier, more balanced lifestyle through personalized nutrition.
              </p>
              <p>
                With a holistic approach to wellness, we'll work together to create a nutrition
                plan that fits your unique needs, preferences, and goals &mdash; all delivered
                conveniently online.
              </p>
            </div>

            <div className="mt-auto flex items-center gap-4 pt-10">
              <img
                src={PROFILE_URL}
                alt="Rithanya Gopinathan"
                className="h-16 w-16 rounded-full border-4 border-primary-50 object-cover"
              />
              <div>
                <h3 className="text-sm font-black text-gray-900">Rithanya Gopinathan</h3>
                <p className="mt-1 text-xs text-gray-500">Wellness Consultant</p>
              </div>
            </div>
          </article>

          <article className="min-h-[420px] rounded-2xl border border-gray-100 bg-white px-8 py-9 shadow-[0_10px_28px_rgba(15,23,42,0.10)] sm:px-10">
            <h2 className="font-serif text-2xl font-black text-primary-900">My Approach</h2>
            <div className="mt-8 space-y-8">
              {[
                ['Personalized nutrition plans', 'tailored to your needs'],
                ['Sustainable lifestyle changes', 'for long-term health'],
              ].map(([title, detail]) => (
                <div key={title} className="flex items-start gap-5">
                  <span className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
                    <p className="mt-1 text-sm text-gray-500">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};
