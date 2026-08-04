'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

import { apiFetch } from '@/lib/api';
import Field from '../Field';
import SaveBar from '../SaveBar';
import { useToast } from '../Toast';
import { Card, Notice, Spinner } from '../ui';

/**
 * Repeatable rows saved as a whole list — core values, why-invest, the ticker.
 *
 * Add, edit, reorder and remove all happen locally; one Save writes the list in
 * a single transaction. That matches how editing actually feels, and means a
 * half-finished reorder is never persisted.
 */
export default function ListEditor({ section, path, onDirtyChange }) {
  const notify = useToast();

  const [items, setItems] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    apiFetch(path)
      .then((data) => active && setItems(data ?? []))
      .catch((err) => active && setError(err.message));

    return () => {
      active = false;
    };
  }, [path]);

  const touch = (next) => {
    setError('');
    setItems(next);
    setDirty(true);
    onDirtyChange?.(true);
  };

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;

    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    touch(next);
  };

  const save = async () => {
    setError('');
    setSaving(true);

    try {
      const saved = await apiFetch(path, { method: 'PUT', body: { items } });
      setItems(saved);
      setDirty(false);
      onDirtyChange?.(false);
      notify('Saved.');
    } catch (err) {
      setError(err.message);
      notify(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!items) return error ? <Notice>{error}</Notice> : <Spinner />;

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-forest-100/50">
          Nothing here yet. Add the first item below.
        </p>
      ) : null}

      {items.map((item, index) => (
        <Card key={item.id ?? `new-${index}`}>
          <div className="flex items-start gap-4">
            <span className="mt-2 w-6 shrink-0 text-center font-display text-sm text-forest-100/40">
              {index + 1}
            </span>

            <div className="grid flex-1 gap-4 md:grid-cols-2">
              {section.itemFields.map((field) => (
                <div
                  key={field.key}
                  className={field.type === 'textarea' ? 'md:col-span-2' : undefined}
                >
                  <Field
                    field={field}
                    value={item[field.key]}
                    onChange={(next) =>
                      touch(items.map((row, i) => (i === index ? { ...row, [field.key]: next } : row)))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex shrink-0 flex-col gap-1">
              <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                <ArrowUp className="h-4 w-4" aria-hidden="true" />
              </IconButton>
              <IconButton
                label="Move down"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
              >
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </IconButton>
              <IconButton
                label="Remove"
                danger
                onClick={() => touch(items.filter((_, i) => i !== index))}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </IconButton>
            </div>
          </div>
        </Card>
      ))}

      <button
        type="button"
        onClick={() => touch([...items, {}])}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/20 px-5 py-3
                   text-sm font-semibold text-gold-400 transition-colors hover:border-gold-500/50 hover:bg-white/5"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add another
      </button>

      <Notice>{error}</Notice>

      <SaveBar dirty={dirty} saving={saving} onSave={save} label="Save list" />
    </div>
  );
}

function IconButton({ label, danger = false, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={`rounded-lg border border-white/10 p-1.5 text-forest-100/60 transition-colors
                  disabled:opacity-25 ${
                    danger
                      ? 'hover:border-red-400/50 hover:text-red-300'
                      : 'hover:border-white/40 hover:text-cream'
                  }`}
    >
      {children}
    </button>
  );
}
