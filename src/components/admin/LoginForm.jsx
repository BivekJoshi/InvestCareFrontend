'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock } from 'lucide-react';

import { apiFetch, setToken } from '@/lib/api';

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { token } = await apiFetch('/auth/login', {
        method: 'POST',
        auth: false,
        body: { email, password },
      });

      setToken(token);
      router.replace('/admin');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-16">
      <div
        className="absolute inset-0 bg-grid-forest bg-[size:64px_64px] opacity-30"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2
                   rounded-full bg-forest-700/25 blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lift backdrop-blur-sm sm:p-10">
          <span className="inline-flex rounded-xl border border-white/10 bg-forest-900/60 p-3 text-gold-400">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>

          <h1 className="mt-6 font-display text-2xl font-bold text-white sm:text-3xl">
            Content Management
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-forest-100/60">
            Sign in to manage the Invest Care website.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-label text-forest-100/60"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-forest-950/60 px-4 py-3 text-sm
                           text-cream outline-none transition-colors placeholder:text-forest-100/30
                           focus:border-gold-500/60"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs uppercase tracking-label text-forest-100/60"
              >
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-forest-950/60 px-4 py-3 pr-12 text-sm
                             text-cream outline-none transition-colors placeholder:text-forest-100/30
                             focus:border-gold-500/60"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((shown) => !shown)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-forest-100/50
                             transition-colors hover:text-cream"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10
                           px-4 py-3 text-sm text-red-200"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold-500
                         px-7 py-3.5 text-sm font-semibold text-forest-950 shadow-card transition-all
                         duration-300 hover:bg-gold-400 hover:shadow-lift disabled:cursor-not-allowed
                         disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-forest-100/40">
          <Link href="/" className="transition-colors hover:text-forest-100">
            ← Back to investcare.com.np
          </Link>
        </p>
      </div>
    </div>
  );
}
