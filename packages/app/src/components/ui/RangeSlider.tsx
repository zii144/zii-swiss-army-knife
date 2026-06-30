import type { InputHTMLAttributes } from 'react';

export type RangeSliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** A design-consistent range slider (lime accent). */
export function RangeSlider({ className, ...rest }: RangeSliderProps): React.JSX.Element {
  return <input type="range" className={`ui-range${className ? ` ${className}` : ''}`} {...rest} />;
}
