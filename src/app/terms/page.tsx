import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Trustia Capital',
  description: 'Terms governing access to the Trustia Capital platform.',
};

const sectionClass = 'mt-8';
const headingClass = 'text-lg font-semibold text-white';
const paragraphClass = 'mt-3 text-sm leading-7 text-gray-400';

export default function TermsPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <Link href="/" className="text-xs font-medium text-amber-400 transition hover:text-amber-300">Trustia Capital</Link>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Legal</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Terms of Service</h1>
      <p className="mt-4 text-sm leading-6 text-gray-400">These terms describe access to and use of the Trustia Capital website and client platform. They are a general platform notice and should be reviewed and completed by qualified legal counsel before being relied on as a contract.</p>

      <section className={sectionClass}>
        <h2 className={headingClass}>1. Acceptance and eligibility</h2>
        <p className={paragraphClass}>By accessing the platform, you agree to use it lawfully and in accordance with these terms and any separate agreements that apply to your account. Some services or products may be restricted to qualified or otherwise eligible clients under applicable law. Creating an account or viewing platform content does not establish that you meet those requirements or that an application has been accepted.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>2. Platform information and services</h2>
        <p className={paragraphClass}>Descriptions, estimates, tools, rates, balances, and other displayed information are provided for general informational purposes and may be incomplete, indicative, delayed, or subject to correction. They are not an offer, commitment, recommendation, or guarantee. Any financial service is provided only under applicable executed agreements and after required review and approval. If displayed account information conflicts with an official account record or agreement, contact the firm through a verified channel.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>3. No professional advice</h2>
        <p className={paragraphClass}>Nothing on the platform is investment, legal, tax, accounting, or other professional advice. You are responsible for evaluating risks and obtaining independent advice appropriate to your circumstances. Past performance and illustrative simulations do not predict or guarantee future results.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>4. Account security and acceptable use</h2>
        <p className={paragraphClass}>You must provide accurate information, keep your authentication credentials confidential, and promptly report suspected unauthorized access. Do not attempt to disrupt, probe, reverse engineer, misuse, or gain unauthorized access to the platform, its data, or another account. We may restrict or suspend access where reasonably necessary for security, legal, or operational reasons.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>5. Requests and electronic communications</h2>
        <p className={paragraphClass}>Submitting a funding, investment, credit, withdrawal, or support request does not itself execute a transaction, confirm eligibility, or create an obligation to provide a service. Do not send passwords, authentication codes, or complete payment credentials through general inquiry forms or email. Verify payment and wire instructions using an independently confirmed contact method before acting.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>6. Availability and intellectual property</h2>
        <p className={paragraphClass}>The platform is provided subject to maintenance, availability, and technical limitations. To the extent permitted by law, we do not warrant uninterrupted or error-free operation. Website content and design are protected by applicable intellectual property laws; you may use the platform only for its intended personal or business purposes and may not reproduce protected content without authorization.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>7. Liability, changes, and contact</h2>
        <p className={paragraphClass}>Nothing in these terms excludes liability that cannot lawfully be excluded. Any limitations or remedies applicable to a specific financial service are governed by its executed agreement and applicable law. We may update these terms by posting a revised version. Continued use after an update means you acknowledge the revised terms to the extent permitted by law. For questions, contact support using the verified contact details associated with your account.</p>
      </section>

      <p className="mt-10 border-t border-white/10 pt-5 text-xs text-gray-500">Effective date: September 26, 2026. This page is general information and is not a substitute for a jurisdiction-specific agreement.</p>
    </main>
  );
}
