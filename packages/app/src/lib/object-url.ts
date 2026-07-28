import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Owns the lifecycle of a preview `blob:` URL.
 *
 * Every image/QR tool held its preview in plain state and revoked the previous
 * URL by hand before creating the next one. That covered re-runs but not
 * unmount — and tool views unmount on every navigation, so the last result of
 * each tool stayed allocated for the life of the page. For tools whose output
 * is a multi-megabyte image that is a real leak, and it is the same six lines
 * repeated in seven files.
 *
 * Returns the current URL (or `null`) and a setter that takes a Blob: it
 * revokes whatever it replaces, and the hook revokes the last one on unmount.
 */
export function useObjectUrl(): [string | null, (blob: Blob | null) => void] {
  const [url, setUrl] = useState<string | null>(null);
  // Mirrors `url` so cleanup can read the latest value without re-subscribing.
  const current = useRef<string | null>(null);

  const show = useCallback((blob: Blob | null): void => {
    if (current.current) URL.revokeObjectURL(current.current);
    const next = blob ? URL.createObjectURL(blob) : null;
    current.current = next;
    setUrl(next);
  }, []);

  useEffect(
    () => () => {
      if (current.current) URL.revokeObjectURL(current.current);
      current.current = null;
    },
    [],
  );

  return [url, show];
}
