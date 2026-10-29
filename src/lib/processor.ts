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
import { renderIcon, type RenderConfig } from '@/lib/render';
import { encodeIco, encodeIcns, blobToBase64 } from '@/lib/icon-encoders';
import { SOCIAL_SIZES, SPLASH_SIZES } from '@/lib/constants';

/** Everything the shared renderer needs to reproduce the editor canvas. */
export interface RenderSettings {
  image: ImageInfo;
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
}

export interface ExportFile {
  path: string;
  blob: Blob;
}

export interface ExportText {
  path: string;
  content: string;
}

interface ExportFileJob {
  path: string;
  render: () => Promise<Blob>;
}

export interface ExportPlan {
  files: ExportFileJob[];
  texts: ExportText[];
  total: number;
}

type ProgressCallback = (task: {
  platform: string;
  step: string;
  done: number;
  total: number;
}) => void;

export type ExportPreset =
  | 'full'
  | 'android'
  | 'ios'
  | 'web'
  | 'pwa'
  | 'desktop'
  | 'splash'
  | 'social'
  | 'minimal';

export const EXPORT_PRESETS: Record<
  ExportPreset,
  { label: string; description: string; icon: string }
> = {
  full: { label: 'Full Pack', description: 'Every platform, size and asset', icon: 'Package' },
  android: { label: 'Android', description: 'Mipmaps, adaptive, monochrome', icon: 'Smartphone' },
  ios: { label: 'iOS', description: 'AppIcon set + Contents.json', icon: 'Apple' },
  web: { label: 'Web', description: 'Favicons, PWA, ICO + manifest', icon: 'Globe' },
  pwa: { label: 'PWA Pack', description: 'Install icons + manifest', icon: 'Monitor' },
  desktop: { label: 'Desktop', description: 'Windows, macOS, Linux + ICO/ICNS', icon: 'Monitor' },
  splash: { label: 'Splash Screens', description: 'iOS launch screens for every device', icon: 'Images' },
  social: { label: 'Social Cards', description: 'Open Graph & social preview images', icon: 'Image' },
  minimal: { label: 'Minimal', description: 'The six files you actually need', icon: 'FileDown' },
};

const ANDROID_LEGACY = [
  { dir: 'mipmap-ldpi', size: 36 },
  { dir: 'mipmap-mdpi', size: 48 },
  { dir: 'mipmap-hdpi', size: 72 },
  { dir: 'mipmap-xhdpi', size: 96 },
  { dir: 'mipmap-xxhdpi', size: 144 },
  { dir: 'mipmap-xxxhdpi', size: 192 },
];

const ANDROID_FOREGROUND = [
  { dir: 'mipmap-mdpi', size: 108 },
  { dir: 'mipmap-hdpi', size: 162 },
  { dir: 'mipmap-xhdpi', size: 216 },
  { dir: 'mipmap-xxhdpi', size: 324 },
  { dir: 'mipmap-xxxhdpi', size: 432 },
];

const ANDROID_NOTIFICATION = [
  { dir: 'drawable-ldpi', size: 18 },
  { dir: 'drawable-mdpi', size: 24 },
  { dir: 'drawable-hdpi', size: 36 },
  { dir: 'drawable-xhdpi', size: 48 },
  { dir: 'drawable-xxhdpi', size: 72 },
  { dir: 'drawable-xxxhdpi', size: 96 },
];

const IOS_ENTRIES: { size: string; idiom: string; scale: string; filename: string }[] = [
  { size: '20x20', idiom: 'iphone', scale: '2x', filename: 'Icon-App-20x20@2x.png' },
  { size: '20x20', idiom: 'iphone', scale: '3x', filename: 'Icon-App-20x20@3x.png' },
  { size: '29x29', idiom: 'iphone', scale: '1x', filename: 'Icon-App-29x29@1x.png' },
  { size: '29x29', idiom: 'iphone', scale: '2x', filename: 'Icon-App-29x29@2x.png' },
  { size: '29x29', idiom: 'iphone', scale: '3x', filename: 'Icon-App-29x29@3x.png' },
  { size: '40x40', idiom: 'iphone', scale: '2x', filename: 'Icon-App-40x40@2x.png' },
  { size: '40x40', idiom: 'iphone', scale: '3x', filename: 'Icon-App-40x40@3x.png' },
  { size: '60x60', idiom: 'iphone', scale: '2x', filename: 'Icon-App-60x60@2x.png' },
  { size: '60x60', idiom: 'iphone', scale: '3x', filename: 'Icon-App-60x60@3x.png' },
  { size: '20x20', idiom: 'ipad', scale: '1x', filename: 'Icon-App-20x20@1x~ipad.png' },
  { size: '20x20', idiom: 'ipad', scale: '2x', filename: 'Icon-App-20x20@2x~ipad.png' },
  { size: '29x29', idiom: 'ipad', scale: '1x', filename: 'Icon-App-29x29@1x~ipad.png' },
  { size: '29x29', idiom: 'ipad', scale: '2x', filename: 'Icon-App-29x29@2x~ipad.png' },
  { size: '40x40', idiom: 'ipad', scale: '1x', filename: 'Icon-App-40x40@1x~ipad.png' },
  { size: '40x40', idiom: 'ipad', scale: '2x', filename: 'Icon-App-40x40@2x~ipad.png' },
  { size: '76x76', idiom: 'ipad', scale: '1x', filename: 'Icon-App-76x76@1x~ipad.png' },
  { size: '76x76', idiom: 'ipad', scale: '2x', filename: 'Icon-App-76x76@2x~ipad.png' },
  { size: '83.5x83.5', idiom: 'ipad', scale: '2x', filename: 'Icon-App-83.5x83.5@2x~ipad.png' },
  { size: '1024x1024', idiom: 'ios-marketing', scale: '1x', filename: 'Icon-App-1024x1024@1x.png' },
];

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Could not encode canvas'));
    }, 'image/png');
  });
}

function buildConfig(
  settings: RenderSettings,
  size: number,
  overrides: Partial<RenderConfig> = {}
): RenderConfig {
  return {
    image: settings.image,
    size,
    padding: settings.padding,
    rotation: settings.rotation,
    backgroundColor: settings.backgroundColor,
    backgroundType: settings.backgroundType,
    gradientPreset: settings.gradientPreset,
    iconShape: settings.iconShape,
    fit: settings.fit,
    transform: settings.transform,
    adjustments: settings.adjustments,
    effects: settings.effects,
    ...overrides,
  };
}

function settingsSignature(settings: RenderSettings): string {
  const image = settings.image;
  return JSON.stringify({
    image: `${image.dataUrl?.length ?? 0}:${image.dataUrl?.slice(0, 32) ?? ''}:${image.width}x${image.height}`,
    padding: settings.padding,
    rotation: settings.rotation,
    backgroundColor: settings.backgroundColor,
    backgroundType: settings.backgroundType,
    gradient: settings.gradientPreset,
    shape: settings.iconShape,
    fit: settings.fit,
    transform: settings.transform,
    adjustments: settings.adjustments,
    effects: settings.effects,
  });
}

const blobCache = new Map<string, Promise<Blob>>();

function renderBlob(
  settings: RenderSettings,
  size: number,
  overrides: Partial<RenderConfig> = {}
): Promise<Blob> {
  const key = `${settingsSignature(settings)}|${size}|${JSON.stringify(overrides)}`;
  const cached = blobCache.get(key);
  if (cached) return cached;

  const promise = renderIcon(buildConfig(settings, size, overrides)).then(canvasToBlob);
  blobCache.set(key, promise);
  if (blobCache.size > 220) {
    const oldest = blobCache.keys().next().value;
    if (oldest) blobCache.delete(oldest);
  }
  return promise;
}

function opaqueOverride(settings: RenderSettings): string | null {
  return settings.backgroundType === 'transparent' ? settings.backgroundColor : null;
}

function hexLuminance(hex: string): number {
  const clean = hex.replace('#', '').trim();
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean.padEnd(6, '0').slice(0, 6);
  const channels = [0, 2, 4].map((offset) => {
    const value = (parseInt(full.slice(offset, offset + 2), 16) || 0) / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function cardTextColor(settings: RenderSettings): string {
  const colors = settings.gradientPreset?.colors ?? [settings.backgroundColor, settings.backgroundColor];
  const luminance = (hexLuminance(colors[0]) + hexLuminance(colors[1])) / 2;
  return luminance > 0.45 ? '#0b0b12' : '#ffffff';
}

async function renderCard(
  settings: RenderSettings,
  width: number,
  height: number,
  appName?: string
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available');

  // Background layer – cover-fit the same gradient/solid used by the icon.
  const bgSize = 1024;
  const background = await renderIcon(
    buildConfig(settings, bgSize, {
      includeArtwork: false,
      includeShape: false,
      includeEffects: false,
      backgroundType: settings.backgroundType === 'transparent' ? 'solid' : settings.backgroundType,
      backgroundOverride: settings.backgroundType === 'transparent' ? settings.backgroundColor : null,
    })
  );
  const scale = Math.max(width / bgSize, height / bgSize);
  const drawWidth = bgSize * scale;
  const drawHeight = bgSize * scale;
  ctx.drawImage(background, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);

  const iconSize = Math.round(Math.min(width, height) * (appName ? 0.3 : 0.34));
  const icon = await renderIcon(
    buildConfig(settings, iconSize, { includeEffects: false })
  );
  const iconX = (width - iconSize) / 2;
  const iconY = appName ? (height - iconSize) / 2 - height * 0.045 : (height - iconSize) / 2;

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.35)';
  ctx.shadowBlur = iconSize * 0.09;
  ctx.shadowOffsetY = iconSize * 0.045;
  ctx.drawImage(icon, iconX, iconY);
  ctx.restore();

  if (appName) {
    const fontSize = Math.round(Math.min(width, height) * 0.062);
    ctx.font = `600 ${fontSize}px "Outfit", system-ui, -apple-system, "Segoe UI", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = cardTextColor(settings);
    ctx.fillText(appName, width / 2, iconY + iconSize + height * 0.055);
  }

  return canvasToBlob(canvas);
}

/* -------------------------------------------------------------------------- */
/* Platform plans                                                             */
/* -------------------------------------------------------------------------- */

function androidPlan(settings: RenderSettings): { files: ExportFileJob[]; texts: ExportText[] } {
  const files: ExportFileJob[] = [];

  for (const density of ANDROID_LEGACY) {
    files.push({
      path: `android/${density.dir}/ic_launcher.png`,
      render: () => renderBlob(settings, density.size),
    });
    files.push({
      path: `android/${density.dir}/ic_launcher_round.png`,
      render: () => renderBlob(settings, density.size, { iconShape: 'circle' }),
    });
  }

  for (const density of ANDROID_FOREGROUND) {
    files.push({
      path: `android/${density.dir}/ic_launcher_foreground.png`,
      render: () =>
        renderBlob(settings, density.size, {
          includeBackground: false,
          includeShape: false,
          includeEffects: false,
          extraPadding: 19.5,
        }),
    });
  }

  for (const density of ANDROID_NOTIFICATION) {
    files.push({
      path: `android/${density.dir}/ic_notification.png`,
      render: () =>
        renderBlob(settings, density.size, {
          includeBackground: false,
          includeShape: false,
          includeEffects: false,
          monochromeColor: '#ffffff',
        }),
    });
  }

  files.push({
    path: 'android/playstore-icon.png',
    render: () => renderBlob(settings, 512, { iconShape: 'square' }),
  });
  files.push({
    path: 'android/ic_launcher-web.png',
    render: () => renderBlob(settings, 512),
  });
  files.push({
    path: 'android/mipmap-anydpi-v26/ic_launcher_background.png',
    render: () =>
      renderBlob(settings, 432, {
        includeArtwork: false,
        includeShape: false,
        includeEffects: false,
        backgroundOverride:
          settings.backgroundType === 'transparent' ? '#00000000' : null,
      }),
  });
  files.push({
    path: 'android/mipmap-anydpi-v26/ic_launcher_monochrome.png',
    render: () =>
      renderBlob(settings, 432, {
        includeBackground: false,
        includeShape: false,
        includeEffects: false,
        extraPadding: 19.5,
        monochromeColor: '#ffffff',
      }),
  });

  const adaptiveIcon = (withMonochrome: boolean) => `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>${
      withMonochrome
        ? '\n    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>'
        : ''
    }
</adaptive-icon>`;

  const texts: ExportText[] = [
    {
      path: 'android/mipmap-anydpi-v26/ic_launcher.xml',
      content: adaptiveIcon(false),
    },
    {
      path: 'android/mipmap-anydpi-v26/ic_launcher_round.xml',
      content: adaptiveIcon(false),
    },
    {
      path: 'android/mipmap-anydpi-v33/ic_launcher.xml',
      content: adaptiveIcon(true),
    },
    {
      path: 'android/mipmap-anydpi-v33/ic_launcher_round.xml',
      content: adaptiveIcon(true),
    },
    {
      path: 'android/values/ic_launcher_background.xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">${settings.backgroundColor}</color>
</resources>`,
    },
  ];

  return { files, texts };
}

function iosPlan(settings: RenderSettings): { files: ExportFileJob[]; texts: ExportText[] } {
  const files: ExportFileJob[] = IOS_ENTRIES.map((entry) => {
    const pixels = Math.round(parseFloat(entry.size) * parseFloat(entry.scale));
    return {
      path: `iOS/AppIcon.appiconset/${entry.filename}`,
      render: () =>
        renderBlob(settings, pixels, {
          iconShape: 'square',
          includeEffects: false,
          backgroundOverride: opaqueOverride(settings),
        }),
    };
  });

  const contents = {
    images: IOS_ENTRIES.map((entry) => ({
      size: entry.size,
      idiom: entry.idiom,
      filename: entry.filename,
      scale: entry.scale,
    })),
    info: { author: 'xcode', version: 1 },
  };

  return {
    files,
    texts: [
      {
        path: 'iOS/AppIcon.appiconset/Contents.json',
        content: JSON.stringify(contents, null, 2),
      },
    ],
  };
}

function webManifest(settings: RenderSettings, appName: string): ExportText {
  const name = appName || 'CloudIcon';
  const shortName = name.length > 12 ? name.slice(0, 12) : name;
  const manifest = {
    name,
    short_name: shortName,
    description: `${name} — generated with CloudIcon Studio`,
    start_url: '/',
    display: 'standalone',
    background_color: settings.backgroundColor,
    theme_color: settings.backgroundColor,
    icons: [
      { src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return { path: 'web/site.webmanifest', content: JSON.stringify(manifest, null, 2) };
}

function browserConfig(settings: RenderSettings): ExportText {
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="mstile-150x150.png"/>
            <TileColor>${settings.backgroundColor}</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
  return { path: 'web/browserconfig.xml', content: xml };
}

function webPlan(settings: RenderSettings, appName: string): { files: ExportFileJob[]; texts: ExportText[] } {
  const squareOpaque = {
    iconShape: 'square' as const,
    includeEffects: false,
    backgroundOverride: opaqueOverride(settings),
  };

  const files: ExportFileJob[] = [
    { path: 'web/favicon-16x16.png', render: () => renderBlob(settings, 16) },
    { path: 'web/favicon-32x32.png', render: () => renderBlob(settings, 32) },
    { path: 'web/favicon-48x48.png', render: () => renderBlob(settings, 48) },
    { path: 'web/apple-touch-icon.png', render: () => renderBlob(settings, 180, squareOpaque) },
    { path: 'web/android-chrome-192x192.png', render: () => renderBlob(settings, 192, squareOpaque) },
    { path: 'web/android-chrome-512x512.png', render: () => renderBlob(settings, 512, squareOpaque) },
    {
      path: 'web/maskable-512x512.png',
      render: () =>
        renderBlob(settings, 512, {
          ...squareOpaque,
          extraPadding: 10,
        }),
    },
    { path: 'web/mstile-150x150.png', render: () => renderBlob(settings, 150, squareOpaque) },
    {
      path: 'web/favicon.ico',
      render: async () => {
        const images = await Promise.all(
          [16, 32, 48, 64].map(async (size) => ({
            size,
            blob: await renderBlob(settings, size),
          }))
        );
        return encodeIco(images);
      },
    },
    {
      path: 'web/safari-pinned-tab.svg',
      render: async () => {
        const silhouette = await renderBlob(settings, 512, {
          includeBackground: false,
          includeShape: false,
          includeEffects: false,
          monochromeColor: '#000000',
        });
        const base64 = await blobToBase64(silhouette);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,${base64}"/></svg>`;
        return new Blob([svg], { type: 'image/svg+xml' });
      },
    },
  ];

  return {
    files,
    texts: [webManifest(settings, appName), browserConfig(settings)],
  };
}

function pwaPlan(settings: RenderSettings, appName: string): { files: ExportFileJob[]; texts: ExportText[] } {
  const squareOpaque = {
    iconShape: 'square' as const,
    includeEffects: false,
    backgroundOverride: opaqueOverride(settings),
  };
  const files: ExportFileJob[] = [
    { path: 'pwa/android-chrome-192x192.png', render: () => renderBlob(settings, 192, squareOpaque) },
    { path: 'pwa/android-chrome-512x512.png', render: () => renderBlob(settings, 512, squareOpaque) },
    {
      path: 'pwa/maskable-512x512.png',
      render: () => renderBlob(settings, 512, { ...squareOpaque, extraPadding: 10 }),
    },
    { path: 'pwa/apple-touch-icon.png', render: () => renderBlob(settings, 180, squareOpaque) },
  ];
  return {
    files,
    texts: [{ ...webManifest(settings, appName), path: 'pwa/site.webmanifest' }],
  };
}

function desktopPlan(settings: RenderSettings): { files: ExportFileJob[]; texts: ExportText[] } {
  const windowsSizes = [16, 24, 32, 48, 64, 128, 256];
  const linuxSizes = [16, 32, 48, 64, 128, 256, 512];
  const files: ExportFileJob[] = [];

  for (const size of windowsSizes) {
    files.push({
      path: `desktop/windows/windows-tile-${size}.png`,
      render: () => renderBlob(settings, size),
    });
  }
  files.push({
    path: 'desktop/windows/windows-tile.png',
    render: () => renderBlob(settings, 150),
  });
  files.push({
    path: 'desktop/windows/app.ico',
    render: async () => {
      const images = await Promise.all(
        [16, 24, 32, 48, 64, 128, 256].map(async (size) => ({
          size,
          blob: await renderBlob(settings, size),
        }))
      );
      return encodeIco(images);
    },
  });
  files.push({
    path: 'desktop/macos/app.icns',
    render: async () => {
      const images = await Promise.all(
        [16, 32, 64, 128, 256, 512, 1024].map(async (size) => ({
          size,
          blob: await renderBlob(settings, size),
        }))
      );
      return encodeIcns(images);
    },
  });
  for (const size of linuxSizes) {
    files.push({
      path: `desktop/linux/hicolor/${size}x${size}/apps/cloudicon.png`,
      render: () => renderBlob(settings, size),
    });
  }

  return { files, texts: [] };
}

function splashPlan(settings: RenderSettings): { files: ExportFileJob[]; texts: ExportText[] } {
  return {
    files: SPLASH_SIZES.map((splash) => ({
      path: `splash/${splash.name}.png`,
      render: () => renderCard(settings, splash.width, splash.height),
    })),
    texts: [],
  };
}

function socialPlan(
  settings: RenderSettings,
  appName: string
): { files: ExportFileJob[]; texts: ExportText[] } {
  return {
    files: SOCIAL_SIZES.map((social) => ({
      path: `social/${social.name}.png`,
      render: () => renderCard(settings, social.width, social.height, appName),
    })),
    texts: [],
  };
}

function minimalPlan(settings: RenderSettings): { files: ExportFileJob[]; texts: ExportText[] } {
  const squareOpaque = {
    iconShape: 'square' as const,
    includeEffects: false,
    backgroundOverride: opaqueOverride(settings),
  };
  return {
    files: [
      { path: 'minimal/favicon-32x32.png', render: () => renderBlob(settings, 32) },
      { path: 'minimal/apple-touch-icon.png', render: () => renderBlob(settings, 180, squareOpaque) },
      { path: 'minimal/android-chrome-192x192.png', render: () => renderBlob(settings, 192, squareOpaque) },
      { path: 'minimal/android-chrome-512x512.png', render: () => renderBlob(settings, 512, squareOpaque) },
      { path: 'minimal/app-icon-1024.png', render: () => renderBlob(settings, 1024, squareOpaque) },
      {
        path: 'minimal/favicon.ico',
        render: async () => {
          const images = await Promise.all(
            [16, 32, 48].map(async (size) => ({
              size,
              blob: await renderBlob(settings, size),
            }))
          );
          return encodeIco(images);
        },
      },
    ],
    texts: [],
  };
}

/** Build the complete job list without rendering anything. */
export function buildExportPlan(
  preset: ExportPreset,
  settings: RenderSettings,
  appName: string
): ExportPlan {
  const files: ExportFileJob[] = [];
  const texts: ExportText[] = [];
  const include = (platform: ExportPreset) => preset === 'full' || preset === platform;

  if (include('android')) {
    const plan = androidPlan(settings);
    files.push(...plan.files);
    texts.push(...plan.texts);
  }
  if (include('ios')) {
    const plan = iosPlan(settings);
    files.push(...plan.files);
    texts.push(...plan.texts);
  }
  if (include('web')) {
    const plan = webPlan(settings, appName);
    files.push(...plan.files);
    texts.push(...plan.texts);
  }
  if (include('pwa')) {
    const plan = pwaPlan(settings, appName);
    files.push(...plan.files);
    texts.push(...plan.texts);
  }
  if (include('desktop')) {
    const plan = desktopPlan(settings);
    files.push(...plan.files);
    texts.push(...plan.texts);
  }
  if (include('splash')) {
    const plan = splashPlan(settings);
    files.push(...plan.files);
    texts.push(...plan.texts);
  }
  if (include('social')) {
    const plan = socialPlan(settings, appName);
    files.push(...plan.files);
    texts.push(...plan.texts);
  }
  if (preset === 'minimal') {
    const plan = minimalPlan(settings);
    files.push(...plan.files);
    texts.push(...plan.texts);
  }

  return { files, texts, total: files.length + texts.length };
}

function platformFromPath(path: string): string {
  if (path.startsWith('android')) return 'Android';
  if (path.startsWith('iOS')) return 'iOS';
  if (path.startsWith('web')) return 'Web';
  if (path.startsWith('pwa')) return 'PWA';
  if (path.startsWith('desktop')) return 'Desktop';
  if (path.startsWith('splash')) return 'Splash';
  if (path.startsWith('social')) return 'Social';
  if (path.startsWith('minimal')) return 'Minimal';
  return 'Assets';
}

/** Execute a plan and report a single, accurate global progress counter. */
export async function executeExportPlan(
  plan: ExportPlan,
  onProgress: ProgressCallback
): Promise<{ files: ExportFile[]; texts: ExportText[]; total: number }> {
  const files: ExportFile[] = [];
  let done = 0;

  for (const job of plan.files) {
    onProgress({
      platform: platformFromPath(job.path),
      step: job.path,
      done,
      total: plan.total,
    });
    const blob = await job.render();
    files.push({ path: job.path, blob });
    done++;
    onProgress({
      platform: platformFromPath(job.path),
      step: job.path,
      done,
      total: plan.total,
    });
  }

  for (const text of plan.texts) {
    done++;
    onProgress({
      platform: 'Manifests',
      step: text.path,
      done,
      total: plan.total,
    });
  }

  return { files, texts: plan.texts, total: plan.total };
}

/** Rough but honest estimate used by the export dialog. */
export async function estimateExport(
  preset: ExportPreset,
  settings: RenderSettings,
  appName: string
): Promise<{ size: number; fileCount: number }> {
  const plan = buildExportPlan(preset, settings, appName);
  let sampleSize = 28000;
  try {
    sampleSize = (await renderBlob(settings, 256)).size;
  } catch {
    // Fall back to a conservative average.
  }
  // Large iOS/desktop assets dominate; use an area-weighted approximation.
  const weighted = plan.files.reduce((sum, job) => {
    const match = job.path.match(/(\d{2,4})x\1|\/windows-tile-(\d+)|\/favicon-(\d+)|-(\d{2,4})\.png/);
    const size = match ? Number(match[1] || match[2] || match[3] || match[4]) : 256;
    const areaFactor = Math.max(0.12, Math.min(6, (size / 256) ** 2));
    return sum + sampleSize * areaFactor;
  }, 0);
  const textSize = plan.texts.reduce((sum, text) => sum + text.content.length, 0);
  return {
    size: Math.round(weighted * 0.92 + textSize + 2048),
    fileCount: plan.total,
  };
}
