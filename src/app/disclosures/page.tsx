import Link from 'next/link';

export const metadata = {
  title: 'Risk Disclosures | Trustia Capital',
  description: 'Important risk information for Trustia Capital platform users and qualified clients.',
};

const sectionClass = 'mt-8';
const headingClass = 'text-lg font-semibold text-white';
const paragraphClass = 'mt-3 text-sm leading-7 text-gray-400';

export default function DisclosuresPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <Link href="/" className="text-xs font-medium text-amber-400 transition hover:text-amber-300">Trustia Capital</Link>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">Important information</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">Risk Disclosures</h1>
      <p className="mt-4 text-sm leading-6 text-gray-400">Please consider these general risk disclosures before using platform tools or requesting a financial service. This page does not describe every risk or replace product documentation, offering materials, or an executed client agreement.</p>

      <section className={sectionClass}>
        <h2 className={headingClass}>Investment risk and loss of principal</h2>
        <p className={paragraphClass}>Investments involve risk, including possible loss of some or all invested principal. Values may rise or fall, liquidity may be limited, and an investment may not be suitable for every client. Diversification, collateral, or historical results do not eliminate risk or assure a profit.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Past performance and projections</h2>
        <p className={paragraphClass}>Past performance is not indicative of future results. Historical, target, estimated, simulated, or illustrative yields and returns are not guarantees and may not reflect fees, expenses, taxes, market conditions, or individual circumstances. Actual results may differ materially and could be negative.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Credit, leverage, and collateral</h2>
        <p className={paragraphClass}>Borrowing and leverage can magnify gains and losses, increase costs, and create repayment or collateral obligations. Collateral values can decline; additional collateral, repayment, or liquidation may be required under applicable terms. A simulator or displayed estimate is not a credit approval, committed facility, or representation that funds are immediately available.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Liquidity, settlement, and operational risk</h2>
        <p className={paragraphClass}>Withdrawals, transfers, and redemptions may be delayed, restricted, subject to review, or unavailable under certain conditions. Payment instructions and settlement processes are subject to verification and applicable agreements. Cybersecurity events, technology interruptions, third-party service failures, fraud, and operational errors may affect access to information or services.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Custody and proof of reserves</h2>
        <p className={paragraphClass}>Any custody arrangement, asset segregation, insurance, audit, or proof-of-reserves representation must be confirmed through authoritative documentation applicable to the relevant product and account. A badge, interface label, or platform display alone does not constitute an independent audit, guarantee, or verification of assets or liabilities.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Qualified clients and availability</h2>
        <p className={paragraphClass}>Services are intended only for qualified clients who meet the eligibility requirements that apply to the specific service and jurisdiction. Access to the website or an account does not establish eligibility. Products and services may not be available in every location and may be subject to additional disclosures, suitability review, onboarding, and executed agreements.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={headingClass}>Independent advice</h2>
        <p className={paragraphClass}>Platform information is not investment, legal, tax, or accounting advice, and does not account for your objectives or financial circumstances. Consider obtaining independent professional advice and review all official offering and contractual materials before making a decision.</p>
      </section>

      <p className="mt-10 border-t border-white/10 pt-5 text-xs text-gray-500">Effective date: September 26, 2026. Product-specific disclosures and applicable agreements control in the event of any inconsistency.</p>
    </main>
  );
}
