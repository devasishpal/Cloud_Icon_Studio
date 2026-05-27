'use client';

import type { ImageInfo, BackgroundType, GradientPreset, IconShape } from '@/types';

export interface ProcessedIcon {
  name: string;
  size: number;
  blob: Blob;
  dataUrl: string;
}

export type ProcessingTask =
  | { platform: 'android'; step: string; done: number; total: number }
  | { platform: 'ios'; step: string; done: number; total: number }
  | { platform: 'web'; step: string; done: number; total: number }
  | { platform: 'desktop'; step: string; done: number; total: number };

type ProgressCallback = (task: { platform: string; step: string; done: number; total: number }) => void;

function drawShapeClip(ctx: CanvasRenderingContext2D, shape: IconShape, size: number) {
  const cx = size / 2, cy = size / 2, r = size / 2;
  ctx.beginPath();
  switch (shape) {
    case 'circle':
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
    case 'squircle': {
      const rr = size * 0.3;
      ctx.roundRect(0, 0, size, size, rr);
      break;
    }
    case 'rounded-square': {
      const rr = size * 0.22;
      ctx.roundRect(0, 0, size, size, rr);
      break;
    }
    case 'teardrop':
      ctx.moveTo(cx, size);
      ctx.bezierCurveTo(size, size, size, cy + r * 0.3, size, cy);
      ctx.bezierCurveTo(size, cy * 0.2, cx + r * 0.8, cy - r, cx, cy - r);
      ctx.bezierCurveTo(cx - r * 0.8, cy - r, 0, cy * 0.2, 0, cy);
      ctx.bezierCurveTo(0, cy + r * 0.3, 0, size, cx, size);
      break;
  }
  ctx.closePath();
}

export function renderMasterCanvas(
  image: ImageInfo,
  padding: number,
  backgroundColor: string,
  rotation: number,
  backgroundType: BackgroundType = 'solid',
  gradientPreset: GradientPreset | null = null,
  iconShape: IconShape | null = null,
  size: number = 1024
): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      if (iconShape) {
        ctx.save();
        drawShapeClip(ctx, iconShape, size);
        ctx.clip();
      }

      if (backgroundType === 'transparent') {
        // transparent — no fill
      } else if (backgroundType === 'gradient' && gradientPreset) {
        const angle = gradientPreset.angle;
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad), sin = Math.sin(rad);
        const g = ctx.createLinearGradient(
          0.5 - cos * 0.5, 0.5 - sin * 0.5,
          0.5 + cos * 0.5, 0.5 + sin * 0.5
        );
        g.addColorStop(0, gradientPreset.colors[0]);
        g.addColorStop(1, gradientPreset.colors[1]);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
      } else {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, size, size);
      }

      const padRatio = padding / 100;
      const drawSize = size * (1 - padRatio);
      const scale = Math.min(drawSize / img.naturalWidth, drawSize / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;

      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();

      if (iconShape) {
        ctx.restore();
      }

      resolve(canvas);
    };
    img.onerror = reject;
    img.src = image.dataUrl!;
  });
}

function fastResize(
  source: HTMLCanvasElement,
  width: number,
  height: number
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = width > 180 ? 'high' : 'medium';
  ctx.drawImage(source, 0, 0, width, height);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
}

export async function resizeWithPica(
  source: HTMLCanvasElement | HTMLImageElement | Blob,
  width: number,
  height: number
): Promise<Blob> {
  if (width <= 180 && source instanceof HTMLCanvasElement) {
    return fastResize(source, width, height);
  }

  let sourceCanvas: HTMLCanvasElement;
  if (source instanceof Blob) {
    const img = await createImageBitmap(source);
    sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = img.width;
    sourceCanvas.height = img.height;
    sourceCanvas.getContext('2d')!.drawImage(img, 0, 0);
    img.close();
  } else if (source instanceof HTMLCanvasElement) {
    sourceCanvas = source;
  } else {
    sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = source.naturalWidth;
    sourceCanvas.height = source.naturalHeight;
    sourceCanvas.getContext('2d')!.drawImage(source, 0, 0);
  }

  if (width <= 512) {
    return fastResize(sourceCanvas, width, height);
  }

  const pica = (await import('pica')).default;
  const resizer = pica();

  const dest = document.createElement('canvas');
  dest.width = width;
  dest.height = height;

  await resizer.resize(sourceCanvas, dest, {
    filter: 'lanczos2',
    unsharpAmount: 40,
    unsharpRadius: 0.4,
    unsharpThreshold: 1,
  });

  return new Promise((resolve) => dest.toBlob((b) => resolve(b!), 'image/png'));
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function renderFullIcon(master: HTMLCanvasElement, size: number): Promise<Blob> {
  return resizeWithPica(master, size, size);
}

async function renderForegroundOnly(
  image: ImageInfo,
  padding: number,
  rotation: number,
  size: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;
      const cx = size / 2, cy = size / 2;
      const padRatio = padding / 100;
      const drawSize = size * (1 - padRatio);
      const scale = Math.min(drawSize / img.naturalWidth, drawSize / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -w / 2, -h / 2, w, h);
      ctx.restore();
      canvas.toBlob((b) => resolve(b!), 'image/png');
    };
    img.onerror = reject;
    img.src = image.dataUrl!;
  });
}

const ANDROID_DENSITIES = [
  { dir: 'mipmap-ldpi', size: 36 },
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

export async function generateAndroidIcons(
  masterCanvas: HTMLCanvasElement,
  image: ImageInfo,
  padding: number,
  rotation: number,
  onProgress: ProgressCallback
): Promise<{ path: string; blob: Blob }[]> {
  const results: { path: string; blob: Blob }[] = [];

  for (let i = 0; i < ANDROID_DENSITIES.length; i++) {
    const d = ANDROID_DENSITIES[i];
    const tot = ANDROID_DENSITIES.length * 3 + 3;

    // ic_launcher.png — full icon (background + shape + image)
    onProgress({ platform: 'android', step: `${d.dir}/ic_launcher.png`, done: i * 3, total: tot });
    results.push({ path: `android/${d.dir}/ic_launcher.png`, blob: await renderFullIcon(masterCanvas, d.size) });

    // ic_launcher_round.png — same full icon clipped to circle
    onProgress({ platform: 'android', step: `${d.dir}/ic_launcher_round.png`, done: i * 3 + 1, total: tot });
    const roundCanvas = document.createElement('canvas');
    roundCanvas.width = d.size;
    roundCanvas.height = d.size;
    const rctx = roundCanvas.getContext('2d')!;
    rctx.beginPath();
    rctx.arc(d.size / 2, d.size / 2, d.size / 2, 0, Math.PI * 2);
    rctx.clip();
    rctx.drawImage(masterCanvas, 0, 0, d.size, d.size);
    const roundBlob = await new Promise<Blob>((r) => roundCanvas.toBlob((b) => r(b!), 'image/png'));
    results.push({ path: `android/${d.dir}/ic_launcher_round.png`, blob: roundBlob });

    // ic_launcher_foreground.png — foreground only (no background, no shape)
    onProgress({ platform: 'android', step: `${d.dir}/ic_launcher_foreground.png`, done: i * 3 + 2, total: tot });
    results.push({ path: `android/${d.dir}/ic_launcher_foreground.png`, blob: await renderForegroundOnly(image, padding, rotation, d.size) });
  }

  // Root-level files
  const rootIdx = ANDROID_DENSITIES.length * 3;
  const tot = ANDROID_DENSITIES.length * 3 + 3;

  // playstore-icon.png
  onProgress({ platform: 'android', step: 'playstore-icon.png', done: rootIdx, total: tot });
  results.push({ path: 'android/playstore-icon.png', blob: await renderFullIcon(masterCanvas, 512) });

  // ic_launcher-web.png
  onProgress({ platform: 'android', step: 'ic_launcher-web.png', done: rootIdx + 1, total: tot });
  results.push({ path: 'android/ic_launcher-web.png', blob: await renderFullIcon(masterCanvas, 512) });

  return results;
}

export function generateAdaptiveIconXmls(): { path: string; content: string }[] {
  const xml = (name: string) => `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`;
  return [
    { path: 'android/mipmap-anydpi-v26/ic_launcher.xml', content: xml('ic_launcher') },
    { path: 'android/mipmap-anydpi-v26/ic_launcher_round.xml', content: xml('ic_launcher_round') },
  ];
}

export function generateBackgroundColorXml(backgroundColor: string): { path: string; content: string } {
  const color = backgroundColor.replace('#', '');
  return {
    path: 'android/values/ic_launcher_background.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#${color}</color>
</resources>`,
  };
}

export async function generateAndroidAdaptiveImages(
  masterCanvas: HTMLCanvasElement,
  backgroundColor: string,
  onProgress: ProgressCallback
): Promise<{ path: string; blob: Blob }[]> {
  onProgress({ platform: 'android', step: 'adaptive-foreground', done: 0, total: 2 });

  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = 108;
  bgCanvas.height = 108;
  const bgCtx = bgCanvas.getContext('2d')!;
  bgCtx.fillStyle = backgroundColor;
  bgCtx.beginPath();
  bgCtx.arc(54, 54, 48, 0, Math.PI * 2);
  bgCtx.fill();
  const bgBlob = await new Promise<Blob>((r) => bgCanvas.toBlob((b) => r(b!), 'image/png'));

  onProgress({ platform: 'android', step: 'adaptive-background', done: 1, total: 2 });
  const fgBlob = await resizeWithPica(masterCanvas, 108, 108);

  return [
    { path: 'Android/mipmap-anydpi-v26/ic_launcher_background.png', blob: bgBlob },
    { path: 'Android/mipmap-anydpi-v26/ic_launcher_foreground.png', blob: fgBlob },
  ];
}

export async function generateAndroidMonochrome(
  masterCanvas: HTMLCanvasElement
): Promise<{ path: string; blob: Blob }> {
  const canvas = document.createElement('canvas');
  canvas.width = 108;
  canvas.height = 108;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(masterCanvas, 0, 0, 108, 108);
  const imageData = ctx.getImageData(0, 0, 108, 108);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }
  ctx.putImageData(imageData, 0, 0);
  const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), 'image/png'));
  return { path: 'android/mipmap-anydpi-v26/ic_launcher_monochrome.png', blob };
}

function iosFilename(size: string, scale: string): string {
  const s = size.replace('x', 'x');
  return `Icon-App-${s}@${scale}.png`;
}

function scaleSize(size: number, scale: string): number {
  const m = parseFloat(scale.replace('x', ''));
  return Math.round(size * m);
}

const iOS_ENTRIES = [
  { size: '20x20', idiom: 'iphone', scale: '2x' },
  { size: '20x20', idiom: 'iphone', scale: '3x' },
  { size: '29x29', idiom: 'iphone', scale: '1x' },
  { size: '29x29', idiom: 'iphone', scale: '2x' },
  { size: '29x29', idiom: 'iphone', scale: '3x' },
  { size: '40x40', idiom: 'iphone', scale: '2x' },
  { size: '40x40', idiom: 'iphone', scale: '3x' },
  { size: '60x60', idiom: 'iphone', scale: '2x' },
  { size: '60x60', idiom: 'iphone', scale: '3x' },
  { size: '20x20', idiom: 'ipad', scale: '1x' },
  { size: '20x20', idiom: 'ipad', scale: '2x' },
  { size: '29x29', idiom: 'ipad', scale: '1x' },
  { size: '29x29', idiom: 'ipad', scale: '2x' },
  { size: '40x40', idiom: 'ipad', scale: '1x' },
  { size: '40x40', idiom: 'ipad', scale: '2x' },
  { size: '76x76', idiom: 'ipad', scale: '1x' },
  { size: '76x76', idiom: 'ipad', scale: '2x' },
  { size: '83.5x83.5', idiom: 'ipad', scale: '2x' },
  { size: '1024x1024', idiom: 'ios-marketing', scale: '1x' },
];

export async function generateiOSIcons(
  masterCanvas: HTMLCanvasElement,
  onProgress: ProgressCallback
): Promise<{ path: string; blob: Blob }[]> {
  const results: { path: string; blob: Blob }[] = [];
  const batch = (start: number, end: number) => {
    const promises: Promise<void>[] = [];
    for (let i = start; i < end && i < iOS_ENTRIES.length; i++) {
      const e = iOS_ENTRIES[i];
      const px = scaleSize(parseFloat(e.size.split('x')[0]), e.scale);
      const fname = iosFilename(e.size, e.scale);
      onProgress({ platform: 'ios', step: fname, done: i, total: iOS_ENTRIES.length + 3 });
      promises.push(
        new Promise<void>((resolve) => {
          setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = px;
            canvas.height = px;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(masterCanvas, 0, 0, px, px);
            canvas.toBlob((blob) => {
              results.push({ path: `iOS/AppIcon.appiconset/${fname}`, blob: blob! });
              resolve();
            }, 'image/png');
          }, 0);
        })
      );
    }
    return Promise.all(promises);
  };
  await batch(0, 7);
  await batch(7, iOS_ENTRIES.length);

  // iTunesArtwork at root level
  const itunesSizes = [
    { file: 'iTunesArtwork@1x.png', size: 512 },
    { file: 'iTunesArtwork@2x.png', size: 1024 },
    { file: 'iTunesArtwork@3x.png', size: 3072 },
  ];
  for (let i = 0; i < itunesSizes.length; i++) {
    const s = itunesSizes[i];
    const idx = iOS_ENTRIES.length + i;
    onProgress({ platform: 'ios', step: s.file, done: idx, total: iOS_ENTRIES.length + 3 });
    const canvas = document.createElement('canvas');
    canvas.width = s.size;
    canvas.height = s.size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(masterCanvas, 0, 0, s.size, s.size);
    const blob = await new Promise<Blob>((r) => canvas.toBlob((b) => r(b!), 'image/png'));
    results.push({ path: `iOS/${s.file}`, blob });
  }

  return results;
}

export function generateiOSContentsJson(): { path: string; content: string } {
  const images = iOS_ENTRIES.map((e) => ({
    size: e.size,
    idiom: e.idiom,
    filename: iosFilename(e.size, e.scale),
    scale: e.scale,
  }));
  images.push({ size: '1024x1024', idiom: 'ios-marketing', filename: 'ItunesArtwork@2x.png', scale: '1x' });
  const contents = {
    images,
    info: { author: 'CloudIcon Studio', version: 1 },
  };
  return { path: 'iOS/AppIcon.appiconset/Contents.json', content: JSON.stringify(contents, null, 2) };
}

export async function generateWebIcons(
  masterCanvas: HTMLCanvasElement,
  onProgress: ProgressCallback
): Promise<{ path: string; blob: Blob }[]> {
  const sizes = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'favicon-48x48.png', size: 48 },
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'android-chrome-192x192.png', size: 192 },
    { file: 'android-chrome-512x512.png', size: 512 },
  ];

  const results: { path: string; blob: Blob }[] = [];
  for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i];
    onProgress({ platform: 'web', step: s.file, done: i, total: sizes.length });
    const blob = await resizeWithPica(masterCanvas, s.size, s.size);
    results.push({ path: `Web/${s.file}`, blob });
  }

  return results;
}

export function generateWebManifest(): { path: string; content: string } {
  const manifest = {
    name: 'CloudIcon Studio App',
    short_name: 'CloudIcon',
    icons: [
      { src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    theme_color: '#7C3AED',
    background_color: '#09090B',
    display: 'standalone',
  };
  return { path: 'Web/site.webmanifest', content: JSON.stringify(manifest, null, 2) };
}

export function generateBrowserConfig(): { path: string; content: string } {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="mstile-150x150.png"/>
            <TileColor>#7C3AED</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
  return { path: 'Web/browserconfig.xml', content: xml };
}

export async function generateDesktopIcons(
  masterCanvas: HTMLCanvasElement,
  onProgress: ProgressCallback
): Promise<{ path: string; blob: Blob }[]> {
  const sizes = [
    { file: 'windows-tile.png', size: 150 },
    { file: 'macos-dock.png', size: 128 },
    { file: 'linux-launcher.png', size: 256 },
  ];

  const results: { path: string; blob: Blob }[] = [];
  for (let i = 0; i < sizes.length; i++) {
    const s = sizes[i];
    onProgress({ platform: 'desktop', step: s.file, done: i, total: sizes.length });
    const blob = await resizeWithPica(masterCanvas, s.size, s.size);
    results.push({ path: `Desktop/${s.file}`, blob });
  }

  return results;
}

export type ExportPreset = 'full' | 'android' | 'ios' | 'web' | 'pwa' | 'desktop' | 'minimal';

export const EXPORT_PRESETS: Record<ExportPreset, { label: string; description: string; icon: string }> = {
  full: { label: 'Full Pack', description: 'All platforms + all sizes', icon: 'Package' },
  android: { label: 'Android Only', description: 'Mipmap, adaptive, monochrome', icon: 'Smartphone' },
  ios: { label: 'iOS Only', description: 'All Apple sizes + Contents.json', icon: 'Apple' },
  web: { label: 'Web Only', description: 'Favicons, PWA icons, manifest', icon: 'Globe' },
  pwa: { label: 'PWA Pack', description: 'PWA icons, manifest, browser config', icon: 'Monitor' },
  desktop: { label: 'Desktop Only', description: 'Windows, macOS, Linux icons', icon: 'Monitor' },
  minimal: { label: 'Minimal Pack', description: 'Essential sizes only', icon: 'FileDown' },
};

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function runExportPreset(
  preset: ExportPreset,
  image: ImageInfo,
  padding: number,
  backgroundColor: string,
  rotation: number,
  backgroundType: BackgroundType = 'solid',
  gradientPreset: GradientPreset | null = null,
  iconShape: IconShape = 'squircle',
  onProgress: (task: { platform: string; step: string; done: number; total: number }) => void
): Promise<{ files: { path: string; blob: Blob }[]; texts: { path: string; content: string }[] }> {
  const masterCanvas = await renderMasterCanvas(image, padding, backgroundColor, rotation, backgroundType, gradientPreset, iconShape);
  const files: { path: string; blob: Blob }[] = [];
  const texts: { path: string; content: string }[] = [];

  const notify = (platform: string, step: string, done: number, total: number) => {
    onProgress({ platform, step, done, total });
  };

  if (preset === 'full' || preset === 'android') {
    const androidFiles = await generateAndroidIcons(masterCanvas, image, padding, rotation, (t) => notify(t.platform, t.step, t.done, t.total));
    files.push(...androidFiles);

    const xmls = generateAdaptiveIconXmls();
    texts.push(...xmls);

    texts.push(generateBackgroundColorXml(backgroundColor));

    const mono = await generateAndroidMonochrome(masterCanvas);
    files.push(mono);
  }

  if (preset === 'full' || preset === 'ios') {
    const iosFiles = await generateiOSIcons(masterCanvas, (t) => notify(t.platform, t.step, t.done, t.total));
    files.push(...iosFiles);
    texts.push(generateiOSContentsJson());
  }

  if (preset === 'full' || preset === 'web' || preset === 'pwa') {
    const webFiles = await generateWebIcons(masterCanvas, (t) => notify(t.platform, t.step, t.done, t.total));
    files.push(...webFiles);
    texts.push(generateWebManifest());
    texts.push(generateBrowserConfig());
  }

  if (preset === 'full' || preset === 'desktop') {
    const desktopFiles = await generateDesktopIcons(masterCanvas, (t) => notify(t.platform, t.step, t.done, t.total));
    files.push(...desktopFiles);
  }

  if (preset === 'minimal') {
    const essentials = [
      { file: 'favicon-32x32.png', size: 32 },
      { file: 'apple-touch-icon.png', size: 180 },
      { file: 'android-chrome-192x192.png', size: 192 },
      { file: 'android-chrome-512x512.png', size: 512 },
      { file: 'AppIcon-1024.png', size: 1024 },
    ];
    for (let i = 0; i < essentials.length; i++) {
      const s = essentials[i];
      notify('web', s.file, i, essentials.length);
      const blob = await resizeWithPica(masterCanvas, s.size, s.size);
      files.push({ path: `Minimal/${s.file}`, blob });
    }
  }

  return { files, texts };
}
