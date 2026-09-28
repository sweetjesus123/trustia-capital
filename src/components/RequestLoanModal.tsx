'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, LoaderCircle, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type RequestLoanModalProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  email: string;
};

const inputClassName =
  'mt-2 w-full rounded-lg border border-white/10 bg-[#0b1019] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10';

export default function RequestLoanModal({
  open,
  onClose,
  userId,
  userName,
  email,
}: RequestLoanModalProps) {
  const [amount, setAmount] = useState('');
  const [term, setTerm] = useState('12');
  const [purpose, setPurpose] = useState('working_capital');
  const [paymentMethod, setPaymentMethod] = useState<'wire_transfer' | 'alternative_settlement'>('wire_transfer');
  const [notes, setNotes] = useState('');
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
        const { error: insertError } = await supabase.from('credit_requests').insert({
          user_id: userId,
          amount: numericAmount,
          term: Number(term),
          purpose,
          payment_method: paymentMethod,
          status: 'under_review',
        });

        if (insertError) throw new Error(insertError.message);
        setRequestSaved(true);
      }

      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType: 'loan',
          fullName: userName,
          email,
          amount: numericAmount,
          term: Number(term),
          purpose,
          paymentMethod,
          notes,
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
          : 'We could not submit your request. Please try again.',
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
        aria-labelledby="loan-modal-title"
        className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#101722] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Private Client Support</p>
            <h2 id="loan-modal-title" className="mt-2 text-2xl font-semibold text-white">
              {isComplete ? 'Request Received' : 'Request a Loan'}
            </h2>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close loan request" className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white">
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
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-gray-300">
                Loan amount (USD)
                <input className={inputClassName} type="number" min="500" max="100000000" step="100" required disabled={requestSaved} value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="25,000" />
              </label>
              <label className="text-sm font-medium text-gray-300">
                Preferred term
                <select className={inputClassName} disabled={requestSaved} value={term} onChange={(event) => setTerm(event.target.value)}>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                </select>
              </label>
            </div>

            <label className="block text-sm font-medium text-gray-300">
              Purpose
              <select className={inputClassName} disabled={requestSaved} value={purpose} onChange={(event) => setPurpose(event.target.value)}>
                <option value="working_capital">Working Capital</option>
                <option value="asset_financing">Asset Financing</option>
                <option value="other">Other</option>
              </select>
            </label>

            <fieldset>
              <legend className="text-sm font-medium text-gray-300">Payment / settlement preference</legend>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {(['wire_transfer', 'alternative_settlement'] as const).map((method) => (
                  <label key={method} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-sm ${paymentMethod === method ? 'border-amber-500/50 bg-amber-500/5 text-white' : 'border-white/10 text-gray-400'}`}>
                    <input type="radio" name="loan-payment-method" value={method} disabled={requestSaved} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="accent-amber-500" />
                    {method === 'wire_transfer' ? 'Wire Transfer' : 'Alternative Settlement'}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="block text-sm font-medium text-gray-300">
              Message / reference note <span className="font-normal text-gray-500">(optional)</span>
              <textarea className={`${inputClassName} resize-y`} rows={3} maxLength={5000} disabled={requestSaved} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Share any useful context for your advisor." />
            </label>

            <p className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-3 text-xs leading-5 text-gray-400">
              Funding instructions are issued directly through Private Client Support. Please do not send funds until your advisor has confirmed the approved instructions.
            </p>

            {errorMessage && (
              <p role="alert" className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-300">
                {requestSaved ? `Your request was recorded, but support notification failed. ${errorMessage}` : errorMessage}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3.5 text-sm font-semibold text-[#11100d] transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60">
              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {isSubmitting ? 'Submitting request…' : requestSaved ? 'Retry support notification' : 'Submit loan request'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
