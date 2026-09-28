'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, LoaderCircle, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type InvestFundsModalProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  email: string;
};

const inputClassName =
  'mt-2 w-full rounded-lg border border-white/10 bg-[#0b1019] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10';

export default function InvestFundsModal({
  open,
  onClose,
  userId,
  userName,
  email,
}: InvestFundsModalProps) {
  const [strategy, setStrategy] = useState('growth_builder');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wire_transfer' | 'alternative_settlement'>('wire_transfer');
  const [supportNote, setSupportNote] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [requestSaved, setRequestSaved] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const numericAmount = Number(amount);
    try {
      if (!requestSaved) {
        const supabase = createClient();
        const { error: insertError } = await supabase.from('investment_orders').insert({
          user_id: userId,
          strategy,
          amount: numericAmount,
          payment_method: paymentMethod,
          status: 'pending_funding',
        });

        if (insertError) throw new Error(insertError.message);
        setRequestSaved(true);
      }

      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'investment',
          fullName: userName,
          email,
          amount: numericAmount,
          strategy,
          paymentMethod,
          notes: supportNote,
        }),
      });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const serverMessage =
          typeof result === 'object' && result !== null && 'error' in result &&
          typeof result.error === 'string'
            ? result.error
            : 'Private Client Support could not be notified.';
        throw new Error(serverMessage);
      }

      setIsComplete(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'We could not submit your investment request. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    onClose();
    setIsComplete(false);
    setErrorMessage('');
    setRequestSaved(false);
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="investment-modal-title"
        className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#101722] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Private Client Support</p>
            <h2 id="investment-modal-title" className="mt-2 text-2xl font-semibold text-white">
              {isComplete ? 'Request Received' : 'Invest Funds'}
            </h2>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close investment request" className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isComplete ? (
          <div role="status" className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
            <p className="mt-4 text-base font-medium text-white">
              Request Received — An advisor will provide transfer instructions within 1 business hour.
            </p>
            <button type="button" onClick={handleClose} className="mt-6 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-[#11100d] transition hover:bg-amber-400">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block text-sm font-medium text-gray-300">
              Investment strategy
              <select className={inputClassName} disabled={requestSaved} value={strategy} onChange={(event) => setStrategy(event.target.value)}>
                <option value="growth_builder">Growth Builder Tier</option>
                <option value="fixed_yield_vault">Fixed Yield Vault</option>
              </select>
            </label>

            <label className="block text-sm font-medium text-gray-300">
              Investment amount (USD)
              <input className={inputClassName} type="number" min="100" max="100000000" step="100" required disabled={requestSaved} value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="10,000" />
            </label>

            <fieldset>
              <legend className="text-sm font-medium text-gray-300">Settlement preference</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {(['wire_transfer', 'alternative_settlement'] as const).map((method) => (
                  <label key={method} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${paymentMethod === method ? 'border-amber-500/50 bg-amber-500/5 text-white' : 'border-white/10 text-gray-400'}`}>
                    <input type="radio" name="investment-payment-method" value={method} disabled={requestSaved} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="accent-amber-500" />
                    {method === 'wire_transfer' ? 'Wire Transfer' : 'Alternative Settlement'}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rounded-xl border border-white/10 bg-[#0b1019] p-4">
              <h3 className="text-sm font-semibold text-white">Funding clearance & support</h3>
              <p className="mt-1 text-xs leading-5 text-gray-400">
                Send a note directly to Private Client Support about funding clearance or wire instructions. An advisor will follow up using your account email.
              </p>
              <label className="mt-4 block text-sm font-medium text-gray-300">
                Contact email
                <input className={`${inputClassName} cursor-not-allowed opacity-70`} type="email" value={email} readOnly aria-readonly="true" />
              </label>
              <label className="mt-4 block text-sm font-medium text-gray-300">
                Message to Private Client Support <span className="font-normal text-gray-500">(optional)</span>
                <textarea className={`${inputClassName} resize-y`} rows={3} maxLength={5000} disabled={requestSaved} value={supportNote} onChange={(event) => setSupportNote(event.target.value)} placeholder="Ask about funding clearance or request wire instructions." />
              </label>
            </div>

            <p className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-3 text-xs leading-5 text-gray-400">
              Do not transfer funds until you receive verified instructions directly from Private Client Support.
            </p>

            {errorMessage && (
              <p role="alert" className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-300">
                {requestSaved ? `Your investment order was recorded, but support notification failed. ${errorMessage}` : errorMessage}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3.5 text-sm font-semibold text-[#11100d] transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60">
              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {isSubmitting ? 'Submitting request…' : requestSaved ? 'Retry support notification' : 'Submit investment request'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
