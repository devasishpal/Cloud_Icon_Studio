'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, Smartphone, Apple, Globe, Monitor, Download, Palette, Shapes, Zap, Crop, RotateCw, Wand2 } from 'lucide-react';
import { UploadBox } from '@/components/upload/upload-box';
import { flushPersistence, useEditorStore } from '@/store/useEditorStore';
import { normalizeUpload } from '@/lib/image-ops';
import { loadImageElement } from '@/lib/render';

const features = [
  { icon: Smartphone, title: 'Android Adaptive Icons', desc: 'Mipmap sets, adaptive icons with safe zones, and Material You themed icons for Android 13+' },
  { icon: Apple, title: 'iOS App Icons', desc: 'All Apple sizes including iPhone, iPad, and App Store, with auto-generated Contents.json' },
  { icon: Globe, title: 'Web & PWA Ready', desc: 'Favicons, apple-touch-icons, PWA manifest icons, and browser config files' },
  { icon: Monitor, title: 'Desktop App Icons', desc: 'Windows taskbar tiles, macOS dock icons, and Linux launcher icons' },
  { icon: Palette, title: 'Smart Backgrounds', desc: 'Solid colors, linear gradients, or transparent backgrounds with live preview' },
  { icon: Shapes, title: 'Icon Shape Masks', desc: 'Circle, squircle, rounded square, and teardrop device masks' },
  { icon: Crop, title: 'Precision Cropping', desc: 'Aspect-ratio locked crop tool with safe zone overlays for adaptive icons' },
  { icon: RotateCw, title: 'Rotation & Padding', desc: 'Fine-tune rotation and inner padding to perfectly frame artwork' },
  { icon: Wand2, title: 'AI Background Removal', desc: 'U2Net AI and chroma-key removal run locally in your browser' },
  { icon: Download, title: 'ZIP Export', desc: 'Everything packaged in a structured ZIP archive with proper folder hierarchy' },
];

const platforms = [
  { name: 'Android', icon: Smartphone, items: 'Mipmap ldpi-xxxhdpi, adaptive + monochrome, notification, Play Store' },
  { name: 'iOS', icon: Apple, items: '19 AppIcon sizes for iPhone, iPad, Spotlight, Settings, App Store' },
  { name: 'Web', icon: Globe, items: 'Favicons, apple-touch-icon, PWA + maskable icons, manifest, browserconfig' },
  { name: 'Desktop', icon: Monitor, items: 'Windows tiles + ICO, macOS ICNS, Linux hicolor PNGs' },
];

export function HeroSection() {
  const router = useRouter();
  const setImage = useEditorStore((s) => s.setImage);

  const handleUpload = async (file: File, dataUrl: string) => {
    // Rasterise SVGs and cap huge bitmaps so every browser can render and
    // export the artwork consistently.
    const normalized = await normalizeUpload(file, dataUrl).catch(() => null);
    const finalUrl = normalized?.dataUrl ?? dataUrl;

    // Decode through the shared image cache so the editor can paint the new
    // artwork synchronously on its first render (no stale frame, no blank).
    const img = await loadImageElement(finalUrl);
    setImage({
      file,
      dataUrl: finalUrl,
      width: normalized?.width ?? img.naturalWidth,
      height: normalized?.height ?? img.naturalHeight,
    });
    // Make sure the new artwork is committed to IndexedDB before the editor
    // mounts and potentially rehydrates the previous session.
    await flushPersistence();
    router.push('/editor');
  };

  return (
    <section className="relative overflow-hidden flex-1">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-primary/10 blur-3xl max-sm:size-48 max-sm:-top-20 max-sm:-right-20" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-accent-2/10 blur-3xl max-sm:size-48 max-sm:-bottom-20 max-sm:-left-20" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground sm:text-sm sm:px-4 sm:py-1.5"
          >
            <Sparkles className="size-3 text-primary" />
            Free. Fast. Runs entirely in your browser.
          </motion.div>

          <h1 className="mb-3 text-[clamp(1.5rem,4.5vw,3.5rem)] font-bold tracking-tight leading-[1.1] sm:text-5xl lg:text-6xl">
            Generate{' '}
            <span className="text-gradient">Perfect</span>
            {' '}App Icons for
            <br />
            Android, iOS &amp; Web
          </h1>

          <p className="mx-auto mb-6 max-w-2xl text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed px-2">
            Upload your artwork once and generate a complete icon set for every platform.
            Launcher icons, adaptive icons, favicons, desktop formats, and local AI background
            removal — all in your browser with zero artwork uploads.
          </p>

          <motion.div
            id="upload-area"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="px-2"
          >
            <div className="w-full max-w-md mx-auto">
              <UploadBox onUpload={handleUpload} />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          id="platforms"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <h2 className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4 sm:text-sm sm:mb-6">
            One source &mdash; every platform
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {platforms.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-3 sm:p-4 text-center hover:border-primary/30 transition-all"
              >
                <div className="mx-auto mb-1.5 flex size-8 sm:size-10 items-center justify-center rounded-lg bg-primary/10">
                  <p.icon className="size-4 sm:size-5 text-primary" />
                </div>
                <p className="text-sm sm:text-base font-medium mb-0.5">{p.name}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{p.items}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 sm:mt-16"
        >
          <h2 className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4 sm:text-sm sm:mb-6">
            Everything you need
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.05, duration: 0.4 }}
                className="rounded-xl border border-border/50 bg-card/30 p-3 sm:p-4 hover:bg-card/50 transition-all"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <f.icon className="size-3.5 sm:size-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm sm:text-base font-medium mb-0.5">{f.title}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="how-it-works"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <h2 className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4 sm:text-sm sm:mb-6">
            How it works
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { step: '1', title: 'Upload', desc: 'PNG, JPG, WebP or SVG · max 25 MB' },
              { step: '2', title: 'Adjust', desc: 'Crop, rotate, set padding & background' },
              { step: '3', title: 'Preview', desc: 'See live mockups on every platform' },
              { step: '4', title: 'Export', desc: 'Download a ZIP with all icon sets' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.1, duration: 0.4 }}
                className="flex flex-col items-center gap-1.5 sm:gap-2"
              >
                <div className="flex size-8 sm:size-10 items-center justify-center rounded-full bg-primary/10 text-sm sm:text-base font-bold text-primary">
                  {s.step}
                </div>
                <p className="text-sm sm:text-base font-medium">{s.title}</p>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-28 sm:max-w-none">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="mt-10 sm:mt-16 text-center"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/30 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-muted-foreground">
            <Zap className="size-3 sm:size-3.5 text-primary" />
            100% client-side &middot; No artwork uploads &middot; Private &amp; secure
          </div>
        </motion.div>
      </div>
    </section>
  );
}
