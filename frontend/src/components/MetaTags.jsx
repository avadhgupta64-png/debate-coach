import { useEffect } from 'react';

export default function MetaTags({ title, description, url, image }) {
  useEffect(() => {
    const resolvedUrl = url || window.location.href;
    const resolvedImage = image || 'https://debate-coach-zeta.vercel.app/og-image.png';
    const resolvedTitle = title || 'Debate Coach';
    const resolvedDesc = description || 'AI-powered debate training and practice platform';

    document.title = resolvedTitle;

    // ── description ──────────────────────────────────────────────────────────
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', resolvedDesc);

    // ── canonical <link> ─────────────────────────────────────────────────────
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', resolvedUrl);

    // ── Open Graph ───────────────────────────────────────────────────────────
    const updateOgTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOgTag('og:title', resolvedTitle);
    updateOgTag('og:description', resolvedDesc);
    updateOgTag('og:url', resolvedUrl);
    updateOgTag('og:image', resolvedImage);

    // ── Twitter ──────────────────────────────────────────────────────────────
    const updateNameTag = (name, content) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateNameTag('twitter:title', resolvedTitle);
    updateNameTag('twitter:description', resolvedDesc);
    updateNameTag('twitter:image', resolvedImage);
  }, [title, description, url, image]);

  return null;
}
