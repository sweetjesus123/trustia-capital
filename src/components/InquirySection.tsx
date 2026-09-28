'use client';

import { useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, LockKeyhole, Send } from 'lucide-react';

const fieldClassName =
  'mt-2 w-full rounded-lg border border-white/10 bg-[#0b1019] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/10';

export default function InquirySection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get('fullName') ?? ''),
      email: String(formData.get('email') ?? ''),
      inquiryType: String(formData.get('inquiryType') ?? ''),
      capitalRange: String(formData.get('capitalRange') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const serverError =
          typeof result === 'object' &&
          result !== null &&
          'error' in result &&
          typeof result.error === 'string'
            ? result.error
            : 'We could not send your inquiry right now. Please try again shortly.';
        throw new Error(serverError);
      }

      setIsSubmitted(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again shortly.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="inquiry"
      className="relative isolate overflow-hidden border-t border-white/5 bg-[#0b1019] px-6 py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_20%,rgba(217,165,75,0.09),transparent_40%)]"
      />

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="flex flex-col justify-center">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-9 bg-amber-500/70" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
              Private Advisory
            </span>
          </div>
          <h2 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            A considered conversation starts here.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-gray-400">
            Share a little about your objectives. Our advisory team will use your
            inquiry to understand the scope and direction of your request.
          </p>

          <div className="mt-10 flex items-start gap-4 border-t border-white/10 pt-6">
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 text-amber-400">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">A discreet first step</p>
              <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
                Please avoid including account credentials or other sensitive
                personal information in this form.
              </p>
            </div>
          </div>

          <a
            href="#services"
            className="mt-8 inline-flex w-fit items-center gap-2 text-sm font-medium text-amber-400 transition hover:text-amber-300"
          >
            Explore our capabilities
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#101722]/90 p-6 shadow-2xl shadow-black/20 sm:p-8">
          <div className="mb-7">
            <p className="text-sm font-medium text-white">Advisory inquiry</p>
            <p className="mt-1 text-xs leading-5 text-gray-500">
              Fields marked with <span className="text-amber-400">*</span> are required.
            </p>
          </div>

          {isSubmitted ? (
            <div role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold text-white">Inquiry sent</h3>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Thank you for reaching out. Our advisory team has received your inquiry and will follow up soon.
              </p>
              <button
                type="button"
                onClick={() => {
                  formRef.current?.reset();
                  setIsSubmitted(false);
                }}
                className="mt-5 text-sm font-medium text-amber-400 transition hover:text-amber-300"
              >
                Send another inquiry
              </button>
            </div>
          ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="inquiry-name" className="text-sm font-medium text-gray-300">
                  Full name <span className="text-amber-400">*</span>
                </label>
                <input
                  id="inquiry-name"
                  name="fullName"
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                  className={fieldClassName}
                />
              </div>
              <div>
                <label htmlFor="inquiry-email" className="text-sm font-medium text-gray-300">
                  Business email <span className="text-amber-400">*</span>
                </label>
                <input
                  id="inquiry-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@company.com"
                  className={fieldClassName}
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="inquiry-subject" className="text-sm font-medium text-gray-300">
                  Inquiry subject <span className="text-amber-400">*</span>
                </label>
                <select
                  id="inquiry-subject"
                  name="inquiryType"
                  required
                  defaultValue=""
                  className={`${fieldClassName} appearance-none`}
                >
                  <option value="" disabled>Select a topic</option>
                  <option value="wealth-management">Wealth management</option>
                  <option value="private-credit">Private credit</option>
                  <option value="investment-strategy">Investment strategy</option>
                  <option value="business-capital">Business capital</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="inquiry-scope" className="text-sm font-medium text-gray-300">
                  Estimated capital scope <span className="text-amber-400">*</span>
                </label>
                <select
                  id="inquiry-scope"
                  name="capitalRange"
                  required
                  defaultValue=""
                  className={`${fieldClassName} appearance-none`}
                >
                  <option value="" disabled>Select a range</option>
                  <option value="under-250k">Under $250,000</option>
                  <option value="250k-1m">$250,000 – $1 million</option>
                  <option value="1m-5m">$1 million – $5 million</option>
                  <option value="5m-25m">$5 million – $25 million</option>
                  <option value="over-25m">Over $25 million</option>
                  <option value="undetermined">To be determined</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="inquiry-message" className="text-sm font-medium text-gray-300">
                How can we assist? <span className="text-amber-400">*</span>
              </label>
              <textarea
                id="inquiry-message"
                name="message"
                required
                rows={5}
                placeholder="Briefly describe your objectives and preferred next steps."
                className={`${fieldClassName} resize-y`}
              />
            </div>

            {errorMessage && (
              <div role="alert" className="rounded-lg border border-rose-500/20 bg-rose-500/5 p-4 text-sm text-rose-300">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3.5 text-sm font-semibold text-[#11100d] transition hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-[#101722]"
            >
              {isSubmitting ? (
                'Sending inquiry…'
              ) : (
                <>
                  Submit private inquiry
                  <Send className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </button>
          </form>
          )}
        </div>
      </div>
    </section>
  );
}