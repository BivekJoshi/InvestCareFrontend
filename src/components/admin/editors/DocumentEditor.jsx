'use client';

import { useEffect, useState } from 'react';

import { apiFetch } from '@/lib/api';
import Field from '../Field';
import SaveBar from '../SaveBar';
import { useToast } from '../Toast';
import { Notice, Spinner } from '../ui';

/** One form, saved whole — the company profile, contact details, SEO defaults. */
export default function DocumentEditor({ section, path, onDirtyChange }) {
  const notify = useToast();

  const [values, setValues] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // The account form posts credentials rather than loading a document.
  const isCredentialForm = path.includes('change-password');

  useEffect(() => {
    let active = true;

    if (isCredentialForm) {
      setValues({});
      return undefined;
    }

    apiFetch(path)
      .then((data) => active && setValues(data ?? {}))
      .catch((err) => active && setError(err.message));

    return () => {
      active = false;
    };
  }, [path, isCredentialForm]);

  const markDirty = (next) => {
    setValues(next);
    setDirty(true);
    onDirtyChange?.(true);
  };

  const save = async () => {
    setError('');
    setSaving(true);

    try {
      const payload = { ...values };

      // JSON fields are edited as text; parse them back before sending.
      for (const field of section.fields) {
        if (field.type === 'json' && typeof payload[field.key] === 'string') {
          payload[field.key] = JSON.parse(payload[field.key]);
        }
      }

      await apiFetch(path, { method: isCredentialForm ? 'POST' : 'PUT', body: payload });

      setDirty(false);
      onDirtyChange?.(false);
      notify(isCredentialForm ? 'Password updated.' : 'Saved.');
      if (isCredentialForm) setValues({});
    } catch (err) {
      const message =
        err instanceof SyntaxError ? `A JSON field is not valid — ${err.message}` : err.message;
      setError(message);
      notify(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!values) return error ? <Notice>{error}</Notice> : <Spinner />;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {section.fields.map((field) => (
          <div
            key={field.key}
            className={
              ['textarea', 'richtext', 'json'].includes(field.type) ? 'md:col-span-2' : undefined
            }
          >
            <Field
              field={field}
              value={values[field.key]}
              onChange={(next) => markDirty({ ...values, [field.key]: next })}
            />
          </div>
        ))}
      </div>

      {error ? (
        <div className="mt-5">
          <Notice>{error}</Notice>
        </div>
      ) : null}

      <SaveBar
        dirty={dirty}
        saving={saving}
        onSave={save}
        label={isCredentialForm ? 'Update password' : 'Save changes'}
      />
    </form>
  );
}
