import { Resend } from 'resend';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getPayload(value: unknown): ContactPayload | null {
  if (!isRecord(value)) return null;

  const { name, email, subject, message } = value;
  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof subject !== 'string' ||
    typeof message !== 'string'
  ) {
    return null;
  }

  const payload = {
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
  };

  if (
    payload.name.length < 2 ||
    payload.name.length > 120 ||
    payload.email.length > 254 ||
    !emailPattern.test(payload.email) ||
    payload.subject.length < 2 ||
    payload.subject.length > 200 ||
    /[\r\n\u0000-\u001f\u007f]/.test(payload.subject) ||
    payload.message.length < 1 ||
    payload.message.length > 5000
  ) {
    return null;
  }

  return payload;
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

  const payload = getPayload(body);
  if (!payload) {
    return Response.json(
      { error: 'Please provide a valid name, email, subject, and message.' },
      { status: 400 },
    );
  }

  const { RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_EMAIL } = process.env;
  if (!RESEND_API_KEY || !RESEND_FROM_EMAIL || !CONTACT_EMAIL) {
    console.error('Contact email is not configured: Resend and contact address environment variables are required.');
    return Response.json(
      { error: 'The contact service is temporarily unavailable. Please try again later.' },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: RESEND_FROM_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: payload.email,
      subject: payload.subject,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        `Subject: ${payload.subject}`,
        '',
        payload.message,
      ].join('\n'),
      html: `<h2>New contact message</h2><p><strong>Name:</strong> ${escapeHtml(payload.name)}</p><p><strong>Email:</strong> ${escapeHtml(payload.email)}</p><p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p><p><strong>Message:</strong><br>${escapeHtml(payload.message).replace(/\r?\n/g, '<br>')}</p>`,
    });

    if (error) {
      console.error('Resend could not send the contact email:', error.message);
      return Response.json(
        { error: 'We could not send your message. Please try again later.' },
        { status: 502 },
      );
    }

    return Response.json({ message: 'Your message was sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error(
      'Contact email delivery failed:',
      error instanceof Error ? error.message : 'Unknown email delivery error.',
    );
    return Response.json(
      { error: 'We could not send your message. Please try again later.' },
      { status: 502 },
    );
  }
}
