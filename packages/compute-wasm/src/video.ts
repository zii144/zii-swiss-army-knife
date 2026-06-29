/**
 * Video transcode, powered by ffmpeg.wasm (`@ffmpeg/ffmpeg`, MIT; ships the
 * LGPL FFmpeg build — no GPL encoders).
 *
 * ffmpeg.wasm is multi-threaded and therefore must run in a
 * **cross-origin-isolated** (COOP/COEP) context with `SharedArrayBuffer`. That
 * is the `isolated: true` route in the app shell. It cannot run in a plain Node
 * process, so headless callers (tests, the @zii/backend conversion worker)
 * should use the server-side ffmpeg fallback instead — this module detects the
 * environment and fails loudly with that guidance rather than pretending.
 */
import type { ImageFormat } from './image';

/** True only in a browser context that can host multi-threaded ffmpeg.wasm. */
export function canRunFfmpegWasm(): boolean {
  return (
    typeof globalThis !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).crossOriginIsolated === true &&
    typeof SharedArrayBuffer !== 'undefined'
  );
}

/** Options for {@link convertVideo}. */
export interface ConvertVideoOptions {
  /** Output container/codec, e.g. "mp4", "webm". */
  to: string;
  /** Input filename hint (extension matters to ffmpeg), e.g. "in.mov". */
  inputName?: string;
  /** Extra ffmpeg CLI args inserted before the output file. */
  args?: string[];
}

/**
 * Transcode a video fully on-device with ffmpeg.wasm. Throws an actionable
 * error when the runtime cannot host it (e.g. Node, or a non-isolated page),
 * directing the caller to the server-side conversion worker.
 */
export async function convertVideo(
  input: Uint8Array,
  opts: ConvertVideoOptions,
): Promise<Uint8Array> {
  if (!canRunFfmpegWasm()) {
    throw new Error(
      'video-convert (ffmpeg.wasm) requires a cross-origin-isolated browser context ' +
        'with SharedArrayBuffer. In Node or a non-isolated page, use the @zii/backend ' +
        'conversion worker (server-side ffmpeg) instead.',
    );
  }
  const { FFmpeg } = await import('@ffmpeg/ffmpeg');
  const ff = new FFmpeg();
  await ff.load();
  const inName = opts.inputName ?? 'input';
  const outName = `output.${opts.to}`;
  await ff.writeFile(inName, input);
  await ff.exec([...(opts.args ?? ['-i', inName]), outName]);
  const data = await ff.readFile(outName);
  return typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data);
}

/** Re-export so the op table can reference the still-image formats too. */
export type { ImageFormat };
