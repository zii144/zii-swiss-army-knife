import type { TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Use a monospace font (for code / data). */
  mono?: boolean;
}

/** A design-consistent multi-line text input. */
export function TextArea({ className, mono, ...rest }: TextAreaProps): React.JSX.Element {
  const cls = `ui-textarea${mono ? ' ui-textarea--mono' : ''}${className ? ` ${className}` : ''}`;
  return <textarea className={cls} {...rest} />;
}
