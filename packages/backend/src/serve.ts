/**
 * Production entrypoint for @zii/backend.
 *
 * Reads env vars, wires Gotenberg + Frankfurter FX, and listens on PORT.
 * Run via `pnpm --filter @zii/backend start` (requires Gotenberg at GOTENBERG_URL).
 */
import { createBackendServer } from './server';
import { createGotenbergConverter } from './gotenberg';

const port = Number(process.env.PORT ?? '8787');
const gotenbergUrl = process.env.GOTENBERG_URL ?? 'http://127.0.0.1:3000';
const corsOrigin = process.env.CORS_ORIGIN ?? '*';

async function fetchFrankfurterRate(from: string, to: string): Promise<number> {
  const res = await fetch(
    `https://api.frankfurter.app/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
  );
  if (!res.ok) throw new Error(`Frankfurter FX failed (${res.status})`);
  const data = (await res.json()) as { rates?: Record<string, number> };
  const rate = data.rates?.[to];
  if (typeof rate !== 'number' || !Number.isFinite(rate)) {
    throw new Error(`No FX rate for ${from}→${to}`);
  }
  return rate;
}

const server = createBackendServer({
  fetchEtaRaw: async () => {
    throw new Error('ETA proxy not configured');
  },
  doConvert: createGotenbergConverter(gotenbergUrl),
  fetchFxRate: fetchFrankfurterRate,
  corsOrigin,
});

server.listen(port, () => {
  process.stdout.write(
    `@zii/backend listening on :${port} (Gotenberg ${gotenbergUrl}, CORS ${corsOrigin})\n`,
  );
});
