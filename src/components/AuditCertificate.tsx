'use client';

import { useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function AuditCertificate() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="flex flex-col gap-4 rounded-2xl border border-gray-800 bg-gray-900 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-amber-400">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Institutional Custody &amp; Audit</h2>
            <div className="mt-2 grid gap-1 text-xs text-gray-400 sm:grid-cols-2 sm:gap-x-6">
              <p><span className="text-gray-300">Custody:</span> Provider details not verified</p>
              <p><span className="text-gray-300">Proof of Reserves:</span> No audit feed connected</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-fit rounded-lg border border-gray-700 px-4 py-2 text-xs font-semibold text-gray-200 transition hover:border-amber-500/50 hover:text-white"
        >
          View Audit Certificate
        </button>
      </section>

      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="audit-modal-title" className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101722] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Audit documentation</p>
                <h2 id="audit-modal-title" className="mt-2 text-xl font-semibold text-white">Certificate unavailable</h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close audit details" className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-5 text-sm leading-6 text-gray-400">
              No custody attestation or proof-of-reserves certificate is connected to this account. Verification status will appear here when an authoritative audit document and its source are configured.
            </p>
            <button type="button" onClick={() => setIsOpen(false)} className="mt-6 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-[#11100d] transition hover:bg-amber-400">
              Close
            </button>
          </section>
        </div>
      )}
    </>
  );
}
