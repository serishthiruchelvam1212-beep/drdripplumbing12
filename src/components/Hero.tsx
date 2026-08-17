import { Phone, Wrench } from 'lucide-react';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from '@/lib/business';

export default function Hero() {
  const scrollToRequestForm = () => {
    document.getElementById('request-service')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="home" className="relative overflow-hidden bg-navy-900 pt-16 lg:pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&h=650&w=940')",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/60 via-navy-900/85 to-navy-900" aria-hidden="true" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-start px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-200 animate-fade-in">
          <Wrench className="h-4 w-4" aria-hidden="true" />
          Serving Scarborough &amp; the surrounding area
        </div>

        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-up">
          Reliable Plumbing Help When You Need It
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-navy-100 sm:text-xl animate-fade-up [animation-delay:100ms] opacity-0">
          Freelance Plumbing provides dependable residential and commercial plumbing services within
          approximately 100 km of our location.
        </p>

        <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row animate-fade-up [animation-delay:200ms] opacity-0">
          <a
            href={BUSINESS_PHONE_TEL}
            className="flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-7 py-4 text-base font-bold text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call {BUSINESS_PHONE_DISPLAY}
          </a>
          <button
            type="button"
            onClick={scrollToRequestForm}
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-white/25 bg-white/5 px-7 py-4 text-base font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Request Service
          </button>
        </div>
      </div>
    </section>
  );
}
