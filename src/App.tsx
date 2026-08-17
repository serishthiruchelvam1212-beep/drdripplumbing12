import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import ServiceArea from '@/components/ServiceArea';
import About from '@/components/About';
import Contact from '@/components/Contact';
import RequestServiceForm from '@/components/RequestServiceForm';
import QuoteModal from '@/components/QuoteModal';
import MobileActionBar from '@/components/MobileActionBar';
import ChatBot from '@/components/ChatBot';
import ScrollToHash from '@/components/ScrollToHash';
import { QuoteModalProvider } from '@/context/QuoteModalContext';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';

function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <ServiceArea />
      <About />
      <section id="request-service" className="bg-navy-50 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Request Service</h2>
            <p className="mt-4 text-lg leading-relaxed text-navy-500">
              Fill out the form below and we will contact you to confirm availability.
            </p>
          </div>
          <div className="mt-10 rounded-2xl border border-navy-100 bg-white p-6 shadow-card sm:p-8">
            <RequestServiceForm />
          </div>
        </div>
      </section>
      <Contact />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <QuoteModalProvider>
        <ScrollToHash />
        <Header />
        <main className="pb-16 lg:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </main>
        <Footer />
        <MobileActionBar />
        <ChatBot />
        <QuoteModal />
      </QuoteModalProvider>
    </BrowserRouter>
  );
}
