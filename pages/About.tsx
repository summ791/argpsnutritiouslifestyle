import React from 'react';

const LOGO_URL = 'https://raw.githubusercontent.com/summ791/argpsapp2/main/logo.jpg';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fbfbf2] px-4 py-12 text-gray-800 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-[32px] border border-primary-100 bg-white p-8 shadow-[0_24px_80px_rgba(19,78,74,0.08)] md:p-14">
        <div className="flex items-center gap-4">
          <img src={LOGO_URL} alt="ARGPS Logo" className="h-16 w-auto object-contain" />
          <div>
            <h1 className="font-serif text-3xl font-bold text-primary-950">ARGPS Nutritious Lifestyle</h1>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-600">Tamil Nadu Nutrition Focus</p>
          </div>
        </div>

        <p className="mt-12 text-xs font-black uppercase tracking-[0.22em] text-primary-600">About the course</p>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight text-primary-950 md:text-5xl">
          A practical guide built around real Tamil Nadu food habits.
        </h2>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-gray-600">
          ARGPS Nutritious Lifestyle teaches nutrition through familiar meals, household portions, local ingredients, and sustainable everyday choices.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="rounded-[24px] border border-primary-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary-600">Main Author</p>
            <h3 className="mt-3 font-serif text-2xl font-bold text-primary-950">G. Subashini</h3>
            <p className="mt-1 font-semibold text-gray-500">Nutritionist</p>
          </article>
          <article className="rounded-[24px] border border-primary-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-primary-600">Co-Author</p>
            <h3 className="mt-3 font-serif text-2xl font-bold text-primary-950">Rithanya Gopinathan</h3>
            <p className="mt-1 font-semibold text-gray-500">Wellness Consultant</p>
          </article>
        </div>

        <div className="mt-10 rounded-[26px] border-l-4 border-primary-500 bg-primary-50 p-7">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary-600">Mission</p>
          <p className="mt-3 font-serif text-3xl leading-10 text-primary-950">
            To provide a practical, realistic, and culturally relevant nutrition guide based on Tamil Nadu food habits.
          </p>
        </div>
      </section>
    </div>
  );
};
