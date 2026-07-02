/** Optional backend base URL (`VITE_BACKEND_URL`) for convert / FX proxy routes. */
export function backendBaseUrl(): string | undefined {
  const raw = import.meta.env.VITE_BACKEND_URL;
  if (typeof raw !== 'string' || raw.trim() === '') return undefined;
  return raw.replace(/\/+$/, '');
}

/** POST bytes to the backend conversion worker; returns converted bytes. */
export async function backendConvert(
  bytes: Uint8Array,
  from: string,
  to: string,
): Promise<Uint8Array> {
  const base = backendBaseUrl();
  if (!base) {
    throw new Error(
      'Document conversion requires VITE_BACKEND_URL pointing at a deployed @zii/backend worker.',
    );
  }
  const res = await fetch(
    `${base}/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    { method: 'POST', body: bytes as unknown as BodyInit },
  );
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: string } | null;
    throw new Error(err?.error ?? `Conversion failed (${res.status})`);
  }
  return new Uint8Array(await res.arrayBuffer());
}

/** Fetch a live FX rate (backend proxy first, then Frankfurter public API). */
export async function fetchLiveFxRate(from: string, to: string): Promise<number> {
  if (from === to) return 1;
  const base = backendBaseUrl();
  if (base) {
    const res = await fetch(
      `${base}/fx?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    );
    if (res.ok) {
      const data = (await res.json()) as { rate?: number };
      if (typeof data.rate === 'number' && Number.isFinite(data.rate)) return data.rate;
    }
  }
  const res = await fetch(
    `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
  );
  if (!res.ok) throw new Error(`Could not fetch live rate (${res.status})`);
  const data = (await res.json()) as { rates?: Record<string, number> };
  const rate = data.rates?.[to];
  if (typeof rate !== 'number' || !Number.isFinite(rate)) {
    throw new Error(`No live rate for ${from}→${to}`);
  }
  return rate;
}
