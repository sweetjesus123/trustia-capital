import nodemailer from 'nodemailer';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

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

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } = process.env;
  const port = Number(SMTP_PORT);
  if (
    !SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_EMAIL ||
    !Number.isInteger(port) || port < 1 || port > 65535
  ) {
    console.error('Withdrawal support email is not configured: SMTP environment variables are missing or invalid.');
    return Response.json({ error: 'Support email is temporarily unavailable. Please contact support.' }, { status: 503 });
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
      subject: `Client withdrawal request — ${subjectName}`,
      text: details.join('\n'),
      html: `<h2>Client withdrawal request</h2>${escapedDetails}`,
    });
  } catch (error) {
    console.error('Failed to send withdrawal request email:', error);
    return Response.json({ error: 'We could not notify support. Please try again later.' }, { status: 502 });
  }

  return Response.json({ message: 'Your request was sent to Private Client Support.' });
}
