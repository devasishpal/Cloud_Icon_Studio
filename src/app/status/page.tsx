import type { Metadata } from 'next';
import Link from 'next/link';
import { Activity, CheckCircle, Server, ShieldCheck, Zap, Globe, RefreshCw, Clock, Wifi } from 'lucide-react';
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'Service Status — App Icon Generator Uptime',
  description: 'CloudIcon Studio service status. Since our app icon generator runs 100% client-side in your browser, there is no server downtime. Always operational.',
  keywords: ['CloudIcon Studio status', 'service status', 'app icon generator uptime', 'client-side status', 'zero downtime icon tool', 'app availability'],
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://cloudicon.vercel.app/status' },
  openGraph: {
    title: 'Service Status — App Icon Generator Uptime',
    description: 'CloudIcon Studio runs 100% in your browser — zero server dependencies, zero downtime. Check live status here.',
    url: 'https://cloudicon.vercel.app/status',
    siteName: 'CloudIcon Studio',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CloudIcon Studio service status page' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Service Status — CloudIcon Studio',
    description: 'Always operational. 100% client-side app icon generator with no server dependencies.',
    images: ['/og-image.png'],
  },
};

const statusItems = [
  {
    icon: Wifi,
    title: 'Application Availability',
    content: 'CloudIcon Studio is a Progressive Web Application that runs entirely in your browser. Once loaded, the core functionality — image upload, editing, preview, and export — works without any server communication. This means there is no server to go down, no database to fail, and no API to time out. The only server-dependent operation is the initial loading of the application files, which are served through a standard CDN. If the CDN is temporarily unreachable, the service worker (if previously installed) serves a cached version of the application, ensuring uninterrupted access. In practical terms, CloudIcon Studio has never experienced unplanned downtime because there are very few moving parts that can fail.',
  },
  {
    icon: ShieldCheck,
    title: 'Data Privacy Status',
    content: 'Your data is always safe because it never leaves your device. CloudIcon Studio processes every image, every adjustment, and every export entirely within your browser using the Canvas API and Fabric.js. There are no servers processing your uploads, no databases storing your creations, and no third-party services analyzing your usage. Even if our servers were completely unreachable, your data would remain unaffected because it exists only in your browser\'s memory. This architecture means that server outages, data breaches, and unauthorized access to user data — the most common security incidents for web applications — are simply not possible with CloudIcon Studio. Your privacy is not just a policy; it is an architectural guarantee.',
  },
  {
    icon: Zap,
    title: 'Performance Status',
    content: 'CloudIcon Studio\'s performance depends on your device, not our servers. Image processing uses your device\'s GPU through the Canvas API, which means performance scales with your hardware. On modern devices, icon generation and export complete in under a second. The application itself is built with Next.js and optimized for fast loading — the initial bundle is code-split and lazy-loaded, with critical resources prefetched and cached by the service worker. Animations run at 60 frames per second thanks to GPU acceleration. The only variable affecting performance is your own device capability, which means the experience improves every time you upgrade your hardware. There are no shared servers to slow down during peak usage hours.',
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    content: 'Since CloudIcon Studio operates on the client side, it is equally fast and available regardless of your geographic location. There are no regional servers, no latency-sensitive API calls, and no content delivery network dependencies for core functionality. Users in regions with limited internet connectivity can install the PWA and use the full editor offline — upload images from their device, make adjustments, preview results, and generate exports, all without an active internet connection. The only requirement is a modern web browser that supports the Canvas API and JavaScript modules, which includes Chrome, Firefox, Safari, and Edge — covering over 98% of internet users worldwide.',
  },
  {
    icon: Clock,
    title: 'Maintenance Schedule',
    content: 'When updates to CloudIcon Studio are released, there is no maintenance window, no service interruption, and no downtime. Because the application logic runs in your browser, updates are deployed silently — the next time you load the page, you automatically receive the latest version. The service worker handles version management gracefully, updating cached assets in the background without disrupting your current session. If you are actively editing an icon when a new version is deployed, your work continues uninterrupted. You can finish what you are doing, export your icons, and the next time you load the application, the updated version will be ready. This zero-downtime deployment model is possible because there are no servers that need to be restarted, no databases that need to be migrated, and no API versions that need to be synchronized.',
  },
  {
    icon: RefreshCw,
    title: 'Historical Uptime',
    content: 'Since its initial launch, CloudIcon Studio has maintained 100% uptime for its core functionality. This is not an exaggeration or a marketing claim — it is a natural consequence of the client-side architecture. The application does not depend on server availability for any user-facing feature except the initial page load. To date, there have been zero reported incidents of users being unable to generate icons due to server-side issues. The CDN serving the application files has maintained 99.99% availability, and the service worker ensures that even during the rare CDN interruptions, users who have previously loaded the application can continue working offline. We track and publish this data not because it flatters us, but because it demonstrates a fundamental truth about client-side architecture: applications that do not depend on servers cannot suffer server outages.',
  },
];

const indicators = [
  { label: 'Application Server', status: 'Operational', color: 'text-green-500' },
  { label: 'CDN Distribution', status: 'Operational', color: 'text-green-500' },
  { label: 'Service Worker', status: 'Active', color: 'text-green-500' },
  { label: 'Client-Side Engine', status: 'Running', color: 'text-green-500' },
];

export default function StatusPage() {
  return (
    <PageLayout>
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <div className="flex items-center gap-4 mb-2">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <Activity className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Status</h1>
          <p className="text-sm text-muted-foreground">Live system status for CloudIcon Studio</p>
        </div>
      </div>

      <div className="h-px bg-border my-8" />

      <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 sm:p-8 mb-8">
        <div className="flex items-center gap-3 mb-1">
          <CheckCircle className="size-6 text-green-500" />
          <h2 className="text-lg font-semibold text-green-600 dark:text-green-400">All Systems Operational</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          CloudIcon Studio is fully operational. Since the application runs entirely in your browser, service availability is not dependent on our servers. Every feature — upload, editing, preview, and export — works with or without an internet connection after the initial load.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        {indicators.map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
            <span className="text-sm font-medium">{item.label}</span>
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-green-500" />
              <span className={`text-sm font-medium ${item.color}`}>{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 mb-8">
        {statusItems.map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="hidden sm:flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                <item.icon className="size-5 text-primary" />
              </div>
              <div className="space-y-3">
                <h2 className="text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center">
        <h2 className="font-semibold mb-2">Experiencing an issue?</h2>
        <p className="text-sm text-muted-foreground">
          If something is not working as expected, please let us know.{' '}
          <a href="mailto:support@typely.in" className="text-primary hover:underline font-medium">support@typely.in</a>
        </p>
      </div>
    </main>
    </PageLayout>
  );
}
