'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Apple,
  ArrowRight,
  Camera,
  Check,
  Cloud,
  Compass,
  Cpu,
  Globe,
  HardDrive,
  Lock,
  Mail,
  Map,
  MessageCircle,
  Monitor,
  Music,
  Phone,
  Settings,
  ShieldCheck,
  Smartphone,
  WifiOff,
} from 'lucide-react';
import {
  siAndroid,
  siApple,
  siFirefox,
  siGooglechrome,
  siLinux,
  siSafari,
} from 'simple-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DemoId = 'android' | 'ios' | 'web' | 'desktop';

interface Demo {
  id: DemoId;
  label: string;
  icon: React.ElementType;
  title: string;
  description: string;
  points: string[];
  files: string;
  accent: string;
}

const demos: Demo[] = [
  {
    id: 'android',
    label: 'Android',
    icon: Smartphone,
    title: 'Adaptive icons that survive every mask',
    description:
      'Foreground, background, monochrome, and notification layers are generated at every density with the Android safe zone already applied.',
    points: [
      'ldpi–xxxhdpi launcher and round icons',
      'Android 13 themed monochrome layer',
      '512×512 Play Store artwork + adaptive XML',
    ],
    files: '32 files',
    accent: '#3DDC84',
  },
  {
    id: 'ios',
    label: 'iOS',
    icon: Apple,
    title: 'Every AppIcon Apple asks for',
    description:
      'All 19 iPhone, iPad, Spotlight, Settings, Notification, and App Store sizes are rendered with an opaque background and a ready-to-import Contents.json.',
    points: [
      '19 sizes from 20×20 to 1024×1024',
      'Correct @1x, @2x, and @3x filenames',
      'Xcode-ready AppIcon.appiconset',
    ],
    files: '20 files',
    accent: '#0A84FF',
  },
  {
    id: 'web',
    label: 'Web',
    icon: Globe,
    title: 'Favicons and PWA assets that just work',
    description:
      'A complete web icon pack with every modern favicon, an Apple touch icon, PWA and maskable icons, plus the manifests browsers expect.',
    points: [
      '16/32/48 favicons + multi-size favicon.ico',
      '192/512 PWA and 512 maskable icons',
      'site.webmanifest + browserconfig.xml',
    ],
    files: '12 files',
    accent: '#4285F4',
  },
  {
    id: 'desktop',
    label: 'Desktop',
    icon: Monitor,
    title: 'Native desktop formats, not resized PNGs',
    description:
      'Windows gets a real multi-resolution ICO and tile set, macOS gets a proper ICNS, and Linux gets hicolor PNGs in the standard app folders.',
    points: [
      'Windows tiles + 16–256px app.ico',
      'macOS app.icns from 16px to 1024px',
      'Linux hicolor PNGs from 16px to 512px',
    ],
    files: '17 files',
    accent: '#0078D4',
  },
];

type SimpleIcon = { title: string; hex: string; path: string };

function BrandGlyph({ icon, className }: { icon: SimpleIcon; className?: string }) {
  const color = icon.hex.toLowerCase() === '000000' ? 'currentColor' : `#${icon.hex}`;
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('size-4', className)}
      style={{ color }}
      fill="currentColor"
    >
      <path d={icon.path} />
    </svg>
  );
}

function PhoneFrame({ children, ios = false }: { children: React.ReactNode; ios?: boolean }) {
  return (
    <div
      className={cn(
        'relative mx-auto w-[240px] rounded-[2.7rem] border-[6px] border-zinc-800 bg-zinc-950 p-1.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:w-[260px]',
        ios ? 'rounded-[2.9rem]' : ''
      )}
    >
      <div className="relative overflow-hidden rounded-[2.1rem]">
        {children}
        {ios ? (
          <div className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-full bg-black/90" />
        ) : (
          <div className="absolute left-1/2 top-2 size-2.5 -translate-x-1/2 rounded-full bg-black/70 ring-1 ring-white/10" />
        )}
      </div>
    </div>
  );
}

function MiniApp({
  color,
  icon: Icon,
  className,
}: {
  color: string;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn('flex size-8 items-center justify-center rounded-[10px] shadow-sm', className)}
      style={{ backgroundColor: color }}
    >
      <Icon className="size-4 text-white/90" />
    </div>
  );
}

function AndroidMockup() {
  return (
    <PhoneFrame>
      <div className="relative bg-gradient-to-b from-[#1b1642] via-[#241b52] to-[#0b1024] px-3 pb-3 pt-7">
        <div className="mb-4 flex items-center justify-between px-1 text-[9px] font-medium text-white/70">
          <span>10:15</span>
          <span className="flex items-center gap-1">
            <span className="size-1 rounded-full bg-white/60" />
            <span className="size-1 rounded-full bg-white/60" />
            <span className="size-1 rounded-full bg-white/60" />
          </span>
        </div>
        <div className="grid grid-cols-4 gap-x-2 gap-y-3">
          <MiniApp color="#1f2937" icon={Phone} />
          <MiniApp color="#075985" icon={MessageCircle} />
          <MiniApp color="#7c2d12" icon={Camera} />
          <MiniApp color="#14532d" icon={Map} />
          <MiniApp color="#4c1d95" icon={Music} />
          <MiniApp color="#334155" icon={Settings} />
          <MiniApp color="#1e3a8a" icon={Mail} />
          <MiniApp color="#3f3f46" icon={Cloud} />
        </div>
        <div className="mt-5 flex flex-col items-center gap-1.5">
          <div className="rounded-[18px] border border-white/15 bg-white/10 p-1 shadow-lg backdrop-blur">
            <Image
              src="/icon-192.png"
              alt="CloudIcon Android icon"
              width={56}
              height={56}
              className="size-14 rounded-[15px]"
            />
          </div>
          <span className="text-[10px] font-medium text-white/90">CloudIcon</span>
        </div>
        <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-2 backdrop-blur">
          <MiniApp color="#1f2937" icon={Phone} className="size-6 rounded-lg" />
          <MiniApp color="#075985" icon={MessageCircle} className="size-6 rounded-lg" />
          <MiniApp color="#14532d" icon={Map} className="size-6 rounded-lg" />
          <MiniApp color="#4c1d95" icon={Music} className="size-6 rounded-lg" />
        </div>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-white/40" />
      </div>
    </PhoneFrame>
  );
}

function IOSMockup() {
  return (
    <PhoneFrame ios>
      <div className="relative bg-gradient-to-b from-[#fb923c] via-[#f43f5e] to-[#4c1d95] px-3 pb-3 pt-8">
        <div className="mb-4 flex items-center justify-between px-1 text-[9px] font-medium text-white/80">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-3 rounded-sm bg-white/70" />
            <span className="size-1 rounded-full bg-white/70" />
          </span>
        </div>
        <div className="grid grid-cols-4 gap-x-2 gap-y-3">
          <MiniApp color="#0f766e" icon={MessageCircle} />
          <MiniApp color="#1d4ed8" icon={Camera} />
          <MiniApp color="#7c3aed" icon={Music} />
          <MiniApp color="#be123c" icon={Map} />
          <MiniApp color="#334155" icon={Settings} />
          <MiniApp color="#0e7490" icon={Mail} />
          <MiniApp color="#4338ca" icon={Cloud} />
          <MiniApp color="#166534" icon={Phone} />
        </div>
        <div className="mt-5 flex flex-col items-center gap-1.5">
          <div className="rounded-[18px] border border-white/20 bg-white/10 p-1 shadow-lg backdrop-blur">
            <Image
              src="/icon-192.png"
              alt="CloudIcon iOS icon"
              width={56}
              height={56}
              className="size-14 rounded-[15px]"
            />
          </div>
          <span className="text-[10px] font-medium text-white/95">CloudIcon</span>
        </div>
        <div className="mt-5 flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">
          <MiniApp color="#0f766e" icon={MessageCircle} className="size-6 rounded-lg" />
          <MiniApp color="#1d4ed8" icon={Camera} className="size-6 rounded-lg" />
          <MiniApp color="#7c3aed" icon={Music} className="size-6 rounded-lg" />
          <MiniApp color="#be123c" icon={Map} className="size-6 rounded-lg" />
        </div>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-white/50" />
      </div>
    </PhoneFrame>
  );
}

function WebMockup() {
  return (
    <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-xl border border-white/10 bg-[#111116] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#1a1a21] px-3 py-2">
        <span className="size-2 rounded-full bg-red-400/80" />
        <span className="size-2 rounded-full bg-amber-400/80" />
        <span className="size-2 rounded-full bg-emerald-400/80" />
        <div className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white/[0.06] px-2 py-1">
          <Image src="/favicon-16x16.png" alt="" width={12} height={12} className="size-3" />
          <span className="truncate text-[9px] text-white/70">CloudIcon Studio</span>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b border-white/10 bg-[#15151b] px-3 py-1.5 text-[9px] text-white/45">
        <Lock className="size-2.5" />
        <span>cloudicon.studio/editor</span>
      </div>
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1c1430] via-[#14121f] to-[#0b0b12] p-4">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <Image
              src="/icon-192.png"
              alt="CloudIcon web icon"
              width={48}
              height={48}
              className="size-12 rounded-xl shadow-lg"
            />
            <div>
              <p className="text-xs font-semibold text-white">CloudIcon Studio</p>
              <p className="text-[10px] text-white/55">Free app icon generator</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
            <span className="font-mono text-[10px] text-white/65">site.webmanifest</span>
            <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[9px] font-medium text-emerald-300">Linked</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {['192', '512', 'ICO'].map((size) => (
              <div key={size} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-center">
                <p className="text-[9px] text-white/45">favicon</p>
                <p className="text-[10px] font-medium text-white/80">{size}px</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopMockup() {
  return (
    <div className="mx-auto w-full max-w-[400px]">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0d12] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-center gap-2 border-b border-white/10 bg-[#17171d] px-3 py-2">
          <div className="flex gap-1.5">
            <span className="size-2 rounded-full bg-red-400/80" />
            <span className="size-2 rounded-full bg-amber-400/80" />
            <span className="size-2 rounded-full bg-emerald-400/80" />
          </div>
          <span className="ml-2 text-[9px] text-white/45">Desktop preview</span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#0f172a] p-4">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(124,58,237,0.35),transparent_55%)]" />
          <div className="relative mx-auto mt-3 w-[72%] rounded-lg border border-white/15 bg-[#111116]/85 p-3 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-2">
              <Image
                src="/icon-192.png"
                alt="CloudIcon desktop icon"
                width={36}
                height={36}
                className="size-9 rounded-lg"
              />
              <div>
                <p className="text-[10px] font-semibold text-white">CloudIcon Studio</p>
                <p className="text-[8px] text-white/50">app.ico · app.icns · PNG</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {['Windows', 'macOS', 'Linux'].map((platform) => (
                <div key={platform} className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-1 text-center text-[8px] text-white/65">
                  {platform}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/15 bg-black/35 px-3 py-1.5 backdrop-blur">
            <MiniApp color="#1f2937" icon={Phone} className="size-6 rounded-md" />
            <MiniApp color="#075985" icon={MessageCircle} className="size-6 rounded-md" />
            <Image src="/icon-192.png" alt="" width={24} height={24} className="size-6 rounded-md ring-1 ring-white/30" />
            <MiniApp color="#4c1d95" icon={Music} className="size-6 rounded-md" />
          </div>
        </div>
      </div>
      <div className="mx-auto h-2 w-24 rounded-b-lg bg-zinc-800" />
      <div className="mx-auto h-1 w-40 rounded-full bg-zinc-800/70" />
    </div>
  );
}

const mockups: Record<DemoId, React.ReactNode> = {
  android: <AndroidMockup />,
  ios: <IOSMockup />,
  web: <WebMockup />,
  desktop: <DesktopMockup />,
};

const browsers = [
  { name: 'Chrome', icon: siGooglechrome },
  { name: 'Safari', icon: siSafari },
  { name: 'Firefox', icon: siFirefox },
  { name: 'Edge', icon: null },
];

const guarantees = [
  { icon: Lock, title: 'No artwork uploads', desc: 'Images stay in your browser' },
  { icon: Cpu, title: 'Local AI removal', desc: 'U2Net runs on-device' },
  { icon: WifiOff, title: 'Offline-ready', desc: 'App + model cached in production' },
  { icon: HardDrive, title: 'Reload-safe', desc: 'Sessions saved in IndexedDB' },
];

function scrollToUpload() {
  document.getElementById('upload-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function ShowcaseSection() {
  const [active, setActive] = useState<DemoId>('android');
  const demo = demos.find((item) => item.id === active) ?? demos[0];

  return (
    <section className="relative overflow-hidden border-y border-border/40 bg-muted/10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 size-[520px] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute -right-32 bottom-0 size-80 rounded-full bg-accent-2/[0.06] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <ShieldCheck className="size-3.5" />
            One artwork · every platform
          </span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-4xl">
            See it on <span className="text-gradient">every home screen</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            The same renderer powers the editor, device previews, and every exported file.
            Switch platforms to see what your pack contains.
          </p>
        </motion.div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-border/60 bg-background/60 p-1.5 backdrop-blur">
            {demos.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={cn(
                    'relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors sm:px-4 sm:text-sm',
                    isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  )}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <motion.span
                      layoutId="home-showcase-tab"
                      className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <Icon className="relative z-10 size-3.5 sm:size-4" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="relative flex min-h-[440px] items-center justify-center">
            <div className="absolute inset-8 rounded-[2rem] bg-gradient-to-br from-primary/10 via-transparent to-accent-2/10 blur-2xl" />
            <AnimatePresence mode="wait">
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.98 }}
                transition={{ duration: 0.28 }}
                className="relative w-full"
              >
                {mockups[demo.id]}
              </motion.div>
            </AnimatePresence>

            <motion.div
              key={`${demo.id}-chip-a`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="absolute left-0 top-8 hidden rounded-lg border border-border/60 bg-background/85 px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur sm:block"
            >
              {demo.files}
            </motion.div>
            <motion.div
              key={`${demo.id}-chip-b`}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-10 right-0 hidden rounded-lg border border-border/60 bg-background/85 px-2.5 py-1.5 text-[10px] font-medium text-muted-foreground shadow-sm backdrop-blur sm:block"
            >
              100% local render
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex size-9 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${demo.accent}1a`, color: demo.accent }}
                >
                  <demo.icon className="size-4" />
                </span>
                <Badge variant="outline" className="border-border/60 bg-background/50 text-[11px]">
                  {demo.label} pack
                </Badge>
                <Badge variant="outline" className="border-primary/20 bg-primary/5 text-[11px] text-primary">
                  {demo.files}
                </Badge>
              </div>

              <h3 className="mt-4 text-xl font-bold tracking-tight sm:text-2xl">{demo.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {demo.description}
              </p>

              <ul className="mt-5 space-y-2.5">
                {demo.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                      <Check className="size-2.5" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Button onClick={scrollToUpload} className="h-10 gap-2 px-4 text-sm">
                  Upload your artwork
                  <ArrowRight className="size-4" />
                </Button>
                <span className="text-xs text-muted-foreground">Free · no account · no watermark</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {guarantees.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.35 }}
              className="rounded-xl border border-border/50 bg-background/50 p-4 backdrop-blur"
            >
              <item.icon className="size-4 text-primary" />
              <p className="mt-2.5 text-sm font-medium">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/40 px-4 py-4 sm:flex-row sm:px-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="size-4 text-primary" />
            Tested in current browsers
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {browsers.map((browser) => (
              <span key={browser.name} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                {browser.icon ? (
                  <BrandGlyph icon={browser.icon} className="size-3.5" />
                ) : (
                  <Compass className="size-3.5" />
                )}
                {browser.name}
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <BrandGlyph icon={siAndroid} className="size-3.5" />
              Android
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <BrandGlyph icon={siApple} className="size-3.5" />
              iOS
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <BrandGlyph icon={siLinux} className="size-3.5" />
              Linux
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
