import { Link } from 'react-router-dom';
import { BUSINESS_EMAIL, BUSINESS_EMAIL_HREF, BUSINESS_NAME } from '@/lib/business';

export default function Terms() {
  return (
    <div className="bg-white pt-24 pb-20 sm:pt-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-navy-400">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-navy-600">
          <p>
            These terms describe the use of the {BUSINESS_NAME} website and the process for requesting
            plumbing services.
          </p>

          <section>
            <h2 className="text-xl font-bold text-navy-900">Service Requests Are Not Confirmations</h2>
            <p className="mt-2">
              Submitting a service request or quote request through this website does not confirm an
              appointment. {BUSINESS_NAME} will contact you to confirm availability. No appointment is
              scheduled until confirmed by us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900">Service Availability</h2>
            <p className="mt-2">
              We serve locations within approximately 100 km of our location. Actual availability must
              be confirmed. We may not be able to service every request depending on location,
              scheduling, or the nature of the work.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900">Accuracy of Information</h2>
            <p className="mt-2">
              You agree to provide accurate and truthful information when submitting a request. We are
              not responsible for errors or delays caused by inaccurate contact or address information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900">Contact</h2>
            <p className="mt-2">
              Questions about these terms can be sent to{' '}
              <a href={BUSINESS_EMAIL_HREF} className="font-medium text-brand-700 hover:underline">
                {BUSINESS_EMAIL}
              </a>
              .
            </p>
          </section>

          <p className="text-sm text-navy-400">
            This is a basic terms notice. It does not constitute formal legal advice and makes no
            legal claims beyond what is described above.
          </p>
        </div>

        <div className="mt-10">
          <Link
            to="/#home"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-3 text-base font-bold text-white hover:bg-brand-700"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
