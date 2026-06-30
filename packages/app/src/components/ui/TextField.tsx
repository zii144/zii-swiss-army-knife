import type { InputHTMLAttributes } from 'react';

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement>;

/** A design-consistent text/search/number input. */
export function TextField({ className, type = 'text', ...rest }: TextFieldProps): React.JSX.Element {
  return <input type={type} className={`ui-input${className ? ` ${className}` : ''}`} {...rest} />;
}
