'use client';

/**
 * Minimal, dependency-free ICO and ICNS encoders.
 *
 * Both formats accept embedded PNG payloads, so the shared canvas renderer can
 * produce every size once and the containers simply index those PNGs. This is
 * exactly how modern icon tooling (and `iconutil`) builds these files.
 */

export interface EncodedImage {
  size: number;
  blob: Blob;
}

/** Build a multi-resolution Windows .ico from PNG blobs. */
export async function encodeIco(images: EncodedImage[]): Promise<Blob> {
  const entries = [...images].sort((a, b) => a.size - b.size);
  const payloads = await Promise.all(entries.map((entry) => entry.blob.arrayBuffer()));

  const headerSize = 6 + entries.length * 16;
  const totalSize = headerSize + payloads.reduce((sum, buffer) => sum + buffer.byteLength, 0);
  const out = new Uint8Array(totalSize);
  const view = new DataView(out.buffer);

  // ICONDIR
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // 1 = icon
  view.setUint16(4, entries.length, true);

  let directoryOffset = 6;
  let dataOffset = headerSize;

  for (let i = 0; i < entries.length; i++) {
    const { size } = entries[i];
    const payload = payloads[i];
    const dimension = size >= 256 ? 0 : size;

    out[directoryOffset] = dimension; // width
    out[directoryOffset + 1] = dimension; // height
    out[directoryOffset + 2] = 0; // palette colours
    out[directoryOffset + 3] = 0; // reserved
    view.setUint16(directoryOffset + 4, 1, true); // colour planes
    view.setUint16(directoryOffset + 6, 32, true); // bits per pixel
    view.setUint32(directoryOffset + 8, payload.byteLength, true);
    view.setUint32(directoryOffset + 12, dataOffset, true);

    out.set(new Uint8Array(payload), dataOffset);

    directoryOffset += 16;
    dataOffset += payload.byteLength;
  }

  return new Blob([out], { type: 'image/x-icon' });
}

/**
 * OSType codes for the sizes macOS expects. Larger sizes are also registered
 * as the @2x variants (ic11–ic14) so Finder and older tools pick them up.
 */
const ICNS_TYPES: Record<number, string[]> = {
  16: ['icp4'],
  32: ['icp5', 'ic11'],
  64: ['icp6', 'ic12'],
  128: ['ic07'],
  256: ['ic08', 'ic13'],
  512: ['ic09', 'ic14'],
  1024: ['ic10'],
};

/** Build a macOS .icns container from PNG blobs. */
export async function encodeIcns(images: EncodedImage[]): Promise<Blob> {
  const unique = new Map<number, EncodedImage>();
  for (const image of images) {
    if (!unique.has(image.size)) unique.set(image.size, image);
  }

  const chunks: Uint8Array[] = [];
  let totalSize = 8;

  for (const [size, image] of [...unique.entries()].sort((a, b) => a[0] - b[0])) {
    const types = ICNS_TYPES[size];
    if (!types) continue;
    const payload = new Uint8Array(await image.blob.arrayBuffer());

    for (const type of types) {
      const chunk = new Uint8Array(8 + payload.byteLength);
      const view = new DataView(chunk.buffer);
      for (let i = 0; i < 4; i++) chunk[i] = type.charCodeAt(i);
      view.setUint32(4, chunk.byteLength, false); // big-endian
      chunk.set(payload, 8);
      chunks.push(chunk);
      totalSize += chunk.byteLength;
    }
  }

  const out = new Uint8Array(totalSize);
  const view = new DataView(out.buffer);
  out[0] = 0x69; // i
  out[1] = 0x63; // c
  out[2] = 0x6e; // n
  out[3] = 0x73; // s
  view.setUint32(4, totalSize, false);

  let offset = 8;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return new Blob([out], { type: 'image/icns' });
}

/** Convert a Blob to a base64 data URL (used for embedded SVG previews). */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(new Error('Could not read blob'));
    reader.readAsDataURL(blob);
  });
}
