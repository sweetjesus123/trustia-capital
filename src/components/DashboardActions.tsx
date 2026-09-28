'use client';

import { useState } from 'react';
import { ArrowDownToLine, Calculator, DollarSign, TrendingUp } from 'lucide-react';
import InvestFundsModal from '@/components/InvestFundsModal';
import RequestLoanModal from '@/components/RequestLoanModal';
import WithdrawalRequestModal from '@/components/WithdrawalRequestModal';
import YieldCreditSimulatorModal from '@/components/YieldCreditSimulatorModal';

type DashboardActionsProps = {
  userId: string;
  userName: string;
  email: string;
  isVerified: boolean;
  portfolioValue: number;
  activeLoans: number;
};

export default function DashboardActions({
  userId,
  userName,
  email,
  isVerified,
  portfolioValue,
  activeLoans,
}: DashboardActionsProps) {
  const [activeModal, setActiveModal] = useState<'loan' | 'investment' | 'withdrawal' | 'simulator' | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveModal('loan')}
          className="flex items-center space-x-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black transition hover:bg-amber-400"
        >
          <DollarSign className="h-4 w-4" />
          <span>Request Loan</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveModal('investment')}
          className="flex items-center space-x-1.5 rounded-xl border border-gray-700 px-4 py-2.5 text-xs font-semibold text-gray-200 transition hover:border-amber-500/50 hover:text-white"
        >
          <TrendingUp className="h-4 w-4" />
          <span>Invest Funds</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveModal('withdrawal')}
          disabled={!isVerified}
          title={isVerified ? 'Request a withdrawal' : 'Withdrawals require a verified account'}
          className="flex items-center space-x-1.5 rounded-xl border border-gray-700 px-4 py-2.5 text-xs font-semibold text-gray-200 transition hover:border-amber-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-700 disabled:hover:text-gray-200"
        >
          <ArrowDownToLine className="h-4 w-4" />
          <span>Withdraw</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveModal('simulator')}
          disabled={!isVerified}
          title={isVerified ? 'Open return and borrowing scenario planner' : 'Scenario planning requires a verified account'}
          className="flex items-center space-x-1.5 rounded-xl border border-gray-700 px-4 py-2.5 text-xs font-semibold text-gray-200 transition hover:border-amber-500/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-gray-700 disabled:hover:text-gray-200"
        >
          <Calculator className="h-4 w-4" />
          <span>Simulate Return / Borrowing</span>
        </button>
      </div>

      <RequestLoanModal
        open={activeModal === 'loan'}
        onClose={() => setActiveModal(null)}
        userId={userId}
        userName={userName}
        email={email}
      />
      <InvestFundsModal
        open={activeModal === 'investment'}
        onClose={() => setActiveModal(null)}
        userId={userId}
        userName={userName}
        email={email}
      />
      <WithdrawalRequestModal
        open={isVerified && activeModal === 'withdrawal'}
        onClose={() => setActiveModal(null)}
      />
      <YieldCreditSimulatorModal
        open={isVerified && activeModal === 'simulator'}
        onClose={() => setActiveModal(null)}
        portfolioValue={portfolioValue}
        activeLoans={activeLoans}
      />
    </>
  );
}
