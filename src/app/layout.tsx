import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { JsonLd } from "@/components/json-ld";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'https://cloudicon.vercel.app';
}

export async function generateMetadata(): Promise<Metadata> {
  const base = getBaseUrl();
  return {
    title: {
      default: "CloudIcon Studio — Free App Icon Generator for Android, iOS & Web",
      template: "%s | CloudIcon Studio",
    },
    description:
      "Free app icon editor & generator. Upload once, instantly generate launcher icons, favicons, mipmaps, adaptive icons, and complete export packs for Android, iOS & Web. 100% client-side — no uploads, no servers, no accounts. Edit icons online with real-time preview, crop, rotate, background, and shape tools.",
    keywords: [
      "app icon generator",
      "android icon generator",
      "ios icon generator",
      "favicon generator",
      "adaptive icon generator",
      "icon pack generator",
      "mipmap generator",
      "app icon maker",
      "free icon generator",
      "icon maker online",
      "app icon designer",
      "notification icon generator",
      "icon creator",
      "create app icons online",
      "mobile app icon generator",
      "icon editor",
      "app icon creator free",
      "generate app icons",
      "icon design tool",
      "icon editing tool",
      "edit icons online",
      "free icon editor",
      "icon resize tool",
      "app icon resizer",
      "icon background changer",
      "icon crop tool",
      "icon shape editor",
      "icon padding tool",
      "android icon editor",
      "ios icon editor",
      "web icon editor",
      "icon preview tool",
      "icon export tool",
      "icon design online",
      "icon maker free",
    ],
    authors: [{ name: "CloudIcon Studio" }],
    creator: "CloudIcon Studio",
    publisher: "CloudIcon Studio",
    metadataBase: new URL(base),
    openGraph: {
      title: "CloudIcon Studio — Generate Perfect App Icons in Seconds",
      description:
        "Upload your icon once. Instantly generate launcher icons, favicons, mipmaps, adaptive icons for Android, iOS & Web. Free, no backend, runs in your browser.",
      url: base,
      siteName: "CloudIcon Studio",
      type: "website",
      locale: "en_US",
      images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: "CloudIcon Studio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "CloudIcon Studio — Free App Icon Generator",
      description:
        "Generate perfect app icons for Android, iOS & Web. Free, fast, and runs entirely in your browser.",
      images: [`${base}/og-image.png`],
      creator: "@cloudicon",
      site: "@cloudicon",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    },
    referrer: "origin-when-cross-origin",
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      other: [{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#7C3AED" }],
    },
    appleWebApp: {
      capable: true,
      title: "CloudIcon",
      statusBarStyle: "black-translucent",
    },
    other: {
      "msapplication-TileColor": "#215ee9",
      "format-detection": "telephone=no, email=no, address=no",
    },
    category: "design",
    classification: "Design Tool",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('theme');
                  var r = document.documentElement;
                  if (t === 'light' || (!t && window.matchMedia('(prefers-color-scheme: light)').matches)) {
                    r.classList.remove('dark');
                    r.classList.add('light');
                    r.style.colorScheme = 'light';
                  } else {
                    r.classList.add('dark');
                    r.style.colorScheme = 'dark';
                  }
                  r.classList.add('no-transitions');
                  requestAnimationFrame(function(){ r.classList.remove('no-transitions'); });
                } catch(e){}
              })();
            `,
          }} />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground overflow-x-hidden">
        <JsonLd />
        <ThemeProvider>
          <Navbar />
          {children}
          <CookieConsent />
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' ? (
          <Script
            id="sw-register"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js').catch(() => {});
                  });
                }
              `,
            }}
          />
        ) : (
          <Script
            id="sw-dev-cleanup"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                // Turbopack reuses dev chunk names. A service worker that caches
                // them would keep serving yesterday's modules (the "x is not a
                // function" class of errors), so development is always offline-free.
                if ('serviceWorker' in navigator) {
                  (async () => {
                    try {
                      const registrations = await navigator.serviceWorker.getRegistrations();
                      await Promise.all(registrations.map((r) => r.unregister()));
                      const keys = await caches.keys();
                      await Promise.all(keys.map((key) => caches.delete(key)));
                      const wasControlled = Boolean(navigator.serviceWorker.controller);
                      if (wasControlled && !sessionStorage.getItem('cloudicon-sw-cleaned')) {
                        sessionStorage.setItem('cloudicon-sw-cleaned', '1');
                        location.reload();
                      }
                    } catch (error) {}
                  })();
                }
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
