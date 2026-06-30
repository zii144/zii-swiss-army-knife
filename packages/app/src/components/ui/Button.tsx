import type { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'ghost';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Show a spinner before the label and mark the button busy. */
  loading?: boolean;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'ui-btn ui-btn--primary',
  ghost: 'ui-btn ui-btn--ghost',
};

/** A design-consistent button. `primary` = lime pill, `ghost` = outline pill. */
export function Button({
  variant = 'primary',
  type = 'button',
  className,
  loading = false,
  children,
  ...rest
}: ButtonProps): React.JSX.Element {
  return (
    <button
      type={type}
      className={`${VARIANT_CLASS[variant]}${className ? ` ${className}` : ''}`}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="ui-spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
