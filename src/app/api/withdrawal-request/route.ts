import { Resend } from 'resend';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
  const accountingRecipient = process.env.ACCOUNTING_RECIPIENT_EMAIL || process.env.INQUIRY_RECIPIENT_EMAIL;

  if (!apiKey || !accountingRecipient) {
    console.error('Email service is not configured: Resend API key or accounting recipient is missing.');
    return Response.json({ error: 'Support email is temporarily unavailable. Please contact support.' }, { status: 503 });
  }

  if (
    !isRecord(body) ||
    typeof body.amount !== 'number' ||
    !Number.isFinite(body.amount) ||
    body.amount <= 0 ||
    body.amount > 100_000_000 ||
    typeof body.notes !== 'string' ||
    body.notes.length > 2000
  ) {
    return Response.json({ error: 'Please provide a valid amount and note.' }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) {
    return Response.json({ error: 'Please sign in before submitting a withdrawal request.' }, { status: 401 });
  }

  const { data: portfolio, error: portfolioError } = await supabase
    .from('portfolios')
    .select('account_status')
    .eq('id', user.id)
    .maybeSingle();
  if (portfolioError) {
    console.error('Could not verify account status for withdrawal request:', portfolioError);
    return Response.json({ error: 'We could not verify your account. Please try again later.' }, { status: 503 });
  }

  if (portfolio?.account_status !== 'verified') {
    return Response.json({ error: 'A verified account is required to request a withdrawal.' }, { status: 403 });
  }

  const fullName =
    typeof user.user_metadata.full_name === 'string'
      ? user.user_metadata.full_name
      : 'Client';
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(body.amount);
  const notes = body.notes.trim() || 'None provided';
  const details = [
    'Request: Withdrawal request (advisor review required; no transfer initiated)',
    `Client: ${fullName}`,
    `Email: ${user.email}`,
    `Requested amount: ${formattedAmount}`,
    `Notes: ${notes}`,
  ];
  const subjectName = fullName.replace(/[\r\n]+/g, ' ').slice(0, 120);
  const escapedDetails = details.map((line) => `<p>${escapeHtml(line)}</p>`).join('');
  const safeFullName = escapeHtml(fullName);
  const safeEmail = escapeHtml(user.email);

  try {
    await resend.emails.send({
      from: fromEmail,
      to: accountingRecipient,
      replyTo: user.email,
      subject: `Client withdrawal request — ${subjectName}`,
      text: details.join('\n'),
      html: `<h2>Client withdrawal request</h2><p><strong>Client:</strong> ${safeFullName}</p><p><strong>Email:</strong> ${safeEmail}</p>${escapedDetails}`,
    });
  } catch (error) {
    console.error('Failed to send withdrawal request email via Resend:', error);
    return Response.json({ error: 'We could not notify support. Please try again later.' }, { status: 502 });
  }

  return Response.json({ message: 'Your request was sent to Private Client Accounting.' });
}