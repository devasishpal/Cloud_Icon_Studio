'use client';

import { usePathname } from 'next/navigation';

const breadcrumbLabels: Record<string, string> = {
  '/': 'Home',
  '/editor': 'Editor',
  '/blog': 'Blog',
  '/docs': 'Documentation',
  '/how-it-works': 'How It Works',
  '/about': 'About',
  '/contact': 'Contact',
  '/privacy': 'Privacy Policy',
  '/terms': 'Terms of Service',
  '/changelog': 'Changelog',
  '/status': 'Service Status',
  '/cookies': 'Cookie Policy',
  '/ccpa': 'CCPA Compliance',
  '/gdpr': 'GDPR Compliance',
};

function buildBreadcrumbItems(pathname: string) {
  const base = 'https://cloudicon.typely.in';
  const items: { '@type': 'ListItem'; position: number; name: string; item: string }[] = [];

  items.push({ '@type': 'ListItem', position: 1, name: 'Home', item: base });

  if (pathname !== '/') {
    const segments = pathname.split('/').filter(Boolean);
    let cumulative = '';
    for (let i = 0; i < segments.length; i++) {
      cumulative += '/' + segments[i];
      const label = breadcrumbLabels[cumulative] || segments[i].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      items.push({
        '@type': 'ListItem',
        position: i + 2,
        name: label,
        item: base + cumulative,
      });
    }
  }

  return items;
}

export function JsonLd() {
  const pathname = usePathname();

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://cloudicon.typely.in/#organization',
    name: 'CloudIcon Studio',
    url: 'https://cloudicon.typely.in',
    legalName: 'CloudIcon Studio',
    foundingDate: '2026',
    description: 'Free online app icon generator that runs entirely in your browser. Generate production-ready icons for Android, iOS, Web, and Desktop.',
    email: 'support@typely.in',
    image: 'https://cloudicon.typely.in/og-image.png',
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://cloudicon.typely.in/#website',
    name: 'CloudIcon Studio',
    url: 'https://cloudicon.typely.in',
    description: 'Generate perfect app icons for Android, iOS & Web. Free, fast, and runs entirely in your browser.',
    publisher: { '@id': 'https://cloudicon.typely.in/#organization' },
    inLanguage: 'en-US',
    datePublished: '2026-05-16',
  };

  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://cloudicon.typely.in/#webapplication',
    name: 'CloudIcon Studio',
    url: 'https://cloudicon.typely.in',
    description: 'Generate perfect app icons for Android, iOS & Web. Free, fast, and runs entirely in your browser with zero server uploads.',
    applicationCategory: 'DesignApplication',
    applicationSubCategory: 'Icon Generator',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Works in Chrome, Edge, Firefox, Safari, Brave.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@id': 'https://cloudicon.typely.in/#organization' },
    image: 'https://cloudicon.typely.in/og-image.png',
    screenshot: 'https://cloudicon.typely.in/og-image.png',
    softwareVersion: '1.0.0',
    datePublished: '2026-05-16',
    featureList: [
      'Multi-platform icon export (Android, iOS, Web, Desktop)',
      'GPU-accelerated canvas with Fabric.js',
      'Real-time previews with device mockups',
      'Shape, crop, rotate, background, and padding tools',
      'Undo/redo with keyboard shortcuts',
      '100% client-side, zero uploads',
      'PWA with offline support',
      'Adaptive icon generation for Android',
      'iOS App Store icon sets with Contents.json',
      'Web favicon and PWA manifest icon export',
      'Desktop icon export (Windows ICO, macOS ICNS)',
      'ZIP export with proper folder hierarchy',
    ],
    keywords: 'app icon generator, favicon generator, android icon generator, ios icon generator, adaptive icon generator, icon maker',
    sameAs: [
      'https://github.com/cloudicon-studio',
    ],
  };

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Generate App Icons with CloudIcon Studio',
    description: 'Create polished app icons for Android, iOS, Web, and Desktop in minutes — entirely in your browser.',
    estimatedTime: 'PT1M',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Upload an image',
        text: 'Upload your icon, logo, or design from the home page or open the editor directly.' },
      { '@type': 'HowToStep', position: 2, name: 'Customize your icon',
        text: 'Use the left panel to adjust rotation, background, padding, crop, safe area, and shape.' },
      { '@type': 'HowToStep', position: 3, name: 'Preview results',
        text: 'Preview your icon in real time on device mockups for Android, iOS, Web, or Desktop.' },
      { '@type': 'HowToStep', position: 4, name: 'Download your pack',
        text: 'Click Generate & Download to export your complete icon pack as a ZIP file.' },
    ],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': 'https://cloudicon.typely.in/#breadcrumb',
    name: 'Breadcrumb',
    itemListElement: buildBreadcrumbItems(pathname),
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://cloudicon.typely.in/#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What file formats can I upload?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can upload PNG, JPG, WEBP, and SVG files. For best results, use a square source image at least 1024×1024px.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are my images uploaded to a server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Everything runs entirely in your browser using Canvas API. Your image never leaves your device.',
        },
      },
      {
        '@type': 'Question',
        name: 'What platforms are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Android (mipmap mdpi-xxxhdpi, adaptive icons, monochrome, Play Store), iOS (iPhone, iPad, App Store), Web (favicons, PWA), and Desktop (Windows, macOS, Linux).',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I customize the background?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Solid colors, linear gradients, or transparent backgrounds are supported with a live preview.',
        },
      },
      {
        '@type': 'Question',
        name: 'What export format is used?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All icons are exported as PNG. The download is a structured ZIP archive with proper folder hierarchy for each platform.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is it free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, completely free. There are no limits, no accounts, and no hidden charges.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {pathname === '/' && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
      )}
    </>
  );
}
