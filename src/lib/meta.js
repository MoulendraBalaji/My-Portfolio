/**
 * Applies the `meta` block from `src/data/portfolio.js` to the document.
 *
 * `index.html` carries the same values as static markup, because most crawlers
 * and social scrapers do not execute JavaScript. This keeps the two from
 * drifting apart when the content changes.
 */

function setMeta(selector, attrs) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    document.head.appendChild(tag);
  }
  for (const [name, value] of Object.entries(attrs)) {
    if (value) tag.setAttribute(name, value);
  }
}

export function applyMeta(meta) {
  if (typeof document === 'undefined') return;

  document.title = meta.title;

  setMeta('meta[name="description"]', { name: 'description', content: meta.description });
  setMeta('meta[name="theme-color"]', { name: 'theme-color', content: meta.themeColor });

  setMeta('meta[property="og:title"]', { property: 'og:title', content: meta.title });
  setMeta('meta[property="og:description"]', {
    property: 'og:description',
    content: meta.description
  });
  setMeta('meta[property="og:url"]', { property: 'og:url', content: meta.canonical });
  if (meta.ogImage) {
    const absolute = new URL(meta.ogImage, meta.canonical).href;
    setMeta('meta[property="og:image"]', { property: 'og:image', content: absolute });
    setMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: absolute });
  }
  setMeta('meta[property="og:image:alt"]', {
    property: 'og:image:alt',
    content: meta.ogImageAlt
  });
  setMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
  setMeta('meta[name="twitter:description"]', {
    name: 'twitter:description',
    content: meta.description
  });

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = meta.canonical;
}