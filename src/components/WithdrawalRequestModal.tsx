'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, LoaderCircle, X } from 'lucide-react';

type WithdrawalRequestModalProps = {
  open: boolean;
  onClose: () => void;
};

const inputClassName =
  'mt-2 w-full rounded-lg border border-white/10 bg-[#0b1019] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10';

export default function WithdrawalRequestModal({ open, onClose }: WithdrawalRequestModalProps) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/withdrawal-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(amount), notes }),
      });
      const result: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const serverMessage =
          typeof result === 'object' && result !== null && 'error' in result &&
          typeof result.error === 'string'
            ? result.error
            : 'We could not submit your withdrawal request. Please try again.';
        throw new Error(serverMessage);
      }

      setIsComplete(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'We could not submit your withdrawal request. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    onClose();
    setAmount('');
    setNotes('');
    setErrorMessage('');
    setIsComplete(false);
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
        aria-labelledby="withdrawal-modal-title"
        className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#101722] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Private Client Support</p>
            <h2 id="withdrawal-modal-title" className="mt-2 text-2xl font-semibold text-white">
              {isComplete ? 'Request Received' : 'Request a Withdrawal'}
            </h2>
          </div>
          <button type="button" onClick={handleClose} disabled={isSubmitting} aria-label="Close withdrawal request" className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white disabled:opacity-60">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isComplete ? (
          <div role="status" className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
            <p className="mt-4 text-base font-medium text-white">
              Your request was sent to Private Client Support. An advisor will follow up with next steps.
            </p>
            <button type="button" onClick={handleClose} className="mt-6 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-[#11100d] transition hover:bg-amber-400">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <label className="block text-sm font-medium text-gray-300">
              Requested amount (USD)
              <input
                className={inputClassName}
                type="number"
                min="1"
                max="100000000"
                step="0.01"
                required
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="5,000"
              />
            </label>

            <label className="block text-sm font-medium text-gray-300">
              Note to your advisor <span className="font-normal text-gray-500">(optional)</span>
              <textarea
                className={`${inputClassName} resize-y`}
                rows={4}
                maxLength={2000}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Share any context for your withdrawal request. Do not include account credentials or full payment details."
              />
            </label>

            <p className="rounded-lg border border-amber-500/15 bg-amber-500/5 p-3 text-xs leading-5 text-gray-400">
              This submits a request for advisor review; it does not initiate a funds transfer. Support will confirm any required details through a verified channel.
            </p>

            {errorMessage && (
              <p role="alert" className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-3 text-sm text-rose-300">
                {errorMessage}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3.5 text-sm font-semibold text-[#11100d] transition hover:bg-amber-400 disabled:cursor-wait disabled:opacity-60">
              {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {isSubmitting ? 'Submitting request…' : 'Submit withdrawal request'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
