import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Upload, Sliders, Eye, Download, KeyRound, Grid, Undo2, Command, ArrowRight } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'App Icon Generator Documentation — Step-by-Step Guide',
  description: 'Complete documentation for CloudIcon Studio. Learn how to generate Android adaptive icons, iOS app icons, Web favicons & Desktop icons. Includes keyboard shortcuts and pro tips.',
  keywords: ['app icon generator documentation', 'icon generator guide', 'how to make app icons', 'app icon tutorial', 'icon design documentation', 'android icon documentation', 'ios icon guide', 'favicon guide'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.studio/docs' },
  openGraph: {
    title: 'App Icon Generator Documentation — Step-by-Step Guide',
    description: 'Complete guide to using CloudIcon Studio: upload, customize, preview on device mockups, and export icon packs for every platform.',
    url: 'https://cloudicon.studio/docs',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio documentation and guide' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'App Icon Generator Documentation',
    description: 'Step-by-step guide to generating app icons for every platform with CloudIcon Studio.',
    images: ['/og-image.png'],
  },
};

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Image',
    content: 'Getting started is simple. Head to the home page and drop your image into the upload area, or click "Launch Editor" to go directly to the workspace. CloudIcon Studio supports PNG, JPG, SVG, and WEBP formats. There is no file size limit to worry about — your image stays entirely on your device and never gets uploaded to any server. Once uploaded, your image appears in the editor workspace, ready for customization. You can upload a fresh image at any time by pressing Ctrl+O or using the upload button in the toolbar. The editor supports high-resolution images, so feel free to use your largest source files — the downscaling algorithm handles them beautifully.',
  },
  {
    icon: Sliders,
    title: 'Customize Your Icon',
    content: 'The left panel is your control center. Every adjustment updates instantly so you can see exactly what you are getting. The rotation tool lets you fine-tune the angle of your icon in precise increments, which is especially useful for logos that look better at a slight tilt. The background tool allows you to add a solid color, a gradient, or keep it transparent — each platform has different background requirements, and you can preview them all. Padding controls the breathing room around your icon, and the safe area overlay ensures critical content is not clipped on any platform. The crop tool lets you trim unwanted edges, and the shape selector offers circle, rounded square, squircle, and more — each shape corresponds to real platform requirements like Android adaptive icons and iOS app icon masks.',
  },
  {
    icon: Eye,
    title: 'Preview on Real Devices',
    content: 'The right panel brings your icon to life with real-time device mockups. Switch between Android, iOS, Web (PWA), and Desktop views to see exactly how your icon will appear on each platform. Each mockup accurately reflects the platform-specific mask, safe zone, and rendering quirks — what you see is what you will get when you publish. The preview updates live as you make changes, so there is no back-and-forth guessing. You can zoom in to inspect details, toggle a grid overlay for alignment checking, and compare dark and light mode appearances. This instant feedback loop is what makes CloudIcon Studio different from batch generators that show you results only after export.',
  },
  {
    icon: Download,
    title: 'Generate and Download',
    content: 'When you are happy with your icon, click the "Generate & Download" button in the top-right corner. CloudIcon Studio creates a complete ZIP archive containing every icon size and format each platform requires. For Android, that includes launcher icons at all densities (mdpi through xxxhdpi), adaptive icons, and notification icons. For iOS, you get every size required by the App Store and the operating system. For the web, you get a full favicon set including all modern sizes and formats. For desktop, Windows and macOS icon sets are included. The ZIP file is generated entirely in your browser — no copy is ever stored on any server. You can export as many times as you like, tweaking settings between exports until everything is perfect.',
  },
];

const shortcuts = [
  { keys: 'Ctrl+Z', action: 'Undo' },
  { keys: 'Ctrl+Shift+Z / Ctrl+Y', action: 'Redo' },
  { keys: 'Ctrl+O', action: 'Upload new image' },
  { keys: 'Ctrl+E', action: 'Open export modal' },
  { keys: 'Ctrl+G', action: 'Toggle grid overlay' },
  { keys: 'Escape', action: 'Deselect current tool' },
  { keys: 'Ctrl+Shift+P', action: 'Open command palette' },
];

export default function DocsPage() {
  return (
    <PageLayout>
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <BookOpen className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
          <p className="text-sm text-muted-foreground">Everything you need to know about using CloudIcon Studio</p>
        </div>
      </div>

      <div className="h-px bg-border my-8" />

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-8">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Generating production-ready app icons with CloudIcon Studio takes about a minute. The workflow is straightforward: upload your image, customize it with the editing tools, preview the results on real device mockups, and download a complete icon pack for every platform. Below is a detailed walkthrough of each step, along with keyboard shortcuts for power users. If you have never used an icon generator before, do not worry — the interface is designed to be intuitive, and every tool has a clear purpose. If you are a seasoned designer, you will appreciate the speed and precision of the controls.
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                <step.icon className="size-5 text-primary" />
              </div>
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground shrink-0">{index + 1}</span>
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
            <Command className="size-5 text-primary" />
          </div>
          <div className="space-y-4 flex-1">
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For power users who prefer keeping their hands on the keyboard, CloudIcon Studio supports a full set of shortcuts. These work in the editor and most dialogs.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {shortcuts.map((s) => (
                <div key={s.action} className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-2.5">
                  <span className="text-sm text-muted-foreground">{s.action}</span>
                  <kbd className="rounded-md border border-border bg-background px-2 py-0.5 text-xs font-mono text-foreground shadow-sm">{s.keys}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
        <h2 className="font-semibold mb-2">Ready to create your icons?</h2>
        <p className="text-sm text-muted-foreground mb-4">No sign-up required. Your images never leave your device.</p>
        <Link
          href="/editor"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #215ee9, #e040cf, #faa83b, #08cbfb)' }}
        >
          Open the Editor
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
    </PageLayout>
  );
}
