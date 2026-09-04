import { useEffect } from 'react';

export default function MetaTags({ title, description, url, image }) {
  useEffect(() => {
    document.title = title || 'Debate Coach';

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description || 'AI-powered debate training and practice platform');

    const updateOgTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOgTag('og:title', title || 'Debate Coach');
    updateOgTag('og:description', description || 'AI-powered debate training and practice platform');
    updateOgTag('og:url', url || window.location.href);
    updateOgTag('og:image', image || 'https://debate-coach-zeta.vercel.app/og-image.png');

    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', title || 'Debate Coach');

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.setAttribute('content', description || 'AI-powered debate training and practice platform');

    let twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (!twitterImage) {
      twitterImage = document.createElement('meta');
      twitterImage.setAttribute('name', 'twitter:image');
      document.head.appendChild(twitterImage);
    }
    twitterImage.setAttribute('content', image || 'https://debate-coach-zeta.vercel.app/og-image.png');
  }, [title, description, url, image]);

  return null;
}
