import nodemailer from 'nodemailer';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

const inquiryTypes = new Set([
  'wealth-management',
  'private-credit',
  'investment-strategy',
  'business-capital',
  'other',
]);

const capitalRanges = new Set([
  'under-250k',
  '250k-1m',
  '1m-5m',
  '5m-25m',
  'over-25m',
  'undetermined',
]);

type InquiryPayload = {
  fullName: string;
  email: string;
  inquiryType: string;
  capitalRange: string;
  message: string;
};

type ActionPayload = {
  requestType: 'loan' | 'investment';
  fullName: string;
  email: string;
  amount: number;
  paymentMethod: 'wire_transfer' | 'alternative_settlement';
  notes: string;
  term?: number;
  purpose?: string;
  strategy?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

function getPayload(value: unknown): InquiryPayload | null {
  if (!isRecord(value)) return null;

  const { fullName, email, inquiryType, capitalRange, message } = value;
  if (
    typeof fullName !== 'string' ||
    typeof email !== 'string' ||
    typeof inquiryType !== 'string' ||
    typeof capitalRange !== 'string' ||
    typeof message !== 'string'
  ) {
    return null;
  }

  const payload = {
    fullName: fullName.trim(),
    email: email.trim(),
    inquiryType,
    capitalRange,
    message: message.trim(),
  };

  if (
    payload.fullName.length < 2 ||
    payload.fullName.length > 120 ||
    payload.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email) ||
    !inquiryTypes.has(payload.inquiryType) ||
    !capitalRanges.has(payload.capitalRange) ||
    payload.message.length < 1 ||
    payload.message.length > 5000
  ) {
    return null;
  }

  return payload;
}

function getActionPayload(value: unknown): ActionPayload | null {
  if (!isRecord(value)) return null;

  const { requestType, fullName, email, amount, paymentMethod, notes } = value;
  if (
    (requestType !== 'loan' && requestType !== 'investment') ||
    typeof fullName !== 'string' ||
    typeof email !== 'string' ||
    typeof amount !== 'number' ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 100_000_000 ||
    (paymentMethod !== 'wire_transfer' && paymentMethod !== 'alternative_settlement') ||
    typeof notes !== 'string' ||
    notes.length > 5000 ||
    fullName.trim().length < 2 ||
    fullName.trim().length > 120 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return null;
  }

  if (requestType === 'loan') {
    if (
      typeof value.term !== 'number' ||
      ![12, 24, 36].includes(value.term) ||
      typeof value.purpose !== 'string' ||
      !['working_capital', 'asset_financing', 'other'].includes(value.purpose)
    ) {
      return null;
    }

    return {
      requestType,
      fullName: fullName.trim(),
      email: email.trim(),
      amount,
      paymentMethod,
      notes: notes.trim(),
      term: value.term,
      purpose: value.purpose,
    };
  }

  if (
    typeof value.strategy !== 'string' ||
    !['growth_builder', 'fixed_yield_vault'].includes(value.strategy)
  ) {
    return null;
  }

  return {
    requestType,
    fullName: fullName.trim(),
    email: email.trim(),
    amount,
    paymentMethod,
    notes: notes.trim(),
    strategy: value.strategy,
  };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  if (isRecord(body) && (body.requestType === 'loan' || body.requestType === 'investment')) {
    const action = getActionPayload(body);
    if (!action) {
      return Response.json({ error: 'Please provide valid request details.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !user.email) {
      return Response.json({ error: 'Please sign in before submitting this request.' }, { status: 401 });
    }
    if (user.email.toLowerCase() !== action.email.toLowerCase()) {
      return Response.json({ error: 'The request email must match your signed-in account.' }, { status: 403 });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } = process.env;
    const port = Number(SMTP_PORT);
    if (
      !SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL ||
      !Number.isInteger(port) || port < 1 || port > 65535
    ) {
      console.error('Support email is not configured: SMTP environment variables are missing or invalid.');
      return Response.json({ error: 'Support email is temporarily unavailable. Please contact support.' }, { status: 503 });
    }

    const fullName =
      typeof user.user_metadata.full_name === 'string'
        ? user.user_metadata.full_name
        : action.fullName;
    const details = [
      `Request: ${action.requestType === 'loan' ? 'Loan request' : 'Investment commitment'}`,
      `Client: ${fullName}`,
      `Email: ${user.email}`,
      `Amount: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(action.amount)}`,
      `Settlement preference: ${action.paymentMethod === 'wire_transfer' ? 'Wire Transfer' : 'Alternative Settlement'}`,
      ...(action.requestType === 'loan'
        ? [`Preferred term: ${action.term} months`, `Purpose: ${action.purpose}`]
        : [`Strategy: ${action.strategy}`]),
      `Notes / funding clearance request: ${action.notes || 'None provided'}`,
    ];
    const escapedDetails = details.map((line) => `<p>${escapeHtml(line)}</p>`).join('');
    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(user.email);
    const subjectName = fullName.replace(/[\r\n]+/g, ' ').slice(0, 120);

    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      });
      await transporter.sendMail({
        from: SMTP_USER,
        to: CONTACT_EMAIL,
        replyTo: user.email,
        subject: `Client ${action.requestType} request — ${subjectName}`,
        text: details.join('\n'),
        html: `<h2>Client ${action.requestType} request</h2><p><strong>Client:</strong> ${safeFullName}</p><p><strong>Email:</strong> ${safeEmail}</p>${escapedDetails}`,
      });
    } catch (error) {
      console.error('Failed to send client request email:', error);
      return Response.json({ error: 'Your request was recorded, but support notification failed. Please contact Private Client Support.' }, { status: 502 });
    }

    return Response.json({ message: 'Your request was sent to Private Client Support.' });
  }

  const inquiry = getPayload(body);
  if (!inquiry) {
    return Response.json(
      { error: 'Please provide valid values for all inquiry fields.' },
      { status: 400 },
    );
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } = process.env;
  const port = Number(SMTP_PORT);
  if (
    !SMTP_HOST ||
    !SMTP_USER ||
    !SMTP_PASS ||
    !CONTACT_EMAIL ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    console.error('Inquiry email is not configured: SMTP environment variables are missing or invalid.');
    return Response.json(
      { error: 'Inquiry email is temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const safeName = escapeHtml(inquiry.fullName);
  const safeEmail = escapeHtml(inquiry.email);
  const safeType = escapeHtml(inquiry.inquiryType);
  const safeRange = escapeHtml(inquiry.capitalRange);
  const safeMessage = escapeHtml(inquiry.message).replace(/\r?\n/g, '<br>');

  try {
    await transporter.sendMail({
      from: SMTP_USER,
      to: CONTACT_EMAIL,
      replyTo: inquiry.email,
      subject: `Website inquiry: ${inquiry.inquiryType}`,
      text: [
        `Name: ${inquiry.fullName}`,
        `Email: ${inquiry.email}`,
        `Inquiry type: ${inquiry.inquiryType}`,
        `Capital range: ${inquiry.capitalRange}`,
        '',
        'Message:',
        inquiry.message,
      ].join('\n'),
      html: `<h2>New website inquiry</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Inquiry type:</strong> ${safeType}</p>
        <p><strong>Capital range:</strong> ${safeRange}</p>
        <p><strong>Message:</strong><br>${safeMessage}</p>`,
    });
  } catch (error) {
    console.error('Failed to send inquiry email:', error);
    return Response.json(
      { error: 'We could not send your inquiry right now. Please try again shortly.' },
      { status: 502 },
    );
  }

  return Response.json({ message: 'Your inquiry has been sent successfully.' });
}
