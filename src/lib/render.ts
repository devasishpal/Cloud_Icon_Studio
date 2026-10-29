'use client';

import type {
  BackgroundType,
  GradientPreset,
  IconShape,
  ImageAdjustments,
  ImageEffects,
  ImageFit,
  ImageInfo,
  ImageTransform,
} from '@/types';

export const RENDER_BASE = 1024;

export interface RenderConfig {
  image: ImageInfo;
  size: number;
  padding: number;
  rotation: number;
  backgroundColor: string;
  backgroundType: BackgroundType;
  gradientPreset: GradientPreset | null;
  iconShape: IconShape;
  fit: ImageFit;
  transform: ImageTransform;
  adjustments: ImageAdjustments;
  effects: ImageEffects;
  /** Draw the background fill (default true). */
  includeBackground?: boolean;
  /** Clip the artwork/background to the icon shape (default true). */
  includeShape?: boolean;
  /** Draw border/shadow (default true). */
  includeEffects?: boolean;
  /** Draw the artwork (default true). Set false for background-only layers. */
  includeArtwork?: boolean;
  /** Extra padding in percent, used for adaptive-icon safe zones. */
  extraPadding?: number;
  /** When set, render the artwork as a solid silhouette. */
  monochromeColor?: string | null;
  /** Force a background fill, used by splash/social cards. */
  backgroundOverride?: string | null;
}

export interface DrawMetrics {
  sx: number;
  sy: number;
  cx: number;
  cy: number;
  angle: number;
}

const imageCache = new Map<string, HTMLImageElement>();
const pendingLoads = new Map<string, Promise<HTMLImageElement>>();
const previewCache = new Map<string, string>();
const previewOrder: string[] = [];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** Fast, sampled content fingerprint. Data URLs of the same byte length are common. */
function contentSignature(value: string): string {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  const step = Math.max(1, Math.floor(value.length / 4096));
  for (let i = 0; i < value.length; i += step) {
    const code = value.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 16777619) >>> 0;
    h2 = Math.imul(h2 + code, 2246822519) >>> 0;
  }
  return `${value.length.toString(36)}-${h1.toString(36)}-${h2.toString(36)}`;
}

export function imageSignature(image: ImageInfo | null | undefined): string {
  const url = image?.dataUrl ?? '';
  // Include both ends as well as the sampled hash. Two PNGs of identical byte
  // length can otherwise share a signature when only the middle differs.
  return `${contentSignature(url)}:${url.length}:${url.slice(-64)}:${image?.width ?? 0}x${image?.height ?? 0}`;
}

/**
 * Drop rendered previews when the source artwork changes. Without this, a
 * signature collision (or a stale in-flight render) could briefly show the
 * previous image after an upload.
 */
export function clearPreviewCache(): void {
  previewCache.clear();
  previewOrder.length = 0;
}

export function getLoadedImage(url: string | null | undefined): HTMLImageElement | null {
  if (!url) return null;
  const img = imageCache.get(url);
  if (img && img.complete && img.naturalWidth > 0) return img;
  return null;
}

export function loadImageElement(url: string): Promise<HTMLImageElement> {
  // `img.src = null` turns into a real request for `/null`, so never start a
  // load without a source. Callers treat the rejection as "nothing to draw".
  if (!url) return Promise.reject(new Error('No image source'));
  const cached = imageCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) return Promise.resolve(cached);

  const pending = pendingLoads.get(url);
  if (pending) return pending;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      imageCache.set(url, img);
      pendingLoads.delete(url);
      // Keep the cache small – source data URLs can be large.
      if (imageCache.size > 6) {
        const first = imageCache.keys().next().value;
        if (first && first !== url) imageCache.delete(first);
      }
      resolve(img);
    };
    img.onerror = () => {
      pendingLoads.delete(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });

  pendingLoads.set(url, promise);
  return promise;
}

export function hexToRgba(hex: string, alpha: number): string {
  const value = hex.trim();
  if (value.startsWith('rgba') || value.startsWith('rgb')) {
    return value.replace(/rgba?\(([^)]+)\)/, (_m, inner) => {
      const parts = String(inner).split(',').map((p) => p.trim());
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
    });
  }
  const clean = value.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function isHexColor(value: string): boolean {
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
}

/** Build a Path2D for an icon shape in a square of `size` px. */
export function shapePath(shape: IconShape, size: number): Path2D {
  const path = new Path2D();
  const cx = size / 2;
  const cy = size / 2;

  switch (shape) {
    case 'circle':
      path.arc(cx, cy, size / 2, 0, Math.PI * 2);
      path.closePath();
      break;
    case 'rounded-square': {
      const r = size * 0.22;
      path.roundRect(0, 0, size, size, r);
      break;
    }
    case 'squircle': {
      // True superellipse (n = 4) – visually close to the iOS icon mask.
      const n = 4;
      const steps = 240;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2;
        const cos = Math.cos(t);
        const sin = Math.sin(t);
        const x = cx + Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n) * cx;
        const y = cy + Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n) * cy;
        if (i === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      }
      path.closePath();
      break;
    }
    case 'teardrop': {
      path.moveTo(0.5 * size, size);
      path.bezierCurveTo(size, size, size, 0.66 * size, size, 0.5 * size);
      path.bezierCurveTo(size, 0.2 * size, 0.8 * size, 0, 0.5 * size, 0);
      path.bezierCurveTo(0.2 * size, 0, 0, 0.2 * size, 0, 0.5 * size);
      path.bezierCurveTo(0, 0.66 * size, 0, size, 0.5 * size, size);
      path.closePath();
      break;
    }
    case 'square':
    default:
      path.rect(0, 0, size, size);
      break;
  }

  return path;
}

export function getDrawMetrics(
  image: ImageInfo,
  size: number,
  padding: number,
  extraPadding: number,
  fit: ImageFit,
  transform: ImageTransform
): DrawMetrics {
  const pad = clamp(padding + extraPadding, -49, 49);
  const content = Math.max(1, size * (1 - (pad * 2) / 100));
  const iw = Math.max(1, image.width || 1);
  const ih = Math.max(1, image.height || 1);

  let baseX: number;
  let baseY: number;
  if (fit === 'cover') {
    const s = Math.max(content / iw, content / ih);
    baseX = s;
    baseY = s;
  } else if (fit === 'stretch') {
    baseX = content / iw;
    baseY = content / ih;
  } else {
    const s = Math.min(content / iw, content / ih);
    baseX = s;
    baseY = s;
  }

  const scale = clamp(transform.scale || 1, 0.05, 20);
  return {
    sx: baseX * scale,
    sy: baseY * scale,
    cx: size / 2 + (transform.offsetX || 0) * size,
    cy: size / 2 + (transform.offsetY || 0) * size,
    angle: 0,
  };
}

function filterString(adj: ImageAdjustments, size: number): string {
  const parts: string[] = [];
  if (adj.brightness !== 100) parts.push(`brightness(${adj.brightness}%)`);
  if (adj.contrast !== 100) parts.push(`contrast(${adj.contrast}%)`);
  if (adj.saturation !== 100) parts.push(`saturate(${adj.saturation}%)`);
  if (adj.hue !== 0) parts.push(`hue-rotate(${adj.hue}deg)`);
  if (adj.blur > 0) parts.push(`blur(${(adj.blur * size) / 512}px)`);
  if (adj.grayscale > 0) parts.push(`grayscale(${adj.grayscale}%)`);
  return parts.join(' ');
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  cfg: RenderConfig,
  size: number,
  path: Path2D
) {
  const override = cfg.backgroundOverride;
  const type: BackgroundType = override ? 'solid' : cfg.backgroundType;

  if (type === 'transparent' && !override) return;

  const effects = cfg.effects;
  const drawEffects = cfg.includeEffects !== false;

  if (drawEffects && effects.shadow > 0) {
    ctx.save();
    ctx.shadowColor = hexToRgba(effects.shadowColor, 0.55);
    ctx.shadowBlur = (size * effects.shadow) / 100;
    ctx.shadowOffsetY = (size * effects.shadow) / 260;
    ctx.fillStyle = '#000000';
    if (cfg.includeShape !== false) ctx.fill(path);
    else ctx.fillRect(0, 0, size, size);
    ctx.restore();
  }

  ctx.save();
  if (cfg.includeShape !== false) ctx.clip(path);

  if (type === 'gradient' && cfg.gradientPreset) {
    const angle = (cfg.gradientPreset.angle * Math.PI) / 180;
    const dx = Math.sin(angle) * 0.5;
    const dy = -Math.cos(angle) * 0.5;
    const g = ctx.createLinearGradient(
      (0.5 - dx) * size,
      (0.5 - dy) * size,
      (0.5 + dx) * size,
      (0.5 + dy) * size
    );
    g.addColorStop(0, cfg.gradientPreset.colors[0]);
    g.addColorStop(1, cfg.gradientPreset.colors[1]);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = override || cfg.backgroundColor;
  }
  ctx.fillRect(0, 0, size, size);
  ctx.restore();
}

function drawArtwork(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cfg: RenderConfig,
  size: number
) {
  const metrics = getDrawMetrics(
    cfg.image,
    size,
    cfg.padding,
    cfg.extraPadding ?? 0,
    cfg.fit,
    cfg.transform
  );
  const w = img.naturalWidth * metrics.sx;
  const h = img.naturalHeight * metrics.sy;

  ctx.save();
  ctx.translate(metrics.cx, metrics.cy);
  ctx.rotate(((cfg.rotation || 0) * Math.PI) / 180);
  ctx.scale(cfg.effects.flipX ? -1 : 1, cfg.effects.flipY ? -1 : 1);
  ctx.globalAlpha = clamp(cfg.adjustments.opacity / 100, 0, 1);
  const filter = filterString(cfg.adjustments, size);
  if (filter) ctx.filter = filter;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

/**
 * Convert the drawn artwork to a solid silhouette.
 * Real alpha is respected; otherwise the corner colour is used as a key so
 * logos on white/coloured backgrounds still produce a clean mask.
 */
function applySilhouette(canvas: HTMLCanvasElement, color: string) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;

  let transparentPixels = 0;
  let visiblePixels = 0;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 8) {
      visiblePixels++;
      if (data[i] < 248) transparentPixels++;
    }
  }
  const hasAlpha = visiblePixels > 0 && transparentPixels / visiblePixels > 0.02;

  // Corner colour acts as the background key when the image is fully opaque.
  let keyR = data[0];
  let keyG = data[1];
  let keyB = data[2];
  if (!hasAlpha && width > 0) {
    const corner = ctx.getImageData(0, 0, 1, 1).data;
    keyR = corner[0];
    keyG = corner[1];
    keyB = corner[2];
  }

  const rgb = color.replace('#', '');
  const full = rgb.length === 3 ? rgb.split('').map((c) => c + c).join('') : rgb;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;

  for (let i = 0; i < data.length; i += 4) {
    let alpha = data[i + 3];
    if (!hasAlpha) {
      const dr = data[i] - keyR;
      const dg = data[i + 1] - keyG;
      const db = data[i + 2] - keyB;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      alpha = clamp((dist / 90) * 255, 0, 255);
    }
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = alpha;
  }
  ctx.putImageData(new ImageData(data, width, height), 0, 0);
}

export function drawIcon(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  cfg: RenderConfig
) {
  const size = cfg.size;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, size, size);
  const path = shapePath(cfg.iconShape, size);

  if (cfg.monochromeColor) {
    const temp = document.createElement('canvas');
    temp.width = size;
    temp.height = size;
    const tctx = temp.getContext('2d');
    if (!tctx) return;
    if (cfg.includeShape !== false) {
      tctx.save();
      tctx.clip(path);
    }
    drawArtwork(tctx, img, cfg, size);
    if (cfg.includeShape !== false) tctx.restore();
    applySilhouette(temp, cfg.monochromeColor);
    ctx.drawImage(temp, 0, 0);
    return;
  }

  if (cfg.includeBackground !== false) drawBackground(ctx, cfg, size, path);

  if (cfg.includeArtwork !== false) {
    ctx.save();
    if (cfg.includeShape !== false) ctx.clip(path);
    drawArtwork(ctx, img, cfg, size);
    ctx.restore();
  }

  const effects = cfg.effects;
  if (cfg.includeEffects !== false && effects.borderWidth > 0 && cfg.includeShape !== false) {
    ctx.save();
    ctx.clip(path);
    ctx.lineWidth = Math.max(1, (size * effects.borderWidth) / 100) * 2;
    ctx.strokeStyle = effects.borderColor;
    ctx.stroke(path);
    ctx.restore();
  }
}

export async function renderIcon(config: RenderConfig): Promise<HTMLCanvasElement> {
  if (!config.image?.dataUrl) throw new Error('No artwork to render');
  const img = await loadImageElement(config.image.dataUrl);
  const canvas = document.createElement('canvas');
  drawIcon(canvas, img, config);
  return canvas;
}

export function renderIconSync(config: RenderConfig): HTMLCanvasElement | null {
  const img = getLoadedImage(config.image.dataUrl);
  if (!img) return null;
  const canvas = document.createElement('canvas');
  drawIcon(canvas, img, config);
  return canvas;
}

function cacheKey(config: RenderConfig): string {
  const signature = imageSignature(config.image);
  return [
    signature,
    config.size,
    config.padding,
    config.rotation,
    config.backgroundColor,
    config.backgroundType,
    config.gradientPreset ? `${config.gradientPreset.colors[0]}-${config.gradientPreset.colors[1]}-${config.gradientPreset.angle}` : 'none',
    config.iconShape,
    config.fit,
    config.transform.scale,
    config.transform.offsetX,
    config.transform.offsetY,
    config.adjustments.brightness,
    config.adjustments.contrast,
    config.adjustments.saturation,
    config.adjustments.hue,
    config.adjustments.blur,
    config.adjustments.grayscale,
    config.adjustments.opacity,
    config.effects.shadow,
    config.effects.shadowColor,
    config.effects.borderWidth,
    config.effects.borderColor,
    config.effects.flipX ? 1 : 0,
    config.effects.flipY ? 1 : 0,
    config.includeBackground === false ? 0 : 1,
    config.includeShape === false ? 0 : 1,
    config.includeEffects === false ? 0 : 1,
    config.includeArtwork === false ? 0 : 1,
    config.extraPadding ?? 0,
    config.monochromeColor ?? '',
    config.backgroundOverride ?? '',
  ].join('|');
}

export async function renderIconDataUrl(config: RenderConfig): Promise<string> {
  const key = cacheKey(config);
  const cached = previewCache.get(key);
  if (cached) return cached;

  const canvas = await renderIcon(config);
  const url = canvas.toDataURL('image/png');
  previewCache.set(key, url);
  previewOrder.push(key);
  if (previewOrder.length > 24) {
    const oldest = previewOrder.shift();
    if (oldest) previewCache.delete(oldest);
  }
  return url;
}

export function renderIconDataUrlSync(config: RenderConfig): string | null {
  const key = cacheKey(config);
  const cached = previewCache.get(key);
  if (cached) return cached;
  const canvas = renderIconSync(config);
  if (!canvas) return null;
  const url = canvas.toDataURL('image/png');
  previewCache.set(key, url);
  previewOrder.push(key);
  if (previewOrder.length > 24) {
    const oldest = previewOrder.shift();
    if (oldest) previewCache.delete(oldest);
  }
  return url;
}

/**
 * Map a point in the (0..1, 0..1) icon frame back to source-image pixels.
 * Used by the crop tool so rotation and padding are accounted for.
 */
export function frameToSourcePoint(
  u: number,
  v: number,
  cfg: RenderConfig,
  frameSize = 512
): { x: number; y: number } {
  const metrics = getDrawMetrics(
    cfg.image,
    frameSize,
    cfg.padding,
    cfg.extraPadding ?? 0,
    cfg.fit,
    cfg.transform
  );
  const px = u * frameSize - metrics.cx;
  const py = v * frameSize - metrics.cy;
  const rad = (-(cfg.rotation || 0) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const rx = px * cos - py * sin;
  const ry = px * sin + py * cos;
  return {
    x: rx / metrics.sx + cfg.image.width / 2,
    y: ry / metrics.sy + cfg.image.height / 2,
  };
}
