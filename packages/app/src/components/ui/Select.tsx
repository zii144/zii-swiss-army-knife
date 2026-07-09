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

/**
 * An accessible custom dropdown that fully replaces the native <select> so the
 * open menu matches the app's glass design. Supports keyboard navigation
 * (Arrow/Home/End/Enter/Esc), click-outside, and aria-activedescendant.
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

  const current = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    setActive(selectedIndex);
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

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
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
        className="ui-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
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
        <ul ref={listRef} className="ui-select__menu" role="listbox" aria-label={ariaLabel}>
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
