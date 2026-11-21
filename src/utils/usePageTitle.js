import { useEffect } from 'react';

/**
 * usePageTitle — set the document <title> from a string.
 * If `title` starts with the site name, it's preserved; otherwise the site name
 * prefix is appended. Runs only on mount and when the value changes.
 *
 * @param {string} title - The page title string
 * @param {string} [sitePrefix='SNAVYO ALBUM STUDIO'] - Brand prefix for the title
 */
export function usePageTitle(title, sitePrefix = 'SNAVYO ALBUM STUDIO') {
  useEffect(() => {
    // Guard against SSR
    if (typeof document === 'undefined') return;

    // Normalize: if the passed title already contains the prefix, keep it as-is;
    // otherwise append the prefix.
    const normalized = title.includes(sitePrefix)
      ? title
      : `${title} | ${sitePrefix}`;

    document.title = normalized;
  }, [title, sitePrefix]);
}