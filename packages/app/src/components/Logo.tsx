export interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * The Zii mark: two bars form a "Z", and the diagonal is a folding-knife blade
 * (straight spine, bellied cutting edge) pivoting from a rivet — a Swiss-army-
 * knife nod to the suite's purpose. Geometry is kept identical to public/
 * icon.svg (scaled 1/8) so the favicon and in-app mark stay consistent.
 * Bars use currentColor; the blade is the lime accent.
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
      {/* Z bars */}
      <rect x="5.5" y="5.6" width="13" height="2.75" rx="1.1" fill="currentColor" />
      <rect x="5.5" y="15.65" width="13" height="2.75" rx="1.1" fill="currentColor" />
      {/* Folding-knife blade: straight spine, bellied edge, point at lower-left */}
      <path d="M6.5 17 L18 6.75 L19.75 9.5 Q14.5 14.5 6.5 17 Z" fill="#b4e636" />
      {/* Pivot rivet at the blade's base */}
      <circle cx="18.25" cy="8.25" r="1.05" fill="currentColor" />
    </svg>
  );
}
