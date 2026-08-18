import { useEffect, useRef } from 'react';

/**
 * AdBanner — renders a single Google AdSense unit.
 *
 * Publisher:  ca-pub-1862354369797932
 * Ad slot:    3717826644
 *
 * Safety guarantees:
 *  - A ref tracks whether the push has already been called for this
 *    particular <ins> element, preventing double-initialisation on
 *    React strict-mode double-invocation or component re-renders.
 *  - The push is guarded by a try/catch so a missing / not-yet-loaded
 *    adsbygoogle script never throws an unhandled error.
 */
export default function AdBanner() {
  const insRef = useRef(null);
  const initialised = useRef(false);

  useEffect(() => {
    // Only push once per mounted instance.
    if (initialised.current) return;
    initialised.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // AdSense script not yet loaded or blocked — silently ignore.
      console.warn('[AdBanner] adsbygoogle.push failed:', err);
    }
  }, []);

  return (
    <div
      style={{
        width: '100%',
        overflow: 'hidden',
        /* Subtle container so the ad area looks intentional in dark mode */
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}
      aria-label="Advertisement"
    >
      <div className="container" style={{ padding: 'var(--space-sm) var(--space-lg)' }}>
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
