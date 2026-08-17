import { Link } from 'react-router-dom';
import { Droplets, Mail, MapPin, Phone } from 'lucide-react';
import {
  BUSINESS_ADDRESS,
  BUSINESS_EMAIL,
  BUSINESS_EMAIL_HREF,
  BUSINESS_NAME,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
} from '@/lib/business';

const FOOTER_LINKS = [
  { label: 'Home', hash: '#home' },
  { label: 'Services', hash: '#services' },
  { label: 'Service Area', hash: '#service-area' },
  { label: 'About', hash: '#about' },
  { label: 'Request Service', hash: '#request-service' },
  { label: 'Contact', hash: '#contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-navy-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
                <Droplets className="h-5 w-5 text-white" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold text-white">{BUSINESS_NAME}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy-300">
              Dependable residential and commercial plumbing services within approximately 100 km of
              Scarborough, Toronto.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Navigation</h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.hash}>
                  <Link to={`/${link.hash}`} className="text-sm text-navy-300 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={BUSINESS_PHONE_TEL}
                  className="flex items-start gap-2 text-sm text-navy-300 hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  {BUSINESS_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={BUSINESS_EMAIL_HREF}
                  className="flex items-start gap-2 text-sm text-navy-300 hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                  {BUSINESS_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2 text-sm text-navy-300">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
                {BUSINESS_ADDRESS}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/privacy" className="text-sm text-navy-300 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-navy-300 hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-800 pt-6 text-center text-xs text-navy-400">
          &copy; {year} {BUSINESS_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
