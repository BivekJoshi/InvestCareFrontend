'use client';

import { Plus, X } from 'lucide-react';

import { inputClass, labelClass } from './ui';

/**
 * Renders one form control from a field definition supplied by
 * `GET /api/admin/schema`. Adding a field type to the backend schema makes it
 * editable here without touching any page.
 */
export default function Field({ field, value, onChange }) {
  const id = `field-${field.key}`;
  const common = {
    id,
    className: inputClass,
    value: value ?? '',
    placeholder: field.placeholder,
    onChange: (e) => onChange(e.target.value),
  };

  const control = () => {
    switch (field.type) {
      case 'textarea':
        return <textarea {...common} rows={4} />;

      case 'richtext':
        return <textarea {...common} rows={7} />;

      case 'number':
        return (
          <input
            {...common}
            type="number"
            step="any"
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          />
        );

      case 'boolean':
        return (
          <label className="flex items-center gap-3 text-sm text-cream">
            <input
              id={id}
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-forest-950 accent-gold-500"
            />
            {field.label}
          </label>
        );

      case 'select':
        return (
          <select {...common}>
            <option value="">—</option>
            {(field.options ?? []).map((option) => (
              <option key={option} value={option} className="bg-forest-900">
                {option}
              </option>
            ))}
          </select>
        );

      case 'date':
        return <input {...common} type="date" value={(value ?? '').slice(0, 10)} />;

      case 'email':
        return <input {...common} type="email" />;

      case 'tel':
        return <input {...common} type="tel" inputMode="tel" />;

      case 'password':
        return <input {...common} type="password" autoComplete="new-password" />;

      case 'color':
        return (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={value || '#1f6b46'}
              onChange={(e) => onChange(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent"
              aria-label={field.label}
            />
            <input {...common} className={`${inputClass} font-mono`} placeholder="#1f6b46" />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-2">
            <input {...common} placeholder="/images/… or an uploaded URL" />
            {value ? (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary CMS URL, no loader
              <img
                src={value}
                alt=""
                className="h-24 w-auto rounded-lg border border-white/10 object-cover"
              />
            ) : null}
          </div>
        );

      case 'stringList':
        return <StringList value={value} onChange={onChange} placeholder={field.label} />;

      case 'json':
        return <JsonField value={value} onChange={onChange} />;

      default:
        return <input {...common} type="text" />;
    }
  };

  if (field.type === 'boolean') return <div className="pt-6">{control()}</div>;

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {field.label}
        {field.required ? <span className="ml-1 text-gold-400">*</span> : null}
      </label>
      <div className="mt-2">{control()}</div>
    </div>
  );
}

/** A repeatable list of plain strings — metrics, requirements, bullet points. */
function StringList({ value, onChange, placeholder }) {
  const items = Array.isArray(value) ? value : [];

  const update = (index, next) =>
    onChange(items.map((item, i) => (i === index ? next : item)));

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <input
            className={inputClass}
            value={item}
            onChange={(e) => update(index, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            className="shrink-0 rounded-xl border border-white/10 px-3 text-forest-100/60
                       transition-colors hover:border-red-400/50 hover:text-red-300"
            aria-label={`Remove item ${index + 1}`}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...items, ''])}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        Add item
      </button>
    </div>
  );
}

/**
 * Escape hatch for the few structured blobs (the capital bars and the ask)
 * whose shape is too bespoke to be worth a dedicated editor. Invalid JSON is
 * reported inline and simply not saved, so a typo cannot corrupt the record.
 */
function JsonField({ value, onChange }) {
  const text = typeof value === 'string' ? value : JSON.stringify(value ?? null, null, 2);
  let error = null;

  try {
    if (typeof value === 'string') JSON.parse(value);
  } catch (err) {
    error = err.message;
  }

  return (
    <div>
      <textarea
        className={`${inputClass} font-mono text-xs`}
        rows={10}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
      {error ? <p className="mt-1.5 text-xs text-red-300">Invalid JSON — {error}</p> : null}
    </div>
  );
}
