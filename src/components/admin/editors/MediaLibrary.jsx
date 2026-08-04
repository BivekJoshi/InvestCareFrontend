'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Trash2, Upload } from 'lucide-react';

import { API_URL, apiFetch, getToken } from '@/lib/api';
import { Notice, Spinner } from '../ui';

/**
 * Uploaded images. Copying a URL is the point of this screen — paste it into
 * any image field on another tab.
 */
export default function MediaLibrary({ section, path }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState(null);
  const fileInput = useRef(null);

  const load = async () => {
    try {
      setItems(await apiFetch(path));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once per mount
  }, [path]);

  const upload = async (file) => {
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const body = new FormData();
      body.append('file', file);

      // Sent directly rather than through apiFetch: the browser must set the
      // multipart boundary on Content-Type itself.
      const response = await fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body,
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error?.message ?? `Upload failed (${response.status})`);
      }

      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const remove = async (item) => {
    // eslint-disable-next-line no-alert -- deleting a file in use would break a page
    if (!window.confirm(`Delete ${item.originalName}? Any page using it will lose the image.`)) return;

    try {
      await apiFetch(`${path}/${item.id}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const copy = async (url) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };

  if (!items) return error ? <Notice>{error}</Notice> : <Spinner />;

  return (
    <div className="space-y-5">
      <label
        className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border
                   border-dashed border-white/20 p-10 text-center transition-colors
                   hover:border-gold-500/50 hover:bg-white/5"
      >
        <Upload className="h-6 w-6 text-gold-400" aria-hidden="true" />
        <span className="mt-3 text-sm font-semibold text-cream">
          {uploading ? 'Uploading…' : 'Choose an image to upload'}
        </span>
        <span className="mt-1 text-xs text-forest-100/50">
          {section.accept.map((type) => type.replace('image/', '').toUpperCase()).join(', ')} · up to{' '}
          {section.maxSizeMb} MB
        </span>
        <input
          ref={fileInput}
          type="file"
          accept={section.accept.join(',')}
          className="sr-only"
          disabled={uploading}
          onChange={(event) => upload(event.target.files?.[0])}
        />
      </label>

      <Notice>{error}</Notice>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded URL */}
            <img src={item.url} alt={item.altText ?? ''} className="h-36 w-full object-cover" />

            <figcaption className="p-3">
              <p className="truncate text-xs font-semibold text-white">{item.originalName}</p>
              <p className="mt-0.5 text-[11px] text-forest-100/40">
                {(item.sizeBytes / 1024).toFixed(0)} KB
              </p>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copy(item.url)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border
                             border-white/10 py-1.5 text-[11px] text-forest-100/70 transition-colors
                             hover:border-white/40 hover:text-cream"
                >
                  {copied === item.url ? (
                    <>
                      <Check className="h-3 w-3" aria-hidden="true" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" aria-hidden="true" /> Copy URL
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => remove(item)}
                  className="rounded-lg border border-white/10 p-1.5 text-forest-100/50
                             transition-colors hover:border-red-400/50 hover:text-red-300"
                  aria-label={`Delete ${item.originalName}`}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-sm text-forest-100/50">No images uploaded yet.</p>
      ) : null}
    </div>
  );
}
