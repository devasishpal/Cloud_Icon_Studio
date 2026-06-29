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
        { url: "/icon.png", type: "image/png" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: "/icon.png", sizes: "any", type: "image/png" }],
      other: [{ rel: "mask-icon", url: "/icon.png", color: "#215ee9" }],
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-064B1NNVF3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-064B1NNVF3');
          `}
        </Script>
      </body>
    </html>
  );
}
