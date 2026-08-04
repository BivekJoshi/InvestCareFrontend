'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';

import { apiFetch, clearToken, getToken } from '@/lib/api';
import DocumentEditor from './editors/DocumentEditor';
import EnquiryInbox from './editors/EnquiryInbox';
import ListEditor from './editors/ListEditor';
import MediaLibrary from './editors/MediaLibrary';
import TableEditor from './editors/TableEditor';
import { ToastProvider } from './Toast';
import { Notice, Spinner } from './ui';

const EDITORS = {
  document: DocumentEditor,
  list: ListEditor,
  table: TableEditor,
  inbox: EnquiryInbox,
  media: MediaLibrary,
};

/**
 * The CMS.
 *
 * Its entire structure — tabs, sections, fields — comes from
 * `GET /api/admin/schema`, so adding a section to the backend surfaces it here
 * with no change to this file. Nothing about the site's content is hard-coded
 * in the admin UI.
 *
 * A single route with client-side tabs, rather than nested routes: the site is
 * a static export, and this keeps the CMS to one prerendered page.
 */
export default function CmsApp() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [tabs, setTabs] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/admin/login');
      return undefined;
    }

    let active = true;

    Promise.all([apiFetch('/auth/me'), apiFetch('/admin/schema')])
      .then(([me, schema]) => {
        if (!active) return;
        setUser(me.user);
        setTabs(schema.tabs);
      })
      .catch((err) => {
        if (!active) return;
        // An expired or revoked token is not an error to display — sign out.
        if (/token|session|Unauthorized/i.test(err.message)) {
          clearToken();
          router.replace('/admin/login');
          return;
        }
        setError(err.message);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    clearToken();
    router.replace('/admin/login');
  };

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24">
        <Notice>{error}</Notice>
        <p className="mt-4 text-sm text-forest-100/60">
          The CMS could not reach the API. Check that the backend is running.
        </p>
      </div>
    );
  }

  if (!tabs || !user) return <Spinner label="Loading the CMS" />;

  const tab = tabs[activeTab];
  const section = tab.sections[activeSection];
  const Editor = EDITORS[section.kind];

  // Schema endpoints are absolute (/api/…); the API client already carries the
  // /api prefix in its base URL.
  const path = section.endpoint.replace(/^\/api/, '');

  /** Guards every navigation away from a screen with unsaved edits. */
  const leaveGuard = () => {
    // eslint-disable-next-line no-alert -- silently discarding typed work is worse
    if (dirty && !window.confirm('You have unsaved changes. Leave without saving?')) return false;
    setDirty(false);
    return true;
  };

  const selectTab = (index) => {
    if (!leaveGuard()) return;
    setActiveTab(index);
    setActiveSection(0);
    setMenuOpen(false);
  };

  const selectSection = (index) => {
    if (!leaveGuard()) return;
    setActiveSection(index);
  };

  return (
    <ToastProvider>
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-forest-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-lg border border-white/10 p-2 text-forest-100/70 lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-label text-forest-100/40">Invest Care CMS</p>
            <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden items-center gap-1.5 rounded-full border border-white/15 px-4 py-2
                       text-xs text-forest-100/70 transition-colors hover:border-white/40 hover:text-cream sm:inline-flex"
          >
            View site
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2
                       text-xs text-forest-100/70 transition-colors hover:border-white/40 hover:text-cream"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-5 py-8">
        <nav
          className={`${menuOpen ? 'block' : 'hidden'} w-full shrink-0 lg:block lg:w-56`}
          aria-label="Content sections"
        >
          <ul className="space-y-1">
            {tabs.map((entry, index) => (
              <li key={entry.key}>
                <button
                  type="button"
                  onClick={() => selectTab(index)}
                  className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition-colors ${
                    index === activeTab
                      ? 'bg-gold-500/10 font-semibold text-gold-300'
                      : 'text-forest-100/70 hover:bg-white/5 hover:text-cream'
                  }`}
                >
                  {entry.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <main className={`${menuOpen ? 'hidden' : 'block'} min-w-0 flex-1 lg:block`}>
          <h1 className="font-display text-2xl font-bold text-white">{tab.label}</h1>
          {tab.description ? (
            <p className="mt-1.5 text-sm text-forest-100/60">{tab.description}</p>
          ) : null}

          {tab.sections.length > 1 ? (
            <div className="mt-6 flex flex-wrap gap-2 border-b border-white/10 pb-4">
              {tab.sections.map((entry, index) => (
                <button
                  key={entry.key}
                  type="button"
                  onClick={() => selectSection(index)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                    index === activeSection
                      ? 'border-gold-500/60 bg-gold-500/10 text-gold-300'
                      : 'border-white/10 text-forest-100/60 hover:border-white/30 hover:text-cream'
                  }`}
                >
                  {entry.label}
                </button>
              ))}
            </div>
          ) : null}

          <section className="mt-8" aria-label={section.label}>
            <h2 className="font-display text-lg font-semibold text-white">{section.label}</h2>
            {section.help ? (
              <p className="mt-1 max-w-2xl text-sm leading-relaxed text-forest-100/50">
                {section.help}
              </p>
            ) : null}

            <div className="mt-6">
              {/* Remounting on `path` keeps one section's unsaved state from
                  leaking into the next. */}
              <Editor key={path} section={section} path={path} onDirtyChange={setDirty} />
            </div>
          </section>
        </main>
      </div>
    </div>
    </ToastProvider>
  );
}
