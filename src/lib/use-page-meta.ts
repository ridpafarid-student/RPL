import { useEffect } from 'react';

/**
 * Lightweight SEO hook — sets document title and meta description.
 * Replaces react-helmet-async (incompatible with React 19).
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    const suffix = 'Bogornesia';
    document.title = title ? `${title} — ${suffix}` : suffix;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);
}
