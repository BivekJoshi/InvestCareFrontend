'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2, Send } from 'lucide-react';

import { contact } from '@/data/company';
import { apiFetch } from '@/lib/api';
import { EASE } from '@/lib/motion';

const INTERESTS = [
  'Promoter capital participation',
  'Business profile & documents',
  'Portfolio / partnership enquiry',
  'General enquiry',
];

const EMPTY = { name: '', email: '', phone: '', interest: INTERESTS[0], message: '' };

/**
 * Enquiry form.
 *
 * Submits to the CMS, where the message lands in the Enquiries inbox. If the
 * API cannot be reached the visitor is not left stranded — the enquiry is
 * handed to their own mail client instead, so a message is never lost to a
 * backend outage.
 */
export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [viaEmail, setViaEmail] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const openMailClient = () => {
    const subject = `[Website enquiry] ${form.interest} — ${form.name}`;
    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || '—'}`,
      `Interest: ${form.interest}`,
      '',
      form.message,
    ].join('\n');

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSending(true);

    try {
      await apiFetch('/public/enquiries', {
        method: 'POST',
        auth: false,
        body: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.interest,
          message: form.message,
        },
      });

      setSent(true);
    } catch (err) {
      // A validation error is the visitor's to fix; anything else is ours, and
      // falling back to email is better than asking them to try again later.
      if (/check the form|required|valid email/i.test(err.message)) {
        setError(err.message);
      } else {
        openMailClient();
        setViaEmail(true);
        setSent(true);
      }
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        className="flex h-full flex-col items-center justify-center rounded-2xl border border-forest-100 bg-white p-10 text-center shadow-card"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-800 text-cream">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-display text-xl font-semibold text-forest-900">
          {viaEmail ? 'Your message is ready to send' : 'Thank you — we have your message'}
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-forest-800/70">
          {viaEmail
            ? "We've opened your email client with the enquiry pre-filled. If nothing opened, write to us directly at "
            : 'A director will get back to you shortly. You can also reach us at '}
          <a
            href={`mailto:${contact.email}`}
            className="font-semibold text-forest-700 underline underline-offset-4"
          >
            {contact.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => {
            setForm(EMPTY);
            setSent(false);
            setViaEmail(false);
          }}
          className="mt-8 text-sm font-semibold text-forest-700 underline underline-offset-4 hover:text-forest-900"
        >
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-forest-100 bg-white p-7 shadow-card md:p-9"
      noValidate={false}
    >
      <h2 className="font-display text-2xl font-semibold text-forest-900">Send us a message</h2>
      <p className="mt-2 text-sm text-forest-800/65">
        Tell us what you'd like to discuss and a director will get back to you.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label="Full name"
          value={form.name}
          onChange={update('name')}
          required
          autoComplete="name"
        />
        <Field
          id="email"
          label="Email address"
          type="email"
          value={form.email}
          onChange={update('email')}
          required
          autoComplete="email"
        />
        <Field
          id="phone"
          label="Phone (optional)"
          type="tel"
          value={form.phone}
          onChange={update('phone')}
          autoComplete="tel"
        />

        <div>
          <label htmlFor="interest" className={LABEL}>
            I'm interested in
          </label>
          <select
            id="interest"
            value={form.interest}
            onChange={update('interest')}
            className={CONTROL}
          >
            {INTERESTS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={LABEL}>
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            value={form.message}
            onChange={update('message')}
            required
            className={`${CONTROL} resize-y`}
            placeholder="Share your questions on allocation, timelines or documentation…"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full
                   bg-forest-800 px-7 py-3.5 text-sm font-semibold text-cream shadow-card transition-all
                   duration-300 hover:-translate-y-0.5 hover:bg-forest-700 hover:shadow-lift
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-gold-500 disabled:cursor-not-allowed disabled:opacity-60
                   disabled:hover:translate-y-0 sm:w-auto"
      >
        {sending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Send Enquiry
            <Send
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {error ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3
                     text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-forest-800/55">
        By submitting you agree to be contacted about Invest Care Limited. This form does not
        constitute an offer or solicitation to invest — see our{' '}
        <a href="/disclaimer" className="underline underline-offset-2 hover:text-forest-800">
          disclaimer
        </a>
        .
      </p>
    </form>
  );
}

const LABEL = 'block text-xs font-semibold uppercase tracking-[0.14em] text-forest-700';

const CONTROL =
  'mt-2 w-full rounded-xl border border-forest-200 bg-cream px-4 py-3 text-sm text-forest-900 ' +
  'outline-none transition placeholder:text-forest-400 focus:border-forest-600 focus:bg-white ' +
  'focus:ring-2 focus:ring-forest-600/15';

function Field({ id, label, type = 'text', value, onChange, required, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className={CONTROL}
      />
    </div>
  );
}
