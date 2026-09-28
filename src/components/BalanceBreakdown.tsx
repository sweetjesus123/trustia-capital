'use client';

import { useState } from 'react';
import { CircleHelp, X } from 'lucide-react';

type BalanceBreakdownProps = {
  portfolioValue: number;
  settledLiquidity: number;
  encumberedCollateral: number;
  accruedYield: number;
};

export default function BalanceBreakdown({
  portfolioValue,
  settledLiquidity,
  encumberedCollateral,
  accruedYield,
}: BalanceBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 text-xs font-medium text-amber-400 transition hover:text-amber-300">
        <CircleHelp className="h-4 w-4" aria-hidden="true" />
        Balance breakdown
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="balance-modal-title" className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101722] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Dual-ledger detail</p>
                <h2 id="balance-modal-title" className="mt-2 text-xl font-semibold text-white">Available vs. locked funds</h2>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close balance breakdown" className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><dt className="text-gray-400">Settled liquidity (available)</dt><dd className="text-right text-gray-300">{formatCurrency(settledLiquidity)}</dd></div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><dt className="text-gray-400">Encumbered collateral (locked)</dt><dd className="text-right text-gray-300">{formatCurrency(encumberedCollateral)}</dd></div>
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3"><dt className="text-gray-400">Accrued yield</dt><dd className="text-right text-gray-300">{formatCurrency(accruedYield)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="font-medium text-white">Current aggregate portfolio value</dt><dd className="text-right font-semibold text-white">{formatCurrency(portfolioValue)}</dd></div>
            </dl>
            <p className="mt-5 text-xs leading-5 text-gray-500">
              Empty or newly created account ledger balances default to $0.00. The aggregate portfolio value is read from the portfolio record.
            </p>
            <button type="button" onClick={() => setIsOpen(false)} className="mt-6 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-[#11100d] transition hover:bg-amber-400">Close</button>
          </section>
        </div>
      )}
    </>
  );
}
