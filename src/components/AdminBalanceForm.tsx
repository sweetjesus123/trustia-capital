'use client';

import { useState, type FormEvent } from 'react';
import { Search, Save } from 'lucide-react';

type BalanceField =
  | 'portfolioValue'
  | 'yieldInvestments'
  | 'activeLoans'
  | 'availableFunds'
  | 'lockedFunds'
  | 'realizedYield';

type Balances = Record<BalanceField, number>;

const fields: { value: BalanceField; label: string }[] = [
  { value: 'portfolioValue', label: 'Portfolio Value' },
  { value: 'yieldInvestments', label: 'Yield Investments' },
  { value: 'activeLoans', label: 'Active Loans' },
  { value: 'availableFunds', label: 'Available Funds' },
  { value: 'lockedFunds', label: 'Locked Funds' },
  { value: 'realizedYield', label: 'Realized / Accrued' },
];

const emptyBalanceInputs: Record<BalanceField, string> = {
  portfolioValue: '',
  yieldInvestments: '',
  activeLoans: '',
  availableFunds: '',
  lockedFunds: '',
  realizedYield: '',
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

async function readResponse(response: Response) {
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof result === 'object' && result !== null && 'error' in result &&
      typeof result.error === 'string'
        ? result.error
        : 'The request could not be completed.';
    throw new Error(message);
  }
  return result;
}

export default function AdminBalanceForm() {
  const [email, setEmail] = useState('');
  const [foundEmail, setFoundEmail] = useState('');
  const [balances, setBalances] = useState<Balances | null>(null);
  const [balanceInputs, setBalanceInputs] = useState<Record<BalanceField, string>>(emptyBalanceInputs);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  async function handleLookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setBalances(null);
    setIsBusy(true);

    try {
      const response = await fetch('/api/admin/update-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'lookup', email }),
      });
      const result = await readResponse(response);
      if (
        typeof result !== 'object' || result === null || !('balances' in result) ||
        typeof result.balances !== 'object' || result.balances === null || !('email' in result) ||
        typeof result.email !== 'string'
      ) {
        throw new Error('The server returned an invalid portfolio response.');
      }

      setFoundEmail(result.email);
      const nextBalances = result.balances as Balances;
      setBalances(nextBalances);
      setBalanceInputs(Object.fromEntries(
        fields.map(({ value }) => [value, String(nextBalances[value])]),
      ) as Record<BalanceField, string>);
    } catch (error) {
      setFoundEmail('');
      setErrorMessage(error instanceof Error ? error.message : 'Client lookup failed.');
    } finally {
      setIsBusy(false);
    }
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!balances || !foundEmail) return;

    const submittedBalances = {} as Balances;
    for (const { value, label } of fields) {
      const rawAmount = balanceInputs[value].trim();
      const numericAmount = Number.parseFloat(rawAmount);
      if (
        !Number.isFinite(numericAmount) ||
        numericAmount < 0 ||
        numericAmount > 1_000_000_000_000 ||
        Math.round(numericAmount * 100) / 100 !== numericAmount
      ) {
        setErrorMessage(`Enter a valid non-negative dollar amount for ${label}.`);
        return;
      }
      submittedBalances[value] = numericAmount;
    }

    if (!fields.every(({ value }) => Number.isFinite(submittedBalances[value]))) {
      setErrorMessage('Enter valid dollar amounts for all six balances.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsBusy(true);
    try {
      const response = await fetch('/api/admin/update-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          email: foundEmail,
          balances: {
            portfolio_value: submittedBalances.portfolioValue,
            yield_investments: submittedBalances.yieldInvestments,
            active_loans: submittedBalances.activeLoans,
            available_funds: submittedBalances.availableFunds,
            locked_funds: submittedBalances.lockedFunds,
            realized_yield: submittedBalances.realizedYield,
          },
        }),
      });
      const result = await readResponse(response);
      if (
        typeof result !== 'object' || result === null || !('balances' in result) ||
        typeof result.balances !== 'object' || result.balances === null
      ) {
        throw new Error('The server returned an invalid update response.');
      }

      setBalances(result.balances as Balances);
      setBalanceInputs(Object.fromEntries(
        fields.map(({ value }) => [value, String((result.balances as Balances)[value])]),
      ) as Record<BalanceField, string>);
      setSuccessMessage('Portfolio balance updated successfully.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Balance update failed.');
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">
      <form onSubmit={handleLookup} className="space-y-3">
        <label htmlFor="client-email" className="block text-sm font-semibold text-gray-200">Client email</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="client-email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="client@example.com"
            className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-[#0b1019] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10"
          />
          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-[#11100d] transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {isBusy ? 'Looking up…' : 'Look up client'}
          </button>
        </div>
      </form>

      {balances && (
        <div className="mt-8 border-t border-gray-800 pt-6">
          <h2 className="text-lg font-semibold text-white">Balances for {foundEmail}</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-800 bg-[#0b1019] p-4">
              <dt className="text-xs text-gray-400">Portfolio Value</dt>
              <dd className="mt-2 text-lg font-semibold text-white">{formatCurrency(balances.portfolioValue)}</dd>
            </div>
            <div className="rounded-xl border border-gray-800 bg-[#0b1019] p-4">
              <dt className="text-xs text-gray-400">Yield Investments</dt>
              <dd className="mt-2 text-lg font-semibold text-white">{formatCurrency(balances.yieldInvestments)}</dd>
            </div>
            <div className="rounded-xl border border-gray-800 bg-[#0b1019] p-4">
              <dt className="text-xs text-gray-400">Active Loans</dt>
              <dd className="mt-2 text-lg font-semibold text-white">{formatCurrency(balances.activeLoans)}</dd>
            </div>
            <div className="rounded-xl border border-gray-800 bg-[#0b1019] p-4">
              <dt className="text-xs text-gray-400">Available Funds</dt>
              <dd className="mt-2 text-lg font-semibold text-white">{formatCurrency(balances.availableFunds)}</dd>
            </div>
            <div className="rounded-xl border border-gray-800 bg-[#0b1019] p-4">
              <dt className="text-xs text-gray-400">Locked Funds</dt>
              <dd className="mt-2 text-lg font-semibold text-white">{formatCurrency(balances.lockedFunds)}</dd>
            </div>
            <div className="rounded-xl border border-gray-800 bg-[#0b1019] p-4">
              <dt className="text-xs text-gray-400">Realized / Accrued</dt>
              <dd className="mt-2 text-lg font-semibold text-white">{formatCurrency(balances.realizedYield)}</dd>
            </div>
          </dl>

          <form onSubmit={handleUpdate} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fields.map(({ value, label }) => (
              <label key={value} className="block text-sm font-medium text-gray-300">
                {label} (USD)
                <input
                  type="number"
                  min="0"
                  max="1000000000000"
                  step="0.01"
                  value={balanceInputs[value]}
                  onChange={(event) => setBalanceInputs((current) => ({
                    ...current,
                    [value]: event.target.value,
                  }))}
                  className="mt-2 w-full rounded-lg border border-gray-700 bg-[#0b1019] px-4 py-3 text-sm text-white outline-none focus:border-amber-500/60"
                />
              </label>
            ))}
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/40 px-5 py-3 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/10 disabled:cursor-wait disabled:opacity-60"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                {isBusy ? 'Saving…' : 'Update all balances'}
              </button>
            </div>
          </form>
        </div>
      )}

      {errorMessage && <p role="alert" className="mt-5 rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-300">{errorMessage}</p>}
      {successMessage && <p role="status" className="mt-5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-300">{successMessage}</p>}
    </section>
  );
}