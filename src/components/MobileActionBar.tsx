import { Phone, ClipboardList, FileText } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BUSINESS_PHONE_TEL } from '@/lib/business';
import { useQuoteModal } from '@/context/QuoteModalContext';

export default function MobileActionBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { openQuoteModal } = useQuoteModal();

  const goToRequestForm = () => {
    if (location.pathname !== '/') {
      navigate('/#request-service');
      return;
    }
    document.getElementById('request-service')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-3 border-t border-navy-800 bg-navy-900 shadow-[0_-4px_12px_rgba(0,0,0,0.15)] lg:hidden">
      <a
        href={BUSINESS_PHONE_TEL}
        className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-white active:bg-white/10"
      >
        <Phone className="h-5 w-5 text-accent-400" aria-hidden="true" />
        <span className="text-xs font-semibold">Call</span>
      </a>
      <button
        type="button"
        onClick={goToRequestForm}
        className="flex flex-col items-center justify-center gap-0.5 border-x border-navy-800 py-2.5 text-white active:bg-white/10"
      >
        <ClipboardList className="h-5 w-5 text-brand-400" aria-hidden="true" />
        <span className="text-xs font-semibold">Request</span>
      </button>
      <button
        type="button"
        onClick={openQuoteModal}
        className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-white active:bg-white/10"
      >
        <FileText className="h-5 w-5 text-brand-400" aria-hidden="true" />
        <span className="text-xs font-semibold">Quote</span>
      </button>
    </div>
  );
}
