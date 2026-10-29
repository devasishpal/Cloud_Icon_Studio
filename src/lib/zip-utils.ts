'use client';

import JSZip from 'jszip';

export interface ExportOptions {
  compressionLevel: 'low' | 'balanced' | 'maximum';
  exportName: string;
  includeREADME: boolean;
  includeManifests: boolean;
  includeSource: boolean;
  source?: { name: string; blob: Blob } | null;
  appName?: string;
  preset?: string;
  backgroundColor?: string;
  transparent?: boolean;
}

const PRESET_LABELS: Record<string, string> = {
  full: 'Full Pack',
  android: 'Android',
  ios: 'iOS',
  web: 'Web',
  pwa: 'PWA',
  desktop: 'Desktop',
  splash: 'Splash Screens',
  social: 'Social Cards',
  minimal: 'Minimal',
};

export function generateReadme(options: ExportOptions): string {
  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const appName = options.appName || 'Your App';
  const preset = options.preset ? (PRESET_LABELS[options.preset] ?? options.preset) : 'Custom';
  const transparentNote = options.transparent
    ? '\n  NOTE: Transparent backgrounds were flattened onto your chosen background\n  colour for iOS and PWA assets, because those platforms require opaque icons.\n'
    : '';

  return `====================================================================
  ${appName} — Icon Pack
  Generated with CloudIcon Studio on ${date}
====================================================================

  Preset : ${preset}
  Files  : see the folder structure below
${transparentNote}
  Every asset in this archive was rendered from the same editor canvas,
  so colours, padding, rotation, filters and effects match exactly.

====================================================================
  WHAT'S INSIDE
====================================================================

  ANDROID
    mipmap-ldpi … mipmap-xxxhdpi
      ic_launcher.png              Legacy launcher icon
      ic_launcher_round.png        Legacy round icon
      ic_launcher_foreground.png   Adaptive foreground (safe-zone aware)
    mipmap-anydpi-v26
      ic_launcher.xml              Adaptive icon (API 26+)
      ic_launcher_round.xml
      ic_launcher_background.png
      ic_launcher_monochrome.png
    mipmap-anydpi-v33
      ic_launcher.xml              Adaptive icon with Material You monochrome
      ic_launcher_round.xml
    drawable-*dpi
      ic_notification.png          Status-bar notification icon
    values/ic_launcher_background.xml
    playstore-icon.png             512×512 Play Store listing icon
    ic_launcher-web.png

  iOS
    AppIcon.appiconset/
      Icon-App-*.png               Every iPhone / iPad / App Store size
      Contents.json                Asset-catalog manifest

  WEB
    favicon-16x16.png
    favicon-32x32.png
    favicon-48x48.png
    favicon.ico                    Multi-resolution 16/32/48/64
    apple-touch-icon.png
    android-chrome-192x192.png
    android-chrome-512x512.png
    maskable-512x512.png           Safe-zone aware maskable icon
    mstile-150x150.png
    safari-pinned-tab.svg
    site.webmanifest
    browserconfig.xml

  PWA
    android-chrome-192x192.png
    android-chrome-512x512.png
    maskable-512x512.png
    apple-touch-icon.png
    site.webmanifest

  DESKTOP
    windows/windows-tile-*.png
    windows/app.ico                Multi-resolution Windows icon
    macos/app.icns                 Multi-resolution macOS icon
    linux/hicolor/*/apps/cloudicon.png

  SPLASH / SOCIAL
    splash/splash-*.png            iPhone & iPad launch screens
    social/og-image.png            1200×630 Open Graph card
    social/twitter-card.png        1200×600 Twitter card
    social/social-square.png       1080×1080 social post

====================================================================
  INSTALLATION
====================================================================

  ANDROID
    1. Copy the 'android' folder into app/src/main/res/
    2. Rebuild the project. Adaptive icons are picked up automatically.
    3. If your app uses a custom adaptive icon, keep the existing
       mipmap-anydpi-v26 XML and point its layers at these PNGs.

  iOS / iPadOS
    1. Open Assets.xcassets in Xcode and select AppIcon.
    2. Drag AppIcon.appiconset into the asset catalog.
    3. Make sure 'Contents.json' is included.

  WEB
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="${options.backgroundColor ?? '#7C3AED'}">

  WINDOWS
    Use windows/app.ico for shortcuts, taskbar pins and installers.

  macOS
    Use macos/app.icns in your .app bundle (CFBundleIconFile).

  LINUX
    Install the PNGs into /usr/share/icons/hicolor/ and reference the
    icon name from your .desktop file (Icon=cloudicon).

====================================================================
  CloudIcon Studio — https://github.com/devasishpal/Cloud_Icon_Studio
  All processing happens locally in your browser. No uploads.
====================================================================`;
}

export function getCompressionLevel(level: 'low' | 'balanced' | 'maximum'): number {
  switch (level) {
    case 'low':
      return 1;
    case 'balanced':
      return 6;
    case 'maximum':
      return 9;
  }
}

export async function packZip(
  files: { path: string; blob: Blob }[],
  texts: { path: string; content: string }[],
  options: ExportOptions,
  onProgress?: (current: number, total: number) => void
): Promise<{ blob: Blob; size: number; fileCount: number }> {
  const zip = new JSZip();

  // Manifests are optional; the image assets always ship.
  const includedTexts = options.includeManifests ? texts : [];
  const source = options.includeSource ? options.source ?? null : null;
  const total = files.length + includedTexts.length + (options.includeREADME ? 1 : 0) + (source ? 1 : 0);
  let done = 0;

  const progress = () => {
    done++;
    onProgress?.(done, total);
  };

  for (const file of files) {
    zip.file(file.path, file.blob);
    progress();
  }

  for (const text of includedTexts) {
    zip.file(text.path, text.content);
    progress();
  }

  if (options.includeREADME) {
    zip.file('README.txt', generateReadme(options));
    progress();
  }

  if (source) {
    zip.file(source.name, source.blob);
    progress();
  }

  const level = getCompressionLevel(options.compressionLevel);
  const useCompression = options.compressionLevel !== 'low';
  const blob = await zip.generateAsync({
    type: 'blob',
    compression: useCompression ? 'DEFLATE' : 'STORE',
    compressionOptions: useCompression ? { level } : undefined,
  });

  return { blob, size: blob.size, fileCount: total };
}
