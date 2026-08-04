'use client';

import { useCallback, useEffect, useState } from 'react';
import { Mail, Phone, Trash2 } from 'lucide-react';

import { apiFetch } from '@/lib/api';
import { Button, Card, Notice, Spinner } from '../ui';

/** Messages from the website contact form. Read-only, plus a status workflow. */
export default function EnquiryInbox({ section, path }) {
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');

  const load = useCallback(
    async (status) => {
      try {
        setData(await apiFetch(`${path}${status ? `?status=${status}` : ''}`));
      } catch (err) {
        setError(err.message);
      }
    },
    [path]
  );

  useEffect(() => {
    load(filter);
  }, [load, filter]);

  const setStatus = async (id, status) => {
    try {
      await apiFetch(`${path}/${id}`, { method: 'PATCH', body: { status } });
      await load(filter);
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    // eslint-disable-next-line no-alert -- a deletion is worth one confirmation
    if (!window.confirm('Delete this enquiry permanently?')) return;

    try {
      await apiFetch(`${path}/${id}`, { method: 'DELETE' });
      await load(filter);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!data) return error ? <Notice>{error}</Notice> : <Spinner />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[{ key: '', label: 'All' }, ...section.statuses.map((s) => ({ key: s, label: s }))].map(
          (tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold capitalize transition-colors ${
                filter === tab.key
                  ? 'border-gold-500/60 bg-gold-500/10 text-gold-300'
                  : 'border-white/10 text-forest-100/60 hover:border-white/30 hover:text-cream'
              }`}
            >
              {tab.label}
              {tab.key && data.counts?.[tab.key] ? (
                <span className="ml-1.5 text-forest-100/40">{data.counts[tab.key]}</span>
              ) : null}
            </button>
          )
        )}
      </div>

      <Notice>{error}</Notice>

      {data.items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-forest-100/50">
          No messages{filter ? ` marked “${filter}”` : ''}.
        </p>
      ) : null}

      {data.items.map((enquiry) => (
        <Card key={enquiry.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-white">{enquiry.name}</p>
              <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-forest-100/60">
                <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1.5 hover:text-cream">
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                  {enquiry.email}
                </a>
                {enquiry.phone ? (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    {enquiry.phone}
                  </span>
                ) : null}
              </p>
            </div>

            <div className="text-right text-xs text-forest-100/40">
              <p>{new Date(enquiry.createdAt).toLocaleString('en-GB')}</p>
              <p className="mt-1 capitalize text-forest-100/60">{enquiry.status}</p>
            </div>
          </div>

          {enquiry.subject ? (
            <p className="mt-4 text-xs uppercase tracking-label text-gold-400/80">
              {enquiry.subject}
            </p>
          ) : null}

          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-forest-100/80">
            {enquiry.message}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {section.statuses
              .filter((status) => status !== enquiry.status)
              .map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatus(enquiry.id, status)}
                  className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs capitalize
                             text-forest-100/70 transition-colors hover:border-white/40 hover:text-cream"
                >
                  Mark {status}
                </button>
              ))}

            <button
              type="button"
              onClick={() => remove(enquiry.id)}
              className="ml-auto rounded-lg border border-white/10 p-1.5 text-forest-100/50
                         transition-colors hover:border-red-400/50 hover:text-red-300"
              aria-label="Delete enquiry"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </Card>
      ))}

      <Button variant="ghost" onClick={() => load(filter)}>
        Refresh
      </Button>
    </div>
  );
}
