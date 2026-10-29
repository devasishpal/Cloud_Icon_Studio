'use client';

import { loadImageElement } from '@/lib/render';

export interface NormalizedImage {
  dataUrl: string;
  width: number;
  height: number;
}

function canvasToPng(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

/**
 * Fast path for large bitmaps. `createImageBitmap` downscales in the decoder
 * and is dramatically quicker than a JS resampler on 3000px+ sources.
 */
async function rasterizeWithBitmap(
  img: HTMLImageElement,
  width: number,
  height: number
): Promise<HTMLCanvasElement | null> {
  if (typeof createImageBitmap !== 'function') return null;
  try {
    const bitmap = await createImageBitmap(img, {
      resizeWidth: width,
      resizeHeight: height,
      resizeQuality: 'high',
    });
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close?.();
      return null;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();
    return canvas;
  } catch {
    return null;
  }
}

/**
 * High-quality resampler for browsers without bitmap resize support. Pica is
 * kept on a timeout because a stalled worker must never block an upload.
 */
async function rasterizeWithPica(
  img: HTMLImageElement,
  width: number,
  height: number
): Promise<HTMLCanvasElement | null> {
  if (typeof Worker === 'undefined') return null;
  try {
    const { default: Pica } = await import('pica');
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const pica = new Pica();
    await Promise.race([
      pica.resize(img, canvas, {
        unsharpAmount: 80,
        unsharpRadius: 0.6,
        unsharpThreshold: 2,
      }),
      new Promise((_, reject) => {
        window.setTimeout(() => reject(new Error('Pica resize timed out')), 5000);
      }),
    ]);
    return canvas;
  } catch {
    return null;
  }
}

function rasterizeNative(
  img: HTMLImageElement,
  width: number,
  height: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, width, height);
  }
  return canvas;
}

/**
 * Turns any accepted upload into a predictable PNG data URL.
 * SVGs are rasterised (so browsers without intrinsic SVG sizing behave) and
 * very large bitmaps are capped to a sane working resolution.
 */
export async function normalizeUpload(file: File, dataUrl: string): Promise<NormalizedImage> {
  const isSvg = file.type === 'image/svg+xml' || /^data:image\/svg\+xml/i.test(dataUrl);
  const maxSide = 2048;

  let sourceUrl = dataUrl;
  let objectUrl: string | null = null;

  if (isSvg) {
    try {
      let text = await file.text();
      const viewBoxMatch = text.match(/viewBox=["']([^"']+)["']/i);
      const hasWidth = /<svg[^>]*\swidth=["'][^"']+["']/i.test(text);
      const hasHeight = /<svg[^>]*\sheight=["'][^"']+["']/i.test(text);
      if ((!hasWidth || !hasHeight) && viewBoxMatch) {
        const parts = viewBoxMatch[1].trim().split(/[\s,]+/).map(Number);
        const vw = parts[2] || 1024;
        const vh = parts[3] || 1024;
        text = text.replace(/<svg/i, `<svg width="${vw}" height="${vh}"`);
      }
      const blob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
      objectUrl = URL.createObjectURL(blob);
      sourceUrl = objectUrl;
    } catch {
      // Fall back to the original data URL.
    }
  }

  try {
    const img = await loadImageElement(sourceUrl);
    let width = img.naturalWidth || 0;
    let height = img.naturalHeight || 0;

    if (!width || !height) {
      width = 1024;
      height = 1024;
    }

    const needsRaster = isSvg || width > maxSide || height > maxSide || !img.naturalWidth;
    if (!needsRaster) {
      return { dataUrl, width, height };
    }

    const scale = Math.min(1, maxSide / Math.max(width, height));
    const outW = Math.max(1, Math.round(width * scale));
    const outH = Math.max(1, Math.round(height * scale));

    // Try the fastest path first, then the quality path with a hard timeout,
    // and always finish with the native canvas so an upload cannot hang.
    const canvas =
      (await rasterizeWithBitmap(img, outW, outH)) ??
      (await rasterizeWithPica(img, outW, outH)) ??
      rasterizeNative(img, outW, outH);

    return { dataUrl: canvasToPng(canvas), width: outW, height: outH };
  } finally {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  return {
    r: parseInt(full.slice(0, 2), 16) || 0,
    g: parseInt(full.slice(2, 4), 16) || 0,
    b: parseInt(full.slice(4, 6), 16) || 0,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('')}`;
}

export async function sampleCornerColor(dataUrl: string): Promise<string> {
  const img = await loadImageElement(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = 8;
  canvas.height = 8;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, 8, 8);
  const data = ctx.getImageData(0, 0, 8, 8).data;
  // Average the four extreme corners for a stable key colour.
  const points = [0, 7, 56, 63];
  let r = 0, g = 0, b = 0, count = 0;
  for (const p of points) {
    const i = p * 4;
    if (data[i + 3] < 8) continue;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }
  if (!count) return '#ffffff';
  return rgbToHex(r / count, g / count, b / count);
}

/**
 * Chroma-key background removal. Tolerance is 0–100.
 * Returns a new PNG data URL with matching pixels made transparent.
 */
export async function removeBackground(
  dataUrl: string,
  keyColor: string,
  tolerance: number
): Promise<string> {
  const img = await loadImageElement(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const key = hexToRgb(keyColor);
  const threshold = Math.max(1, (tolerance / 100) * 441.7);
  const feather = Math.max(12, threshold * 0.45);

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    const dr = data[i] - key.r;
    const dg = data[i + 1] - key.g;
    const db = data[i + 2] - key.b;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);
    if (dist <= threshold) {
      data[i + 3] = 0;
    } else if (dist < threshold + feather) {
      const t = (dist - threshold) / feather;
      data[i + 3] = Math.round(data[i + 3] * Math.min(1, t));
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvasToPng(canvas);
}

/**
 * Small, deterministic palette extractor (median-cut style bucketing).
 * No network or heavy dependency – runs in a few milliseconds.
 */
export async function extractPalette(dataUrl: string, count = 6): Promise<string[]> {
  const img = await loadImageElement(dataUrl);
  const size = 96;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 180) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // Ignore near-white / near-black noise, which rarely makes a good accent.
    if (max > 250 && min > 250) continue;
    if (max < 8) continue;
    const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.n += 1;
    } else {
      buckets.set(key, { r, g, b, n: 1 });
    }
  }

  const sorted = [...buckets.values()].sort((a, b) => b.n - a.n);
  const colors: string[] = [];
  for (const bucket of sorted) {
    const hex = rgbToHex(bucket.r / bucket.n, bucket.g / bucket.n, bucket.b / bucket.n);
    const rgb = hexToRgb(hex);
    const tooClose = colors.some((existing) => {
      const other = hexToRgb(existing);
      const dr = rgb.r - other.r;
      const dg = rgb.g - other.g;
      const db = rgb.b - other.b;
      return Math.sqrt(dr * dr + dg * dg + db * db) < 42;
    });
    if (!tooClose) colors.push(hex);
    if (colors.length >= count) break;
  }

  return colors;
}

/** Crop a source image to a pixel rectangle and return a new PNG data URL. */
export async function cropSourceImage(
  dataUrl: string,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<NormalizedImage> {
  const img = await loadImageElement(dataUrl);
  const sx = Math.max(0, Math.min(img.naturalWidth - 1, Math.round(x)));
  const sy = Math.max(0, Math.min(img.naturalHeight - 1, Math.round(y)));
  const sw = Math.max(1, Math.min(img.naturalWidth - sx, Math.round(width)));
  const sh = Math.max(1, Math.min(img.naturalHeight - sy, Math.round(height)));

  const canvas = document.createElement('canvas');
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
  return { dataUrl: canvasToPng(canvas), width: sw, height: sh };
}
