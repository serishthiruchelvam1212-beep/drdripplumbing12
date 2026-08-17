import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Droplets, Menu, Phone, X } from 'lucide-react';
import { BUSINESS_NAME, BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from '@/lib/business';

const NAV_LINKS = [
  { label: 'Home', hash: '#home' },
  { label: 'Services', hash: '#services' },
  { label: 'Service Area', hash: '#service-area' },
  { label: 'About', hash: '#about' },
  { label: 'Request Service', hash: '#request-service' },
  { label: 'Contact', hash: '#contact' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleNavClick = (hash: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate(`/${hash}`);
    } else {
      const el = document.getElementById(hash.replace('#', ''));
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-navy-900/95 backdrop-blur-sm shadow-lg' : 'bg-navy-900'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link
          to="/#home"
          onClick={handleNavClick('#home')}
          className="flex items-center gap-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 lg:h-11 lg:w-11">
            <Droplets className="h-5 w-5 text-white lg:h-6 lg:w-6" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white lg:text-xl">{BUSINESS_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.hash}
              to={`/${link.hash}`}
              onClick={handleNavClick(link.hash)}
              className="rounded-md px-3 py-2 text-sm font-medium text-navy-100 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={BUSINESS_PHONE_TEL}
            className="hidden items-center gap-2 rounded-lg bg-accent-500 px-4 py-2.5 text-sm font-bold text-white shadow-card transition-all hover:bg-accent-600 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-300 sm:flex"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call Now
          </a>

          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 lg:hidden"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        className={`overflow-hidden bg-navy-900 transition-[max-height] duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? 'max-h-[28rem]' : 'max-h-0'
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 pb-4 pt-2" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.hash}
              to={`/${link.hash}`}
              onClick={handleNavClick(link.hash)}
              className="rounded-md px-3 py-3 text-base font-medium text-navy-100 hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={BUSINESS_PHONE_TEL}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-4 py-3 text-base font-bold text-white shadow-card hover:bg-accent-600"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call {BUSINESS_PHONE_DISPLAY}
          </a>
        </nav>
      </div>
    </header>
  );
}
