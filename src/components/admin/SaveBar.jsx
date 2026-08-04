'use client';

import { useEffect } from 'react';
import { Check, Save } from 'lucide-react';

import { Button } from './ui';

/**
 * The Save button lives here rather than at the bottom of a long form, so it is
 * always reachable and always says whether there is anything to save.
 *
 * Also wires Ctrl/Cmd+S, and warns before the tab is closed with unsaved work —
 * losing an afternoon's edits to a stray click is the worst thing a CMS can do.
 */
export default function SaveBar({ dirty, saving, onSave, label = 'Save changes' }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        if (dirty && !saving) onSave();
      }
    };

    const onBeforeUnload = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [dirty, saving, onSave]);

  return (
    <div
      className="sticky bottom-0 -mx-5 mt-8 flex flex-wrap items-center gap-4 border-t border-white/10
                 bg-forest-950/95 px-5 py-4 backdrop-blur"
    >
      <p className="flex items-center gap-2 text-xs text-forest-100/60">
        {dirty ? (
          <>
            <span className="h-2 w-2 rounded-full bg-gold-500" aria-hidden="true" />
            Unsaved changes
          </>
        ) : (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            All changes saved
          </>
        )}
      </p>

      <div className="ml-auto flex items-center gap-3">
        <kbd className="hidden rounded border border-white/15 px-2 py-1 text-[10px] text-forest-100/40 sm:block">
          Ctrl+S
        </kbd>
        <Button onClick={onSave} busy={saving} disabled={!dirty}>
          {saving ? null : <Save className="h-4 w-4" aria-hidden="true" />}
          {label}
        </Button>
      </div>
    </div>
  );
}
