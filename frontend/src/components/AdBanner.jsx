import { useEffect, useRef } from 'react';

/**
 * AdBanner — compact Google AdSense unit for bottom-of-page placement.
 *
 * Publisher:  ca-pub-1862354369797932
 * Ad slot:    3717826644
 *
 * Design goals:
 *  - No reserved height: if AdSense doesn't fill the slot the container
 *    stays at zero height and leaves no blank gap.
 *  - A ref guard ensures adsbygoogle.push() is called exactly once per
 *    mounted instance, even under React Strict Mode double-invoke.
 *  - try/catch swallows errors when the script is blocked or not yet loaded.
 */
export default function AdBanner() {
  const insRef = useRef(null);
  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn('[AdBanner] adsbygoogle.push failed:', err);
    }
  }, []);

  return (
    /*
     * overflow:hidden + min-height:0 means the wrapper contributes zero
     * height when AdSense returns no ad, preventing the blank-space problem.
     * The subtle top border and muted label make it feel intentional when
     * an ad does load, without a large reserved block.
     */
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        minHeight: 0,
        borderTop: '1px solid var(--color-border)',
      }}
      aria-label="Advertisement"
    >
      <div
        className="container"
        style={{
          padding: '0 var(--space-lg)',
          textAlign: 'center',
        }}
      >
        {/* Tiny label — only visible when an ad actually renders */}
        <p
          style={{
            fontSize: '0.65rem',
            color: 'var(--color-text-muted)',
            opacity: 0.5,
            marginBottom: 4,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Advertisement
        </p>
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1862354369797932"
          data-ad-slot="3717826644"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
