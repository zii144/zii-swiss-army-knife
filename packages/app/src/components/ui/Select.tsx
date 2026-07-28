import { useEffect, useId, useMemo, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  /** Optional leading glyph (e.g. a flag emoji) shown before the label. */
  icon?: string;
}

export interface SelectProps {
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  ariaLabel?: string;
  /** `pill` = translucent (on the blue background); `field` = glass form control. */
  variant?: 'pill' | 'field';
  className?: string;
}

/** How long a typed character stays in the typeahead buffer, in ms. */
export const TYPEAHEAD_TIMEOUT = 800;

/**
 * Index of the option a typeahead buffer should land on, or `-1` for no match.
 *
 * Mirrors a native <select>: repeated presses of one key cycle through the
 * options sharing that initial, while distinct keys typed in quick succession
 * extend the search string. Pure so it can be unit-tested without a DOM.
 */
export function typeaheadIndex(
  labels: readonly string[],
  buffer: string,
  active: number,
): number {
  if (buffer === '' || labels.length === 0) return -1;
  const needle = buffer.toLowerCase();
  const cycling = buffer.length > 1 && [...buffer].every((c) => c === buffer[0]);
  const term = cycling ? needle[0]! : needle;
  // Cycling (and a fresh single key) advances past the current option; a
  // growing search string re-tests the current one first.
  const from = cycling || buffer.length === 1 ? active + 1 : active;
  for (let i = 0; i < labels.length; i += 1) {
    const idx = ((from + i) % labels.length + labels.length) % labels.length;
    if (labels[idx]!.toLowerCase().startsWith(term)) return idx;
  }
  return -1;
}

/**
 * An accessible custom dropdown that fully replaces the native <select> so the
 * open menu matches the app's glass design. Supports keyboard navigation
 * (Arrow/Home/End/Enter/Esc), first-character typeahead, click-outside, and
 * aria-activedescendant.
 *
 * The trigger carries `role="combobox"` and `aria-controls`: ARIA only honours
 * `aria-activedescendant` on a composite role, so on a plain button the active
 * option was pointed at by an attribute assistive technology had no reason to
 * follow, and nothing tied the trigger to the listbox it opens.
 */
export function Select({
  value,
  options,
  onChange,
  ariaLabel,
  variant = 'field',
  className,
}: SelectProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const selectedIndex = useMemo(
    () => Math.max(0, options.findIndex((o) => o.value === value)),
    [options, value],
  );
  const [active, setActive] = useState(selectedIndex);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const baseId = useId();
  const listId = `${baseId}-listbox`;
  /** Buffer for first-character typeahead, cleared after a pause (as native <select> does). */
  const typeahead = useRef<{ buffer: string; at: number }>({ buffer: '', at: 0 });

  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
    typeahead.current = { buffer: '', at: 0 };
    const onDoc = (e: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[active] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  const choose = (i: number): void => {
    const opt = options[i];
    if (opt) onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  /** Extend (or restart) the typeahead buffer and move to the matching option. */
  const typeaheadTo = (key: string, now: number): boolean => {
    const state = typeahead.current;
    const buffer = now - state.at < TYPEAHEAD_TIMEOUT ? state.buffer + key : key;
    typeahead.current = { buffer, at: now };

    const idx = typeaheadIndex(
      options.map((o) => o.label),
      buffer,
      active,
    );
    if (idx < 0) return false;
    setActive(idx);
    return true;
  };

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    // Single printable characters drive typeahead; Space stays a selection key.
    if (e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      if (typeaheadTo(e.key, e.timeStamp)) e.preventDefault();
      return;
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => Math.min(options.length - 1, a + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case 'Home':
        e.preventDefault();
        setActive(0);
        break;
      case 'End':
        e.preventDefault();
        setActive(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        choose(active);
        break;
      case 'Tab':
        setOpen(false);
        break;
    }
  };

  return (
    <div ref={rootRef} className={`ui-select ui-select--${variant}${className ? ` ${className}` : ''}`}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        className="ui-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        aria-activedescendant={open ? `${baseId}-opt-${active}` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className="ui-select__lead">
          {current?.icon ? (
            <span className="ui-select__flag" aria-hidden="true">
              {current.icon}
            </span>
          ) : null}
          <span className="ui-select__value">{current?.label ?? ''}</span>
        </span>
        <span className="ui-select__chev" aria-hidden="true">
          ▾
        </span>
      </button>
      {open ? (
        <ul
          ref={listRef}
          id={listId}
          className="ui-select__menu"
          role="listbox"
          aria-label={ariaLabel}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${baseId}-opt-${i}`}
              role="option"
              aria-selected={o.value === value}
              className={`ui-select__option${i === active ? ' is-active' : ''}${
                o.value === value ? ' is-selected' : ''
              }`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(i);
              }}
            >
              <span className="ui-select__check" aria-hidden="true">
                {o.value === value ? '✓' : ''}
              </span>
              {o.icon ? (
                <span className="ui-select__flag" aria-hidden="true">
                  {o.icon}
                </span>
              ) : null}
              <span>{o.label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
