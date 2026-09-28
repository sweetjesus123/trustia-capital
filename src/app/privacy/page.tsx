import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Trustia Capital',
  description: 'How Trustia Capital handles personal information, cookies, and secure communications.',
};

const sectionClass = 'mt-8';
const headingClass = 'text-lg font-semibold text-white';
const paragraphClass = 'mt-3 text-sm leading-7 text-gray-400';

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <Link href="/" className="text-xs font-medium text-amber-400 transition hover:text-amber-300">Trustia Capital</Link>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Legal</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Privacy Policy</h1>
      <p className="mt-4 text-sm leading-6 text-gray-400">This policy summarizes how information may be handled when you use the Trustia Capital website and client platform. The final policy should be reviewed by counsel and tailored to the entity, jurisdictions, vendors, and retention practices actually in use.</p>

      <section className={sectionClass}>
        <h2 className={headingClass}>Information we receive</h2>
        <p className={paragraphClass}>Depending on how you use the platform, information may include account identifiers and authentication data, contact details and profile information you provide, inquiry and service-request content, and account or portfolio information associated with your authenticated session. Technical data such as browser, device, diagnostic, and security event information may also be processed to operate and protect the service.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>How information is used</h2>
        <p className={paragraphClass}>Information may be used to authenticate users, provide and maintain requested platform features, respond to client requests, communicate service or security information, troubleshoot issues, prevent misuse, and meet applicable legal obligations. We do not state that every listed purpose or processing activity is currently enabled; actual practices depend on the configured service and applicable notices or agreements.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Cookies and similar technologies</h2>
        <p className={paragraphClass}>The platform may use essential cookies or similar storage to maintain authentication sessions, support security, and preserve service functionality. Disabling these technologies may prevent sign-in or other features from working. If analytics or optional tracking technologies are introduced, the relevant consent and notice requirements should be addressed before deployment.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Service providers and disclosure</h2>
        <p className={paragraphClass}>Platform information may be processed by service providers supporting hosting, authentication, database, email delivery, security, or operations, and may be disclosed when required by law or necessary to protect rights and safety. The specific providers, processing locations, safeguards, and retention periods should be documented in the final production privacy notice and applicable vendor agreements.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Security and retention</h2>
        <p className={paragraphClass}>Reasonable technical and organizational safeguards should be applied to information handled through the platform. No internet transmission or storage method can be guaranteed to be completely secure. Information should be retained only for as long as needed for its documented purpose, legal obligations, dispute resolution, and legitimate operational requirements, subject to applicable law.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Secure messaging</h2>
        <p className={paragraphClass}>Use the authenticated platform or contact details independently verified through an official channel when communicating about your account. General forms and email may not be appropriate for sensitive information. Never send passwords, one-time codes, private keys, or full payment-card or bank credentials in a message. Confirm wire instructions through a known and trusted channel before initiating a transfer.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Your choices and contact</h2>
        <p className={paragraphClass}>Depending on your location, you may have rights to access, correct, delete, restrict, or receive certain personal information, or to object to particular processing. Rights and exceptions vary. Contact support through verified account channels to make a request or ask a privacy question. We may need to verify your identity before responding.</p>
      </section>

      <p className="mt-10 border-t border-white/10 pt-5 text-xs text-gray-500">Effective date: September 26, 2026. This summary must be aligned with actual data flows and applicable privacy laws.</p>
    </main>
  );
}
