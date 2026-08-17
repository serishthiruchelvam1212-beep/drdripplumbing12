import { Droplets, MapPin, Phone, ShieldCheck, Clock, Wrench } from 'lucide-react';
import { BUSINESS_ADDRESS, BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL, SERVICE_RADIUS_KM } from '@/lib/business';

export default function About() {
  return (
    <section id="about" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl shadow-card">
              <img
                src="https://images.pexels.com/photos/7859953/pexels-photo-7859953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="Plumber's hands working on a boiler system with tools"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">About Freelance Plumbing</h2>
            <p className="mt-5 text-lg leading-relaxed text-navy-500">
              Freelance Plumbing provides dependable residential and commercial plumbing services to
              customers within approximately {SERVICE_RADIUS_KM} km of our location. Whether it is a
              sudden leak, a slow drain, or routine maintenance, our goal is to help you get your
              plumbing back to working order.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50 p-4">
                <Wrench className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold text-navy-900">Residential &amp; Commercial</h3>
                  <p className="mt-1 text-sm text-navy-500">Plumbing service for homes and businesses.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50 p-4">
                <MapPin className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold text-navy-900">Local Service Area</h3>
                  <p className="mt-1 text-sm text-navy-500">Approximately {SERVICE_RADIUS_KM} km from {BUSINESS_ADDRESS}.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50 p-4">
                <Clock className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold text-navy-900">Request an Appointment</h3>
                  <p className="mt-1 text-sm text-navy-500">Submit a request and we will contact you to confirm.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-navy-100 bg-navy-50 p-4">
                <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-brand-600" aria-hidden="true" />
                <div>
                  <h3 className="text-sm font-bold text-navy-900">Clear Communication</h3>
                  <p className="mt-1 text-sm text-navy-500">We confirm availability before any appointment.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={BUSINESS_PHONE_TEL}
                className="flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3.5 text-base font-bold text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-card-hover"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Call {BUSINESS_PHONE_DISPLAY}
              </a>
              <button
                type="button"
                onClick={() => document.getElementById('request-service')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-navy-200 px-6 py-3.5 text-base font-bold text-navy-700 transition-all hover:-translate-y-0.5 hover:border-brand-400 hover:text-brand-700"
              >
                <Droplets className="h-5 w-5" aria-hidden="true" />
                Request Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
