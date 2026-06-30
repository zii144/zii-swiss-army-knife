export interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * The Zii monogram mark: two bars (currentColor) joined by a lime diagonal,
 * forming a stylized "Z". Sits inside the white brand tile.
 */
export function Logo({ size = 24, className }: LogoProps): React.JSX.Element {
  return (
    <svg
      className={`zlogo${className ? ` ${className}` : ''}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="5" y="5" width="14" height="3.4" rx="1.2" fill="currentColor" />
      <rect x="5" y="15.6" width="14" height="3.4" rx="1.2" fill="currentColor" />
      <path d="M16.6 7 L7.4 17" stroke="#b4e636" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}
