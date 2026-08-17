import { Phone, Mail, MapPin, Clock, FileText, ClipboardList } from 'lucide-react';
import {
  BUSINESS_ADDRESS,
  BUSINESS_EMAIL,
  BUSINESS_EMAIL_HREF,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  SERVICE_RADIUS_KM,
} from '@/lib/business';
import { useQuoteModal } from '@/context/QuoteModalContext';

export default function Contact() {
  const { openQuoteModal } = useQuoteModal();

  return (
    <section id="contact" className="bg-navy-900 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Contact Us</h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-200">
            Have a plumbing question or need to book a service? Reach out and we will get back to you.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-navy-700 bg-navy-800 p-6 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500">
              <Phone className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Phone</h3>
            <a href={BUSINESS_PHONE_TEL} className="mt-2 block text-base text-brand-300 hover:text-brand-200">
              {BUSINESS_PHONE_DISPLAY}
            </a>
            <a
              href={BUSINESS_PHONE_TEL}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-accent-600"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call Now
            </a>
          </div>

          <div className="rounded-2xl border border-navy-700 bg-navy-800 p-6 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500">
              <Mail className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Email</h3>
            <a href={BUSINESS_EMAIL_HREF} className="mt-2 block text-base text-brand-300 hover:text-brand-200 break-all">
              {BUSINESS_EMAIL}
            </a>
            <button
              type="button"
              onClick={openQuoteModal}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
            >
              <FileText className="h-4 w-4" aria-hidden="true" />
              Get a Quote
            </button>
          </div>

          <div className="rounded-2xl border border-navy-700 bg-navy-800 p-6 shadow-card">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500">
              <MapPin className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Address &amp; Service Area</h3>
            <p className="mt-2 text-base text-navy-200">{BUSINESS_ADDRESS}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-navy-300">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Service radius: approx. {SERVICE_RADIUS_KM} km
            </p>
            <button
              type="button"
              onClick={() => document.getElementById('service-area')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-navy-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-navy-700"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              View Service Area
            </button>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href={BUSINESS_PHONE_TEL}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3.5 text-base font-bold text-white shadow-card hover:bg-accent-600 sm:w-auto"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call Now
          </a>
          <button
            type="button"
            onClick={() => document.getElementById('request-service')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 py-3.5 text-base font-bold text-white shadow-card hover:bg-brand-700 sm:w-auto"
          >
            <ClipboardList className="h-5 w-5" aria-hidden="true" />
            Request Service
          </button>
          <button
            type="button"
            onClick={openQuoteModal}
            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-navy-600 px-6 py-3.5 text-base font-bold text-white hover:bg-navy-700 sm:w-auto"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            Get a Quote
          </button>
        </div>
      </div>
    </section>
  );
}
