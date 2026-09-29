import Link from 'next/link';
import { Mail, UserRound } from 'lucide-react';

export default function RelationshipManagerCard() {
  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-400">
        <UserRound className="h-4 w-4" aria-hidden="true" />
        Private relationship manager
      </div>
      <div className="mt-5 flex items-center gap-4">
        <div aria-hidden="true" className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-lg font-bold text-amber-300">AW</div>
        <div>
          <p className="font-semibold text-white">Alistair Sterling</p>
          <p className="mt-1 text-sm text-gray-400">Senior Managing Director, Private Wealth</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-gray-400">
        Contact your relationship manager directly by secure email or request verified wire instructions.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="mailto:a.wright@trustiacapital.com" className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-xs font-semibold text-[#11100d] transition hover:bg-amber-400">
          <Mail className="h-4 w-4" aria-hidden="true" />
          Email Alexander
        </Link>
        <Link href="mailto:a.wright@trustiacapital.com?subject=Request%20for%20Wire%20Instructions" className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-4 py-2.5 text-xs font-semibold text-gray-200 transition hover:border-amber-500/50 hover:text-white">
          <Mail className="h-4 w-4" aria-hidden="true" />
          Request Wire Instructions
        </Link>
      </div>
    </section>
  );
}
