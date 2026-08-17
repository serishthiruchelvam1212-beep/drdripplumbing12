import { Link } from 'react-router-dom';
import { BUSINESS_EMAIL, BUSINESS_EMAIL_HREF, BUSINESS_NAME } from '@/lib/business';

export default function Privacy() {
  return (
    <div className="bg-white pt-24 pb-20 sm:pt-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-navy-400">Last updated: {new Date().getFullYear()}</p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-navy-600">
          <p>
            {BUSINESS_NAME} respects your privacy. This policy explains how we use the information you
            provide when you contact us or submit a service or quote request.
          </p>

          <section>
            <h2 className="text-xl font-bold text-navy-900">Information We Collect</h2>
            <p className="mt-2">
              When you submit a service request or quote request, we collect your name, phone number,
              email address, service address, city, postal code, the type of service you need, a
              description of the problem, your preferred date and time, urgency, and any photo you
              choose to upload.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900">How We Use Your Information</h2>
            <p className="mt-2">
              We use your contact and service information to respond to your request, arrange plumbing
              services, provide an estimate or quote, and communicate with you about your appointment.
              We do not sell or rent your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900">How We Store Your Information</h2>
            <p className="mt-2">
              Your submissions are stored securely. Other visitors cannot read, edit, or delete your
              requests. Only authorized personnel at {BUSINESS_NAME} can access submitted information to
              respond to your request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900">Contacting You</h2>
            <p className="mt-2">
              By submitting a request, you give us permission to contact you by phone or email about
              your request. You can ask us to stop contacting you at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-navy-900">Questions</h2>
            <p className="mt-2">
              If you have questions about how your information is handled, please contact us at{' '}
              <a href={BUSINESS_EMAIL_HREF} className="font-medium text-brand-700 hover:underline">
                {BUSINESS_EMAIL}
              </a>
              .
            </p>
          </section>

          <p className="text-sm text-navy-400">
            This is a basic privacy notice. It does not constitute formal legal advice and makes no
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
