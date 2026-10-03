import { useEffect, useState } from 'react';

/**
 * Probes whether the resume PDF is actually deployed.
 *
 * The file is added after the redesign, so the Resume button stays hidden until
 * this resolves true — no 404, and no link to a missing asset.
 * See the TODO(moulendra) note on `meta.resume` in data/portfolio.js.
 */
export function useAssetAvailable(path) {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    if (!path) return undefined;

    let cancelled = false;
    const controller = new AbortController();

    fetch(path, { method: 'HEAD', signal: controller.signal })
      .then((response) => {
        if (!cancelled) setAvailable(response.ok);
      })
      .catch(() => {
        if (!cancelled) setAvailable(false);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [path]);

  return available;
}