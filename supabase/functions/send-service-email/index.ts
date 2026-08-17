import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ServiceRequestPayload {
  full_name: string;
  phone: string;
  email: string;
  service_address: string;
  city: string;
  postal_code: string;
  service_type: string;
  description: string;
  preferred_date: string;
  preferred_time: string;
  urgency: string;
  contact_permission: boolean;
  photo_url: string | null;
}

const VALID_SERVICE_TYPES = [
  'drain_cleaning', 'leak_repair', 'toilet_service', 'faucet_fixture_service',
  'pipe_repair', 'water_heater_service', 'sump_pump_service', 'sewer_service',
  'kitchen_plumbing', 'bathroom_plumbing', 'commercial_plumbing',
  'inspection_maintenance', 'other',
];

const VALID_URGENCY = ['emergency', 'asap', 'few_days', 'flexible'];
const VALID_TIME_WINDOWS = ['morning', 'afternoon', 'evening', 'flexible'];

const BUSINESS_EMAIL = 'dexter125555@gmail.com';
const BUSINESS_PHONE = '437-245-1556';
const BUSINESS_NAME = 'Freelance Plumbing';

function validatePayload(p: Partial<ServiceRequestPayload>): string | null {
  if (!p.full_name || p.full_name.trim().length < 2) return 'Full name is required.';
  if (!p.phone || p.phone.trim().length < 7) return 'A valid phone number is required.';
  if (!p.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return 'A valid email is required.';
  if (!p.service_address || p.service_address.trim().length < 3) return 'Service address is required.';
  if (!p.city || p.city.trim().length < 2) return 'City is required.';
  if (!p.postal_code || p.postal_code.trim().length < 3) return 'Postal code is required.';
  if (!p.service_type || !VALID_SERVICE_TYPES.includes(p.service_type)) return 'A valid service type is required.';
  if (!p.description || p.description.trim().length < 5) return 'A problem description is required.';
  if (!p.preferred_date) return 'Preferred date is required.';
  if (!p.preferred_time || !VALID_TIME_WINDOWS.includes(p.preferred_time)) return 'A valid time window is required.';
  if (!p.urgency || !VALID_URGENCY.includes(p.urgency)) return 'A valid urgency level is required.';
  if (p.contact_permission !== true) return 'Contact permission is required.';
  return null;
}

function sanitize(s: string): string {
  return s.trim().slice(0, 2000);
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  apiKey: string,
): Promise<{ ok: boolean; error: string | null }> {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${BUSINESS_NAME} <onboarding@resend.dev>`,
        to,
        subject,
        html,
      }),
    });
    if (!response.ok) {
      const errBody = await response.text().catch(() => 'unknown error');
      return { ok: false, error: `${response.status}: ${errBody}` };
    }
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'fetch failed' };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json() as Partial<ServiceRequestPayload>;
    const validationError = validatePayload(body);
    if (validationError) {
      return new Response(JSON.stringify({ error: validationError }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const payload: ServiceRequestPayload = {
      full_name: sanitize(body.full_name!),
      phone: sanitize(body.phone!),
      email: sanitize(body.email!),
      service_address: sanitize(body.service_address!),
      city: sanitize(body.city!),
      postal_code: sanitize(body.postal_code!),
      service_type: body.service_type!,
      description: sanitize(body.description!),
      preferred_date: body.preferred_date!,
      preferred_time: body.preferred_time!,
      urgency: body.urgency!,
      contact_permission: true,
      photo_url: body.photo_url ?? null,
    };

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Insert into database
    const { data, error } = await supabase
      .from('service_requests')
      .insert({
        full_name: payload.full_name,
        phone: payload.phone,
        email: payload.email,
        service_address: payload.service_address,
        city: payload.city,
        postal_code: payload.postal_code,
        service_type: payload.service_type,
        description: payload.description,
        preferred_date: payload.preferred_date,
        preferred_time: payload.preferred_time,
        urgency: payload.urgency,
        contact_permission: payload.contact_permission,
        photo_url: payload.photo_url,
      })
      .select('reference_number')
      .single();

    if (error || !data?.reference_number) {
      return new Response(JSON.stringify({ error: 'Failed to save your request. Please try again.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const referenceNumber = data.reference_number;

    // Attempt email notifications — failures do NOT lose the request
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    let emailSent = false;
    let emailError: string | null = null;

    if (resendApiKey) {
      const serviceLabel = payload.service_type.replace(/_/g, ' ');
      const urgencyLabel = payload.urgency === 'asap' ? 'ASAP' : payload.urgency.replace(/_/g, ' ');

      // Business notification
      const businessHtml = `
        <h2>New Service Request — ${referenceNumber}</h2>
        <p><strong>Name:</strong> ${payload.full_name}</p>
        <p><strong>Phone:</strong> ${payload.phone}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Service Address:</strong> ${payload.service_address}, ${payload.city}, ${payload.postal_code}</p>
        <p><strong>Service Type:</strong> ${serviceLabel}</p>
        <p><strong>Urgency:</strong> ${urgencyLabel}</p>
        <p><strong>Preferred Date:</strong> ${payload.preferred_date}</p>
        <p><strong>Preferred Time:</strong> ${payload.preferred_time}</p>
        <p><strong>Description:</strong> ${payload.description}</p>
        ${payload.photo_url ? `<p><strong>Photo:</strong> ${payload.photo_url}</p>` : ''}
        <p><strong>Reference:</strong> ${referenceNumber}</p>
      `;

      // Customer confirmation
      const customerHtml = `
        <h2>Thank you for contacting ${BUSINESS_NAME}</h2>
        <p>Hi ${payload.full_name},</p>
        <p>We have received your service request. Your reference number is <strong>${referenceNumber}</strong>.</p>
        <p><strong>Requested service:</strong> ${serviceLabel}</p>
        <p><strong>Preferred date:</strong> ${payload.preferred_date}</p>
        <p><strong>Preferred time:</strong> ${payload.preferred_time}</p>
        <p>Please note: your appointment is <strong>awaiting confirmation</strong>. We will contact you shortly to confirm availability.</p>
        <p>For urgent matters, call us at <strong>${BUSINESS_PHONE}</strong>.</p>
        <p>Thank you,<br>${BUSINESS_NAME}</p>
      `;

      const bizResult = await sendEmail(BUSINESS_EMAIL, `New Service Request — ${referenceNumber}`, businessHtml, resendApiKey);
      const custResult = await sendEmail(payload.email, `Your Service Request — ${referenceNumber}`, customerHtml, resendApiKey);

      emailSent = bizResult.ok;
      if (!bizResult.ok) {
        emailError = bizResult.error;
      } else if (!custResult.ok) {
        emailError = `Business email sent, but customer confirmation failed: ${custResult.error}`;
      }
    } else {
      emailError = 'RESEND_API_KEY not configured.';
    }

    return new Response(JSON.stringify({
      success: true,
      reference_number: referenceNumber,
      email_sent: emailSent,
      email_error: emailError,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err instanceof Error ? err.message : 'An unexpected error occurred.',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
