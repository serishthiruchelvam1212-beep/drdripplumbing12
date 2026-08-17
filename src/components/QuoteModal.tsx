import { useRef, useState } from 'react';
import { CheckCircle2, Loader2, Phone, Upload, X, Home } from 'lucide-react';
import { ALLOWED_PHOTO_TYPES, MAX_PHOTO_BYTES, SERVICE_OPTIONS } from '@/types/forms';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from '@/lib/business';
import { supabase } from '@/lib/supabase';
import { useQuoteModal } from '@/context/QuoteModalContext';

interface FormErrors {
  [key: string]: string | undefined;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  postalCode: '',
  serviceType: '',
  description: '',
  contactPermission: false,
};

export default function QuoteModal() {
  const { isOpen, closeQuoteModal } = useQuoteModal();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (name: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError('Please use a JPG, PNG, WEBP, or HEIC image.');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError('Image must be 5 MB or smaller.');
      return;
    }
    setPhotoFile(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = 'Please enter your name.';
    if (!form.phone.trim()) e.phone = 'Please enter your phone number.';
    if (!form.email.trim()) e.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email.';
    if (!form.postalCode.trim()) e.postalCode = 'Please enter your postal code.';
    if (!form.serviceType) e.serviceType = 'Please select a service.';
    if (!form.description.trim()) e.description = 'Please describe the problem.';
    if (!form.contactPermission) e.contactPermission = 'You must allow us to contact you.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitState === 'submitting') return;
    setSubmitError(null);
    if (!validate()) return;

    setSubmitState('submitting');
    try {
      let photoPath: string | null = null;
      if (photoFile) {
        const ext = photoFile.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        photoPath = `quote-requests/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('request-photos')
          .upload(photoPath, photoFile, { upsert: false });
        if (uploadError) throw new Error('Photo upload failed. Please try again.');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-quote-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          full_name: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          postal_code: form.postalCode.trim(),
          service_type: form.serviceType,
          description: form.description.trim(),
          contact_permission: form.contactPermission,
          photo_url: photoPath,
        }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.error || `Submission failed (${response.status}). Please try again.`);
      }

      const result = await response.json();
      if (!result?.reference_number) {
        throw new Error('No reference number was returned. Please try again.');
      }

      setReferenceNumber(result.reference_number);
      setSubmitState('success');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Submission failed. Your information has been kept — please try again.',
      );
      setSubmitState('error');
    }
  };

  const resetAndClose = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitError(null);
    setReferenceNumber(null);
    setSubmitState('idle');
    setPhotoFile(null);
    setPhotoError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    closeQuoteModal();
  };

  if (!isOpen) return null;

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-2.5 text-base text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 ${
      errors[field]
        ? 'border-error-400 focus:border-error-500 focus:ring-error-200'
        : 'border-navy-200 focus:border-brand-500 focus:ring-brand-200'
    }`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
        onClick={submitState === 'success' ? resetAndClose : undefined}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="quote-modal-title"
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-card-hover sm:p-8"
      >
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-navy-400 hover:bg-navy-100 hover:text-navy-700"
        >
          <X className="h-5 w-5" />
        </button>

        {submitState === 'success' && referenceNumber ? (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
              <CheckCircle2 className="h-9 w-9 text-success-600" aria-hidden="true" />
            </div>
            <h3 id="quote-modal-title" className="mt-5 text-2xl font-bold text-navy-900">
              Your quote request has been received.
            </h3>
            <p className="mt-2 text-base text-navy-600">
              Your reference number is <span className="font-bold text-navy-900">{referenceNumber}</span>
            </p>
            <p className="mt-4 text-sm text-navy-500">
              Freelance Plumbing will contact you to confirm availability and provide a quote.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href={BUSINESS_PHONE_TEL}
                className="flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-5 py-3 text-base font-bold text-white hover:bg-accent-600"
              >
                <Phone className="h-5 w-5" aria-hidden="true" />
                Call {BUSINESS_PHONE_DISPLAY}
              </a>
              <button
                type="button"
                onClick={resetAndClose}
                className="flex items-center justify-center gap-2 rounded-lg border-2 border-navy-200 px-5 py-3 text-base font-bold text-navy-700 hover:border-brand-400 hover:text-brand-700"
              >
                <Home className="h-5 w-5" aria-hidden="true" />
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 id="quote-modal-title" className="text-2xl font-bold text-navy-900">
              Get a Quick Quote
            </h3>
            <p className="mt-1 text-sm text-navy-500">
              Fill out this short form and we will get back to you with a quote.
            </p>

            {submitState === 'error' && submitError && (
              <div className="mt-4 rounded-lg border border-error-200 bg-error-50 p-3 text-sm font-medium text-error-700">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="q-name" className="mb-1 block text-sm font-semibold text-navy-700">
                    Name <span className="text-error-600">*</span>
                  </label>
                  <input
                    id="q-name"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className={inputClass('fullName')}
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-error-600">{errors.fullName}</p>}
                </div>
                <div>
                  <label htmlFor="q-phone" className="mb-1 block text-sm font-semibold text-navy-700">
                    Phone <span className="text-error-600">*</span>
                  </label>
                  <input
                    id="q-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className={inputClass('phone')}
                  />
                  {errors.phone && <p className="mt-1 text-sm text-error-600">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="q-email" className="mb-1 block text-sm font-semibold text-navy-700">
                    Email <span className="text-error-600">*</span>
                  </label>
                  <input
                    id="q-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="mt-1 text-sm text-error-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="q-postal" className="mb-1 block text-sm font-semibold text-navy-700">
                    Postal code <span className="text-error-600">*</span>
                  </label>
                  <input
                    id="q-postal"
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    className={inputClass('postalCode')}
                  />
                  {errors.postalCode && <p className="mt-1 text-sm text-error-600">{errors.postalCode}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="q-service" className="mb-1 block text-sm font-semibold text-navy-700">
                  Service needed <span className="text-error-600">*</span>
                </label>
                <select
                  id="q-service"
                  value={form.serviceType}
                  onChange={(e) => updateField('serviceType', e.target.value)}
                  className={inputClass('serviceType')}
                >
                  <option value="">Select a service…</option>
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.serviceType && <p className="mt-1 text-sm text-error-600">{errors.serviceType}</p>}
              </div>

              <div>
                <label htmlFor="q-desc" className="mb-1 block text-sm font-semibold text-navy-700">
                  Short problem description <span className="text-error-600">*</span>
                </label>
                <textarea
                  id="q-desc"
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  rows={3}
                  className={inputClass('description')}
                />
                {errors.description && <p className="mt-1 text-sm text-error-600">{errors.description}</p>}
              </div>

              <div>
                <label
                  htmlFor="q-photo"
                  className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-navy-200 px-4 py-2.5 text-sm font-medium text-navy-600 hover:border-brand-400 hover:text-brand-700"
                >
                  <Upload className="h-5 w-5" aria-hidden="true" />
                  {photoFile ? 'Change photo' : 'Upload a photo (optional)'}
                </label>
                <input
                  ref={fileInputRef}
                  id="q-photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
                {photoFile && (
                  <span className="mt-1 flex items-center gap-2 text-sm text-navy-600">
                    <span className="max-w-[12rem] truncate">{photoFile.name}</span>
                    <button type="button" onClick={removePhoto} className="text-error-500 hover:text-error-700">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove photo</span>
                    </button>
                  </span>
                )}
                {photoError && <p className="mt-1 text-sm text-error-600">{photoError}</p>}
                <p className="mt-1 text-xs text-navy-400">JPG, PNG, WEBP, or HEIC. Max 5 MB.</p>
              </div>

              <div>
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.contactPermission}
                    onChange={(e) => updateField('contactPermission', e.target.checked)}
                    className="mt-0.5 h-5 w-5 rounded border-navy-300 text-brand-600 focus:ring-brand-400"
                  />
                  <span className="text-sm text-navy-600">
                    I give Freelance Plumbing permission to contact me about this request.{' '}
                    <span className="text-error-600">*</span>
                  </span>
                </label>
                {errors.contactPermission && (
                  <p className="mt-1 text-sm text-error-600">{errors.contactPermission}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitState === 'submitting'}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3.5 text-base font-bold text-white shadow-card hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitState === 'submitting' ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                    Submitting…
                  </>
                ) : (
                  'Submit Quote Request'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
