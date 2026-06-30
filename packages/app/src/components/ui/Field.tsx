import type { ReactNode } from 'react';

export interface FieldProps {
  label: ReactNode;
  /** Render the label as a plain block instead of a <label> (e.g. wrapping a custom control). */
  asDiv?: boolean;
  children: ReactNode;
}

/** A label + control wrapper that gives every form row consistent spacing. */
export function Field({ label, asDiv, children }: FieldProps): React.JSX.Element {
  if (asDiv) {
    return (
      <div className="tool__field">
        <span>{label}</span>
        {children}
      </div>
    );
  }
  return (
    <label className="tool__field">
      <span>{label}</span>
      {children}
    </label>
  );
}
