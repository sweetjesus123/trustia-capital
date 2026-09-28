import Link from 'next/link';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-[#090d16] px-6 py-5 text-gray-500">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p>© {currentYear} Trustia Capital. All rights reserved.</p>
        <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/terms" className="transition hover:text-amber-400">Terms</Link>
          <Link href="/privacy" className="transition hover:text-amber-400">Privacy</Link>
          <Link href="/disclosures" className="transition hover:text-amber-400">Risk Disclosures</Link>
        </nav>
      </div>
    </footer>
  );
}
