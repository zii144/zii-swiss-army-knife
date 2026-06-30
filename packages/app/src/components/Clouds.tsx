/**
 * Decorative cloud/fog layer behind the hero. Built from SVG fractal noise
 * (feTurbulence) for real wispy fog with visible edges. Each layer lives in its
 * own HTML <div> (not an SVG <g>) so the gentle drift animates reliably across
 * browsers — WebKit doesn't animate CSS transforms on SVG groups. Purely visual.
 */
export function Clouds(): React.JSX.Element {
  return (
    <div className="clouds" aria-hidden="true">
      <div className="clouds__layer clouds__far">
        <svg className="clouds__svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <filter id="zii-fog-far" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.013 0.02"
                numOctaves={3}
                seed={23}
                stitchTiles="stitch"
                result="n"
              />
              <feComponentTransfer in="n">
                <feFuncR type="linear" slope={0} intercept={1} />
                <feFuncG type="linear" slope={0} intercept={1} />
                <feFuncB type="linear" slope={0} intercept={1} />
                <feFuncA type="table" tableValues="0 0 0 0.15 0.5 0.85" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation={1.2} />
            </filter>
            <linearGradient id="zii-wisp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.12" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="0.34" stopColor="#fff" stopOpacity="0.45" />
              <stop offset="0.52" stopColor="#fff" stopOpacity="0" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="zii-wisp-mask">
              <rect x="-220" y="0" width="1880" height="900" fill="url(#zii-wisp)" />
            </mask>
          </defs>
          <rect
            x="-220"
            y="0"
            width="1880"
            height="900"
            filter="url(#zii-fog-far)"
            mask="url(#zii-wisp-mask)"
          />
        </svg>
      </div>
      <div className="clouds__layer clouds__near">
        <svg className="clouds__svg" viewBox="0 0 1440 900" preserveAspectRatio="none">
          <defs>
            <filter id="zii-fog-near" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.006 0.011"
                numOctaves={4}
                seed={7}
                stitchTiles="stitch"
                result="n"
              />
              <feComponentTransfer in="n">
                <feFuncR type="linear" slope={0} intercept={1} />
                <feFuncG type="linear" slope={0} intercept={1} />
                <feFuncB type="linear" slope={0} intercept={1} />
                <feFuncA type="table" tableValues="0 0 0.05 0.35 0.8 1 1" />
              </feComponentTransfer>
              <feGaussianBlur stdDeviation={2} />
            </filter>
            <linearGradient id="zii-band" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.72" stopColor="#fff" stopOpacity="1" />
              <stop offset="0.92" stopColor="#fff" stopOpacity="0.7" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="zii-band-mask">
              <rect x="-220" y="0" width="1880" height="900" fill="url(#zii-band)" />
            </mask>
          </defs>
          <rect
            x="-220"
            y="0"
            width="1880"
            height="900"
            filter="url(#zii-fog-near)"
            mask="url(#zii-band-mask)"
          />
        </svg>
      </div>
    </div>
  );
}
