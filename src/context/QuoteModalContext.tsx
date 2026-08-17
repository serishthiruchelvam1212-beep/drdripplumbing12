import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from 'react';

interface QuoteModalContextValue {
  isOpen: boolean;
  openQuoteModal: () => void;
  closeQuoteModal: () => void;
}

const QuoteModalContext = createContext<QuoteModalContextValue | null>(null);

export function QuoteModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openQuoteModal = useCallback(() => setIsOpen(true), []);
  const closeQuoteModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, openQuoteModal, closeQuoteModal }), [isOpen, openQuoteModal, closeQuoteModal]);

  return <QuoteModalContext.Provider value={value}>{children}</QuoteModalContext.Provider>;
}

export function useQuoteModal() {
  const ctx = useContext(QuoteModalContext);
  if (!ctx) throw new Error('useQuoteModal must be used within a QuoteModalProvider');
  return ctx;
}
