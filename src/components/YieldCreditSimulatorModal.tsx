'use client';

import { useMemo, useState } from 'react';
import { Calculator, X } from 'lucide-react';

type YieldCreditSimulatorModalProps = {
  open: boolean;
  onClose: () => void;
  portfolioValue: number;
  activeLoans: number;
};

export default function YieldCreditSimulatorModal({
  open,
  onClose,
  portfolioValue,
  activeLoans,
}: YieldCreditSimulatorModalProps) {
  const maxDeposit = Math.max(1_000, Math.min(Math.round(portfolioValue || 1_000), 1_000_000));
  const [deposit, setDeposit] = useState(Math.min(10_000, maxDeposit));
  const [termMonths, setTermMonths] = useState(12);
  const [assumedAnnualYield, setAssumedAnnualYield] = useState(5);
  const [assumedAdvanceRate, setAssumedAdvanceRate] = useState(50);

  const projections = useMemo(() => {
    const projectedValue = deposit * Math.pow(1 + assumedAnnualYield / 100 / 12, termMonths);
    const projectedYield = projectedValue - deposit;
    const scenarioCredit = Math.max(0, portfolioValue * assumedAdvanceRate / 100 - activeLoans);
    return { projectedYield, scenarioCredit };
  }, [deposit, assumedAnnualYield, termMonths, portfolioValue, assumedAdvanceRate, activeLoans]);

  if (!open) return null;

  const currency = (amount: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="simulator-modal-title" className="my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#101722] p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-400"><Calculator className="h-4 w-4" aria-hidden="true" /> Scenario planner</p>
            <h2 id="simulator-modal-title" className="mt-2 text-2xl font-semibold text-white">Simulate Return / Borrowing</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close simulator" className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="mt-7 grid gap-7 md:grid-cols-2">
          <div className="space-y-6">
            <label className="block text-sm text-gray-300">
              Illustrative deposit amount <span className="float-right font-semibold text-amber-400">{currency(deposit)}</span>
              <input type="range" min="1000" max={maxDeposit} step="500" value={deposit} onChange={(event) => setDeposit(Number(event.target.value))} className="mt-3 w-full accent-amber-500" />
            </label>
            <label className="block text-sm text-gray-300">
              Term <span className="float-right font-semibold text-amber-400">{termMonths} months</span>
              <input type="range" min="3" max="60" step="3" value={termMonths} onChange={(event) => setTermMonths(Number(event.target.value))} className="mt-3 w-full accent-amber-500" />
            </label>
            <label className="block text-sm text-gray-300">
              Assumed annual yield <span className="float-right font-semibold text-amber-400">{assumedAnnualYield}%</span>
              <input type="range" min="1" max="15" step="0.5" value={assumedAnnualYield} onChange={(event) => setAssumedAnnualYield(Number(event.target.value))} className="mt-3 w-full accent-amber-500" />
            </label>
            <label className="block text-sm text-gray-300">
              Illustrative advance rate <span className="float-right font-semibold text-amber-400">{assumedAdvanceRate}%</span>
              <input type="range" min="0" max="70" step="5" value={assumedAdvanceRate} onChange={(event) => setAssumedAdvanceRate(Number(event.target.value))} className="mt-3 w-full accent-amber-500" />
            </label>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="text-xs text-gray-400">Illustrative compounded yield</p>
              <p className="mt-2 text-3xl font-bold text-emerald-300">{currency(projections.projectedYield)}</p>
              <p className="mt-2 text-xs text-gray-500">Estimated earnings over {termMonths} months, before fees and taxes.</p>
            </div>
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
              <p className="text-xs text-gray-400">Illustrative borrowing scenario</p>
              <p className="mt-2 text-3xl font-bold text-blue-300">{currency(projections.scenarioCredit)}</p>
              <p className="mt-2 text-xs text-gray-500">Scenario only, calculated from aggregate value less active loans. Not an approved or instantly available credit line.</p>
            </div>
          </div>
        </div>

        <p className="mt-6 rounded-lg border border-amber-500/15 bg-amber-500/5 p-3 text-xs leading-5 text-gray-400">
          For illustration only. The assumed yield and advance rate are editable scenario inputs, not Trustia rates, a return promise, a credit offer, or confirmation of eligibility. Actual terms require independent review and approval.
        </p>
        <button type="button" onClick={onClose} className="mt-5 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-[#11100d] transition hover:bg-amber-400">Close simulator</button>
      </section>
    </div>
  );
}
