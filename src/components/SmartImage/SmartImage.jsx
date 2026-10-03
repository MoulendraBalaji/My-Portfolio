import { useState } from 'react';

import './SmartImage.css';

/**
 * Image with a graceful fallback.
 *
 * The real asset files are supplied after the redesign, so every slot renders a
 * styled gradient plate with initials until the file lands — and again if it
 * fails to load. A broken-image icon is never shown.
 *
 * `ratio` reserves the box up front (no CLS), `priority` is used only for the
 * hero portrait, and decorative images should pass `alt=""`.
 */
export default function SmartImage({
  src,
  alt = '',
  ratio = '16 / 10',
  width,
  height,
  sizes,
  priority = false,
  className = '',
  fallbackText = '',
  children
}) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div className={`smart-image ${className}`.trim()} style={{ aspectRatio: ratio }}>
      {showFallback ? (
        <div className="smart-image__fallback" aria-hidden={alt ? undefined : 'true'}>
          <span className="smart-image__initials" aria-hidden="true">
            {fallbackText || alt || 'MB'}
          </span>
          {alt ? <span className="smart-image__alt">{alt}</span> : null}
        </div>
      ) : (
        <img
          className="smart-image__img"
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? undefined : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          // Only the hero portrait gets fetch priority.
          fetchPriority={priority ? 'high' : undefined}
          onError={() => setFailed(true)}
        />
      )}
      {children}
    </div>
  );
}