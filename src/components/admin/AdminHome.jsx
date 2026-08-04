'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';

import { apiFetch, clearToken, getToken } from '@/lib/api';

/**
 * Placeholder home for the CMS. It exists so signing in leads somewhere and so
 * the token round-trip is verifiable; content modules replace the body later.
 */
export default function AdminHome() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/admin/login');
      return;
    }

    let active = true;

    apiFetch('/auth/me')
      .then(({ user: me }) => {
        if (active) setUser(me);
      })
      .catch(() => {
        // Expired, revoked or unreachable — send them back to sign in.
        clearToken();
        router.replace('/admin/login');
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // The token is discarded client-side regardless of what the server says.
    }
    clearToken();
    router.replace('/admin/login');
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold-400" aria-hidden="true" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs uppercase tracking-label text-forest-100/50">Invest Care CMS</p>
          <h1 className="mt-1 font-display text-2xl font-bold text-white">
            Welcome back, {user.name}
          </h1>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5
                     text-sm text-cream transition-colors hover:border-white/50 hover:bg-white/10"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign Out
        </button>
      </header>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          ['Signed in as', user.email],
          ['Role', user.role],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <dt className="text-xs uppercase tracking-label text-forest-100/50">{label}</dt>
            <dd className="mt-1.5 text-sm text-white">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-8 rounded-2xl border border-dashed border-white/15 p-6 text-sm leading-relaxed text-forest-100/60">
        Authentication is wired up. Content modules — board, portfolio, sectors and careers — plug
        in here as they are added to the API.
      </p>
    </div>
  );
}
