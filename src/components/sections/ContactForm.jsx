'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';

import { contact } from '@/data/company';
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
 * There is no mail backend wired up yet, so rather than silently discarding
 * submissions the form composes a pre-filled message and hands it to the
 * visitor's own mail client. To move to server-side delivery, replace
 * `handleSubmit` with a POST to a route handler (e.g. Resend or SMTP).
 */
export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [sent, setSent] = useState(false);

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();

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

    setSent(true);
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
          Your message is ready to send
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-forest-800/70">
          We've opened your email client with the enquiry pre-filled. If nothing opened, write to us
          directly at{' '}
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
        className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full
                   bg-forest-800 px-7 py-3.5 text-sm font-semibold text-cream shadow-card transition-all
                   duration-300 hover:-translate-y-0.5 hover:bg-forest-700 hover:shadow-lift
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-gold-500 sm:w-auto"
      >
        Send Enquiry
        <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      </button>

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
