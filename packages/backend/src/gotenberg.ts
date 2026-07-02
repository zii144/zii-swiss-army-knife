/**
 * Gotenberg (LibreOffice) conversion adapter for {@link createBackendServer}.
 *
 * Supports office → PDF via `POST /forms/libreoffice/convert`. PDF → Word is
 * attempted through the same LibreOffice pipeline; quality depends on the
 * Gotenberg/LibreOffice version — many deployments only guarantee office → PDF.
 */
import type { ConvertRequest, DoConvert } from './convert';

const INPUT_EXT: Record<string, string> = {
  docx: 'docx',
  pptx: 'pptx',
  pdf: 'pdf',
  xlsx: 'xlsx',
  odt: 'odt',
};

const OUTPUT_EXT: Record<string, string> = {
  pdf: 'pdf',
  docx: 'docx',
  pptx: 'pptx',
};

const MIME: Record<string, string> = {
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};

/** Routes this adapter knows how to attempt. */
export const GOTENBERG_ROUTES: ReadonlyArray<readonly [string, string]> = [
  ['docx', 'pdf'],
  ['pptx', 'pdf'],
  ['xlsx', 'pdf'],
  ['pdf', 'docx'],
];

function routeKey(from: string, to: string): string {
  return `${from.toLowerCase()}:${to.toLowerCase()}`;
}

function isSupportedRoute(from: string, to: string): boolean {
  const key = routeKey(from, to);
  return GOTENBERG_ROUTES.some(([f, t]) => routeKey(f, t) === key);
}

/**
 * Build a {@link DoConvert} worker that streams bytes through a Gotenberg
 * instance (LibreOffice route). `baseUrl` is the Gotenberg root, e.g.
 * `http://localhost:3000`.
 */
export function createGotenbergConverter(baseUrl: string): DoConvert {
  const base = baseUrl.replace(/\/+$/, '');

  return async (req: ConvertRequest): Promise<Uint8Array> => {
    const from = req.from.toLowerCase();
    const to = req.to.toLowerCase();
    if (!isSupportedRoute(from, to)) {
      throw new RangeError(`Unsupported conversion: ${from} → ${to}`);
    }

    const inExt = INPUT_EXT[from] ?? from;
    const outExt = OUTPUT_EXT[to] ?? to;
    const form = new FormData();
    form.append(
      'files',
      new Blob([req.bytes as unknown as BlobPart], {
        type: MIME[from] ?? 'application/octet-stream',
      }),
      `input.${inExt}`,
    );

    const res = await fetch(`${base}/forms/libreoffice/convert`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(
        `Gotenberg convert failed (${res.status})${detail ? `: ${detail.slice(0, 200)}` : ''}`,
      );
    }

    const out = new Uint8Array(await res.arrayBuffer());
    if (to === 'pdf') return out;

    // LibreOffice → PDF is the primary Gotenberg route; reverse exports vary.
    const ct = res.headers.get('content-type') ?? '';
    if (to === 'docx' && !ct.includes('word') && !ct.includes('octet-stream')) {
      throw new Error(
        'PDF → Word export is not available from this Gotenberg build. ' +
          'Use office → PDF routes or add a dedicated LibreOffice export worker.',
      );
    }
    if (outExt === 'docx' && out.byteLength > 4) {
      // DOCX is a ZIP (PK..); PDF starts with %PDF
      if (out[0] === 0x25 && out[1] === 0x50) {
        throw new Error(
          'Gotenberg returned PDF instead of DOCX for this route. ' +
            'Configure a LibreOffice export worker for PDF → Word.',
        );
      }
    }
    return out;
  };
}
