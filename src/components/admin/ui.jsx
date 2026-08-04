'use client';

import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * Small shared pieces for the CMS. The admin area is a tool, not a brochure —
 * it borrows the site's palette but stays plain and dense on purpose.
 */

export const inputClass =
  'w-full rounded-xl border border-white/10 bg-forest-950/60 px-4 py-2.5 text-sm text-cream ' +
  'outline-none transition-colors placeholder:text-forest-100/25 focus:border-gold-500/60 ' +
  'disabled:opacity-50';

export const labelClass = 'block text-xs uppercase tracking-label text-forest-100/60';

export function Button({ variant = 'primary', className = '', busy = false, children, ...props }) {
  const variants = {
    primary: 'bg-gold-500 text-forest-950 hover:bg-gold-400 disabled:opacity-60',
    ghost: 'border border-white/20 text-cream hover:border-white/50 hover:bg-white/10',
    danger: 'border border-red-500/40 text-red-200 hover:border-red-400 hover:bg-red-500/10',
  };

  return (
    <button
      {...props}
      disabled={props.disabled || busy}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm
                  font-semibold transition-all duration-200 disabled:cursor-not-allowed
                  ${variants[variant]} ${className}`}
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}

export function Notice({ tone = 'error', children }) {
  if (!children) return null;

  const tones = {
    error: 'border-red-500/30 bg-red-500/10 text-red-200',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
  };

  const Icon = tone === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <p
      role="status"
      className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-5 w-5 animate-spin text-gold-400" aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function Card({ className = '', children }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 ${className}`}>{children}</div>
  );
}
