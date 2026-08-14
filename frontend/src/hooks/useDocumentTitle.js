import { useEffect } from 'react';

/**
 * Sets document.title for the current page.
 * Falls back to the base title if no title is provided.
 *
 * @param {string} title - Page-specific title (e.g. "Start a Debate")
 * @param {string} [suffix] - Brand suffix appended after " | " (default: "Debate Coach")
 */
export function useDocumentTitle(title, suffix = 'Debate Coach') {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | ${suffix}` : suffix;
    return () => {
      document.title = prev;
    };
  }, [title, suffix]);
}
