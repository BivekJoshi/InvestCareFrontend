'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, Plus, Trash2, X } from 'lucide-react';

import { apiFetch } from '@/lib/api';
import Field from '../Field';
import SaveBar from '../SaveBar';
import { useToast } from '../Toast';
import { Button, Card, Notice, Spinner } from '../ui';

/**
 * Full records with their own fields — board members, portfolio companies,
 * sectors, milestones, benchmarks, jobs.
 *
 * The list is the overview; editing opens one record at a time so a long form
 * never competes with the list for space. Each save is its own request, so a
 * failure on one record cannot roll back another.
 */
export default function TableEditor({ section, path, onDirtyChange }) {
  const notify = useToast();

  const [rows, setRows] = useState(null);
  const [editing, setEditing] = useState(null); // record object, or {} for a new one
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = async () => {
    try {
      setRows(await apiFetch(path));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    setRows(null);
    setEditing(null);
    setError('');
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload whenever the section changes
  }, [path]);

  const titleField = section.fields[0].key;
  const singular = section.label.replace(/s$/, '').toLowerCase();

  const save = async () => {
    setError('');
    setBusy(true);

    try {
      const payload = { ...editing };
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.position;

      if (editing.id) {
        await apiFetch(`${path}/${editing.id}`, { method: 'PATCH', body: payload });
      } else {
        await apiFetch(path, { method: 'POST', body: payload });
      }

      await load();
      setEditing(null);
      setDirty(false);
      onDirtyChange?.(false);
      notify('Saved.');
    } catch (err) {
      setError(err.message);
      notify(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const closeEditor = () => {
    // eslint-disable-next-line no-alert -- losing typed work silently is worse
    if (dirty && !window.confirm('Discard your unsaved changes?')) return;
    setEditing(null);
    setDirty(false);
    onDirtyChange?.(false);
    setError('');
  };

  const remove = async (row) => {
    // eslint-disable-next-line no-alert -- a deletion is worth one confirmation
    if (!window.confirm(`Delete “${row[titleField]}”? This cannot be undone.`)) return;

    try {
      await apiFetch(`${path}/${row.id}`, { method: 'DELETE' });
      await load();
      notify('Deleted.');
    } catch (err) {
      setError(err.message);
      notify(err.message, 'error');
    }
  };

  const togglePublished = async (row) => {
    try {
      await apiFetch(`${path}/${row.id}`, {
        method: 'PATCH',
        body: { isPublished: !row.isPublished },
      });
      await load();
      notify(row.isPublished ? 'Hidden from the website.' : 'Now showing on the website.');
    } catch (err) {
      setError(err.message);
      notify(err.message, 'error');
    }
  };

  const move = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;

    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next); // optimistic — the server confirms on the next load

    try {
      await apiFetch(`${path}/reorder`, { method: 'POST', body: { ids: next.map((r) => r.id) } });
    } catch (err) {
      setError(err.message);
      await load();
    }
  };

  if (!rows) return error ? <Notice>{error}</Notice> : <Spinner />;

  if (editing) {
    return (
      <form
        onSubmit={(event) => {
          event.preventDefault();
          save();
        }}
        className="space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-white">
            {editing.id ? `Edit ${editing[titleField] ?? 'record'}` : `New ${singular}`}
          </h3>
          <button
            type="button"
            onClick={closeEditor}
            className="rounded-lg p-1.5 text-forest-100/60 hover:text-cream"
            aria-label="Close"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {section.fields.map((field) => (
            <div
              key={field.key}
              className={
                ['textarea', 'richtext', 'stringList', 'json'].includes(field.type)
                  ? 'md:col-span-2'
                  : undefined
              }
            >
              <Field
                field={field}
                value={editing[field.key]}
                onChange={(next) => {
                  setEditing((prev) => ({ ...prev, [field.key]: next }));
                  setDirty(true);
                  onDirtyChange?.(true);
                }}
              />
            </div>
          ))}
        </div>

        <Notice>{error}</Notice>

        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" onClick={closeEditor}>
            Back to list
          </Button>
        </div>

        <SaveBar dirty={dirty || !editing.id} saving={busy} onSave={save} label="Save" />
      </form>
    );
  }

  return (
    <div className="space-y-3">
      <Notice>{error}</Notice>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-sm text-forest-100/50">
          No records yet.
        </p>
      ) : null}

      {rows.map((row, index) => (
        <Card key={row.id} className="flex flex-wrap items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-white">
              {row[titleField] || <span className="text-forest-100/40">Untitled</span>}
              {row.isPublished === false ? (
                <span className="ml-2 rounded-full border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-label text-forest-100/50">
                  Hidden
                </span>
              ) : null}
            </p>
            <p className="mt-0.5 truncate text-xs text-forest-100/50">
              {section.fields
                .slice(1, 3)
                .map((f) => row[f.key])
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {section.reorderable ? (
              <>
                <IconButton label="Move up" onClick={() => move(index, -1)} disabled={index === 0}>
                  <ArrowUp className="h-4 w-4" aria-hidden="true" />
                </IconButton>
                <IconButton
                  label="Move down"
                  onClick={() => move(index, 1)}
                  disabled={index === rows.length - 1}
                >
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </IconButton>
              </>
            ) : null}

            <IconButton
              label={row.isPublished ? 'Hide from the website' : 'Show on the website'}
              onClick={() => togglePublished(row)}
            >
              {row.isPublished ? (
                <Eye className="h-4 w-4" aria-hidden="true" />
              ) : (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              )}
            </IconButton>

            <Button variant="ghost" className="px-4 py-1.5" onClick={() => setEditing(row)}>
              Edit
            </Button>

            <IconButton label="Delete" danger onClick={() => remove(row)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          </div>
        </Card>
      ))}

      <Button onClick={() => setEditing({})} className="mt-2">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add {singular}
      </Button>
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
