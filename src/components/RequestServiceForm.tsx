import { useRef, useState } from 'react';
import { CheckCircle2, Loader2, Phone, Upload, X, Home } from 'lucide-react';
import {
  ALLOWED_PHOTO_TYPES,
  MAX_PHOTO_BYTES,
  SERVICE_OPTIONS,
  TIME_WINDOW_OPTIONS,
  URGENCY_OPTIONS,
} from '@/types/forms';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from '@/lib/business';
import { supabase } from '@/lib/supabase';

interface FormErrors {
  [key: string]: string | undefined;
}

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

interface SuccessResult {
  referenceNumber: string;
}

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  serviceAddress: '',
  city: '',
  postalCode: '',
  serviceType: '',
  description: '',
  preferredDate: '',
  preferredTime: '',
  urgency: '',
  contactPermission: false,
};

export default function RequestServiceForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<SuccessResult | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (name: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
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
    if (!form.fullName.trim()) e.fullName = 'Please enter your full name.';
    if (!form.phone.trim()) e.phone = 'Please enter your phone number.';
    if (!form.email.trim()) e.email = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.serviceAddress.trim()) e.serviceAddress = 'Please enter your service address.';
    if (!form.city.trim()) e.city = 'Please enter your city.';
    if (!form.postalCode.trim()) e.postalCode = 'Please enter your postal code.';
    if (!form.serviceType) e.serviceType = 'Please select a service.';
    if (!form.description.trim()) e.description = 'Please describe the problem.';
    if (!form.preferredDate) e.preferredDate = 'Please select a preferred date.';
    if (!form.preferredTime) e.preferredTime = 'Please select a preferred time window.';
    if (!form.urgency) e.urgency = 'Please select an urgency level.';
    if (!form.contactPermission) e.contactPermission = 'You must allow us to contact you to submit a request.';
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
        photoPath = `service-requests/${fileName}`;
        const { error: uploadError } = await supabase.storage
          .from('request-photos')
          .upload(photoPath, photoFile, { upsert: false });
        if (uploadError) throw new Error('Photo upload failed. Please try again.');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-service-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          full_name: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          service_address: form.serviceAddress.trim(),
          city: form.city.trim(),
          postal_code: form.postalCode.trim(),
          service_type: form.serviceType,
          description: form.description.trim(),
          preferred_date: form.preferredDate,
          preferred_time: form.preferredTime,
          urgency: form.urgency,
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

      setSuccessResult({ referenceNumber: result.reference_number });
      setSubmitState('success');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Submission failed. Your information has been kept — please try again.',
      );
      setSubmitState('error');
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setPhotoFile(null);
    setErrors({});
    setSubmitError(null);
    setSuccessResult(null);
    setSubmitState('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const today = new Date().toISOString().split('T')[0];

  if (submitState === 'success' && successResult) {
    return (
      <div className="rounded-2xl border border-success-200 bg-success-50 p-8 text-center shadow-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
          <CheckCircle2 className="h-9 w-9 text-success-600" aria-hidden="true" />
        </div>
        <h3 className="mt-5 text-2xl font-bold text-navy-900">Your service request has been received.</h3>
        <p className="mt-2 text-base text-navy-600">
          Your reference number is{' '}
          <span className="font-bold text-navy-900">{successResult.referenceNumber}</span>
        </p>
        <p className="mt-4 text-sm text-navy-500">
          Submitting this form does not confirm an appointment. Freelance Plumbing will contact you to
          confirm availability.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href={BUSINESS_PHONE_TEL}
            className="flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-6 py-3 text-base font-bold text-white hover:bg-accent-600"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call {BUSINESS_PHONE_DISPLAY} for Urgent Problems
          </a>
          <a
            href="/#home"
            className="flex items-center justify-center gap-2 rounded-lg border-2 border-navy-200 px-6 py-3 text-base font-bold text-navy-700 hover:border-brand-400 hover:text-brand-700"
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full rounded-lg border px-4 py-3 text-base text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 ${
      errors[field]
        ? 'border-error-400 focus:border-error-500 focus:ring-error-200'
        : 'border-navy-200 focus:border-brand-500 focus:ring-brand-200'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {submitState === 'error' && submitError && (
        <div className="rounded-lg border border-error-200 bg-error-50 p-4 text-sm font-medium text-error-700">
          {submitError}
          <span className="mt-1 block font-normal">Your entered information has been kept — please try again.</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required error={errors.fullName} htmlFor="rs-fullName">
          <input
            id="rs-fullName"
            type="text"
            value={form.fullName}
            onChange={(e) => updateField('fullName', e.target.value)}
            className={inputClass('fullName')}
            autoComplete="name"
          />
        </Field>
        <Field label="Phone number" required error={errors.phone} htmlFor="rs-phone">
          <input
            id="rs-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className={inputClass('phone')}
            autoComplete="tel"
          />
        </Field>
      </div>

      <Field label="Email address" required error={errors.email} htmlFor="rs-email">
        <input
          id="rs-email"
          type="email"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          className={inputClass('email')}
          autoComplete="email"
        />
      </Field>

      <Field label="Service address" required error={errors.serviceAddress} htmlFor="rs-serviceAddress">
        <input
          id="rs-serviceAddress"
          type="text"
          value={form.serviceAddress}
          onChange={(e) => updateField('serviceAddress', e.target.value)}
          className={inputClass('serviceAddress')}
          autoComplete="street-address"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="City" required error={errors.city} htmlFor="rs-city">
          <input
            id="rs-city"
            type="text"
            value={form.city}
            onChange={(e) => updateField('city', e.target.value)}
            className={inputClass('city')}
            autoComplete="address-level2"
          />
        </Field>
        <Field label="Postal code" required error={errors.postalCode} htmlFor="rs-postalCode">
          <input
            id="rs-postalCode"
            type="text"
            value={form.postalCode}
            onChange={(e) => updateField('postalCode', e.target.value)}
            className={inputClass('postalCode')}
            autoComplete="postal-code"
          />
        </Field>
      </div>

      <Field label="Service needed" required error={errors.serviceType} htmlFor="rs-serviceType">
        <select
          id="rs-serviceType"
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
      </Field>

      <Field label="Problem description" required error={errors.description} htmlFor="rs-description">
        <textarea
          id="rs-description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          rows={4}
          className={inputClass('description')}
          placeholder="Describe the plumbing issue you are experiencing…"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Preferred date" required error={errors.preferredDate} htmlFor="rs-preferredDate">
          <input
            id="rs-preferredDate"
            type="date"
            min={today}
            value={form.preferredDate}
            onChange={(e) => updateField('preferredDate', e.target.value)}
            className={inputClass('preferredDate')}
          />
        </Field>
        <Field label="Preferred time window" required error={errors.preferredTime} htmlFor="rs-preferredTime">
          <select
            id="rs-preferredTime"
            value={form.preferredTime}
            onChange={(e) => updateField('preferredTime', e.target.value)}
            className={inputClass('preferredTime')}
          >
            <option value="">Select a time…</option>
            {TIME_WINDOW_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Urgency" required error={errors.urgency} htmlFor="rs-urgency">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {URGENCY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-3 py-2.5 text-center text-sm font-medium transition-colors ${
                form.urgency === opt.value
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-navy-200 text-navy-600 hover:border-navy-300'
              }`}
            >
              <input
                type="radio"
                name="urgency"
                value={opt.value}
                checked={form.urgency === opt.value}
                onChange={(e) => updateField('urgency', e.target.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Photo (optional)" htmlFor="rs-photo" error={photoError || undefined}>
        <div className="flex items-center gap-3">
          <label
            htmlFor="rs-photo"
            className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-dashed border-navy-200 px-4 py-3 text-sm font-medium text-navy-600 hover:border-brand-400 hover:text-brand-700"
          >
            <Upload className="h-5 w-5" aria-hidden="true" />
            {photoFile ? 'Change photo' : 'Upload a photo'}
          </label>
          <input
            ref={fileInputRef}
            id="rs-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            onChange={handlePhotoChange}
            className="sr-only"
          />
          {photoFile && (
            <span className="flex items-center gap-2 text-sm text-navy-600">
              <span className="max-w-[12rem] truncate">{photoFile.name}</span>
              <button type="button" onClick={removePhoto} className="text-error-500 hover:text-error-700">
                <X className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Remove photo</span>
              </button>
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-navy-400">JPG, PNG, WEBP, or HEIC. Max 5 MB.</p>
      </Field>

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
            <span className="text-error-600" aria-hidden="true">*</span>
          </span>
        </label>
        {errors.contactPermission && (
          <p className="mt-1 text-sm text-error-600">{errors.contactPermission}</p>
        )}
      </div>

      <div className="rounded-lg bg-navy-50 p-4 text-sm text-navy-500">
        Submitting this form does not confirm an appointment. Freelance Plumbing will contact you to
        confirm availability.
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitState === 'submitting'}
          className="flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-7 py-4 text-base font-bold text-white shadow-card transition-all hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {submitState === 'submitting' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Submitting…
            </>
          ) : (
            'Submit Service Request'
          )}
        </button>
        {submitState === 'error' && (
          <button
            type="button"
            onClick={resetForm}
            className="text-sm font-medium text-navy-500 underline hover:text-navy-700"
          >
            Clear and start over
          </button>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-navy-700">
        {label}
        {required && <span className="text-error-600" aria-hidden="true"> *</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
    </div>
  );
}
