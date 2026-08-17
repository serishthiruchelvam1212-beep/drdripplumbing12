const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const TWILIO_ACCOUNT_SID = 'AC812e0350e72125b814bd654307c67b22';
const TWILIO_AUTH_TOKEN = '95aae91d36ef38d68e58559369c8fe22';
const TWILIO_PHONE_NUMBER = '+17372212163';
const OWNER_PHONE_NUMBER = '+14372451556';
const BUSINESS_NAME = 'Freelance Plumbing';

function twimlResponse(body: string): Response {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Response>\n${body}\n</Response>`;
  return new Response(xml, {
    headers: { ...corsHeaders, 'Content-Type': 'text/xml; charset=utf-8' },
  });
}

async function sendSms(to: string, from: string, body: string): Promise<void> {
  const auth = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
    },
  );
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  let params: Record<string, string> = {};

  if (req.method === 'POST') {
    const formData = await req.formData();
    for (const [key, value] of formData.entries()) {
      params[key] = value.toString();
    }
  } else if (req.method === 'GET') {
    const url = new URL(req.url);
    url.searchParams.forEach((value, key) => {
      params[key] = value;
    });
  }

  const dialCallStatus = params['DialCallStatus'];
  const callerNumber = params['From'] || params['Caller'] || 'Unknown';
  const callSid = params['CallSid'] || '';

  // This is the callback after the Dial attempt finished
  if (dialCallStatus) {
    const missedStatuses = ['no-answer', 'failed', 'busy', 'canceled'];

    if (missedStatuses.includes(dialCallStatus)) {
      const friendlyCaller = callerNumber.replace(/^\+1/, '');
      const smsBody =
        `Missed call for ${BUSINESS_NAME} from ${friendlyCaller}. ` +
        `They tried reaching you but you didn't pick up. Call them back when you can.`;

      await sendSms(OWNER_PHONE_NUMBER, TWILIO_PHONE_NUMBER, smsBody);
    }

    return twimlResponse('');
  }

  // Initial incoming call — forward to owner's cell with 20s timeout
  const actionUrl = new URL(req.url).origin + '/functions/v1/handle-incoming-call';

  return twimlResponse(
    `  <Dial timeout="20" callerId="${TWILIO_PHONE_NUMBER}" action="${actionUrl}" method="POST">\n` +
    `    ${OWNER_PHONE_NUMBER}\n` +
    `  </Dial>`,
  );
});
