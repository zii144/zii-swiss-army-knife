/**
 * WASM environment bridge.
 *
 * The image (jSquash) and barcode (zxing-wasm) codecs load a `.wasm` binary at
 * runtime. In a browser/worker build the bundler inlines or fetches that binary
 * automatically, so no help is needed. Under Node (our headless test runtime,
 * and the @zii/backend conversion worker) there is no fetch for a relative wasm
 * URL, so we must hand the codec the raw bytes from `node_modules`.
 *
 * These helpers detect Node and read the bytes; in the browser they return
 * `undefined`, letting each codec use its own default loader. This keeps a
 * single code path that works **in-browser, offline** and **headless in Node**.
 */

/** True when running under Node.js (vs a browser / worker). */
export function isNode(): boolean {
  return (
    typeof process !== 'undefined' &&
    process.versions != null &&
    typeof process.versions.node === 'string'
  );
}

/**
 * Read a file that ships inside an installed package, resolving it relative to
 * that package's root. Node-only; returns the raw bytes.
 *
 * `pkgName` may be the bare package name (resolved via its `package.json` when
 * the package exposes it) or any resolvable subpath/entry the package *does*
 * export — we then walk up from the resolved file to the nearest `package.json`
 * to find the package root. The second form is needed for packages (e.g.
 * zxing-wasm) whose `exports` map hides `./package.json`.
 */
export async function readPackageFile(pkgName: string, relPath: string): Promise<Uint8Array> {
  const { createRequire } = await import('node:module');
  const { readFileSync, existsSync } = await import('node:fs');
  const { dirname, join } = await import('node:path');
  const require = createRequire(import.meta.url);

  const named = (dir: string): boolean => {
    const pj = join(dir, 'package.json');
    if (!existsSync(pj)) return false;
    try {
      return (JSON.parse(readFileSync(pj, 'utf8')) as { name?: string }).name === pkgName;
    } catch {
      return false;
    }
  };

  let pkgRoot: string;
  try {
    pkgRoot = dirname(require.resolve(`${pkgName}/package.json`));
  } catch {
    // Fall back: resolve any exported entry, then walk up to the package root
    // identified by a package.json whose `name` matches (nested stub
    // package.json files like dist/cjs/package.json are skipped).
    let dir = dirname(require.resolve(pkgName));
    while (!named(dir)) {
      const parent = dirname(dir);
      if (parent === dir) throw new Error(`Cannot locate package root for "${pkgName}"`);
      dir = parent;
    }
    pkgRoot = dir;
  }

  const bytes = readFileSync(join(pkgRoot, relPath));
  return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

/** A slice-safe `ArrayBuffer` copy of `bytes` (never a SharedArrayBuffer). */
export function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}
