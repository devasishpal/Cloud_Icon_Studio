'use client';

import { usePathname } from 'next/navigation';

function getBaseUrl(): string {
  return 'https://cloudicon.vercel.app';
}

const breadcrumbLabels: Record<string, string> = {
  '/': 'Home',
  '/editor': 'Free App Icon Editor',
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
  const baseUrl = getBaseUrl();
  const items: { '@type': 'ListItem'; position: number; name: string; item: string }[] = [];

  items.push({ '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl });

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
        item: baseUrl + cumulative,
      });
    }
  }

  return items;
}

export function JsonLd() {
  const pathname = usePathname();
  const base = getBaseUrl();

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: 'CloudIcon Studio',
    url: base,
    legalName: 'CloudIcon Studio',
    foundingDate: '2026-01',
    description: 'Free online app icon generator that runs entirely in your browser. Generate production-ready launcher icons, favicons, adaptive icons, and complete icon packs for Android, iOS, Web, and Desktop.',
    email: 'support@typely.in',
    image: `${base}/og-image.png`,
    logo: `${base}/icon-512.png`,
    sameAs: [
      'https://github.com/cloudicon-studio',
    ],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${base}/#website`,
    name: 'CloudIcon Studio',
    url: base,
    description: 'Free online app icon generator and editor. Create polished launcher icons, favicons, adaptive icons, and complete export packs for Android, iOS & Web. 100% client-side.',
    publisher: { '@id': `${base}/#organization` },
    inLanguage: 'en-US',
    datePublished: '2026-05-16',
    dateModified: new Date().toISOString().split('T')[0],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${base}/#webapplication`,
    name: 'CloudIcon Studio — App Icon Generator',
    url: `${base}/editor`,
    description: 'Free online app icon editor and generator. Upload once, instantly generate launcher icons, favicons, mipmaps, adaptive icons, and complete export packs for Android, iOS & Web.',
    applicationCategory: 'DesignApplication',
    applicationSubCategory: 'Icon Generator',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Works in Chrome, Edge, Firefox, Safari, and Brave.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    author: { '@id': `${base}/#organization` },
    image: `${base}/og-image.png`,
    screenshot: `${base}/og-image.png`,
    softwareVersion: '1.0.0',
    datePublished: '2026-05-16',
    dateModified: new Date().toISOString().split('T')[0],
    featureList: [
      'Multi-platform icon export (Android, iOS, Web, Desktop)',
      'GPU-accelerated canvas with real-time rendering',
      'Live previews with device mockups',
      'Shape, crop, rotate, background, and padding tools',
      'Undo/redo with keyboard shortcuts',
      '100% client-side, zero uploads, no accounts',
      'PWA with offline support',
      'Adaptive icon generator for Android',
      'iOS App Store icon sets with Contents.json',
      'Web favicon and PWA manifest icon export',
      'Desktop icon export (Windows ICO, macOS ICNS, Linux PNG)',
      'ZIP export with proper folder hierarchy per platform',
    ],
    keywords: 'app icon generator, favicon generator, android icon generator, ios icon generator, adaptive icon generator, icon maker, free icon editor, app icon creator',
    sameAs: [
      'https://github.com/cloudicon-studio',
    ],
  };

  const softwareApp = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${base}/#softwareapplication`,
    name: 'CloudIcon Studio',
    url: base,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Windows, macOS, Linux, Android, iOS',
    description: 'Progressive web app for generating app icons. Runs entirely client-side with zero server uploads.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@id': `${base}/#organization` },
    image: `${base}/og-image.png`,
    softwareVersion: '1.0.0',
    storageRequirements: 'Works in browser, no installation needed',
  };

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Generate App Icons with CloudIcon Studio',
    description: 'Create polished app icons for Android, iOS, Web, and Desktop in minutes — entirely in your browser. No downloads or accounts required.',
    estimatedTime: 'PT1M',
    step: [
      { '@type': 'HowToStep', position: 1, name: 'Upload an image',
        text: 'Upload your icon, logo, or design from the home page or open the free app icon editor directly.' },
      { '@type': 'HowToStep', position: 2, name: 'Customize your icon',
        text: 'Use the left panel to adjust rotation, background color or gradient, padding, crop area, safe area, and shape.' },
      { '@type': 'HowToStep', position: 3, name: 'Preview results',
        text: 'Preview your icon in real time on device mockups for Android phones and tablets, iPhones and iPads, Web, or Desktop.' },
      { '@type': 'HowToStep', position: 4, name: 'Download your pack',
        text: 'Click Generate & Download to export your complete icon pack as a ZIP file with proper folder hierarchy for each platform.' },
    ],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${base}/#breadcrumb`,
    name: 'Breadcrumb',
    itemListElement: buildBreadcrumbItems(pathname),
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${base}/#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What file formats can I upload to the app icon generator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can upload PNG, JPG, WEBP, and SVG files. For best results generating app icons, use a square source image at least 1024×1024px.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are my images uploaded to a server when I make app icons?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Everything runs entirely in your browser using the Canvas API. Your image never leaves your device — 100% private and secure.',
        },
      },
      {
        '@type': 'Question',
        name: 'What platforms can I generate icons for?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Android (mipmap mdpi-xxxhdpi, adaptive icons, monochrome, Play Store listings), iOS (iPhone, iPad, App Store), Web (favicons, PWA manifest icons, tile images), and Desktop (Windows ICO, macOS ICNS, Linux PNG).',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I customize the background of my app icon?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Solid colors, linear gradients, or transparent backgrounds are all supported with a live preview as you edit your icon online.',
        },
      },
      {
        '@type': 'Question',
        name: 'What export format does the icon pack generator use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'All icons are exported as PNG. The download is a structured ZIP archive with proper folder hierarchy for each platform, ready to drop into your project.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is this free app icon maker really free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, completely free. There are no usage limits, no account required, no sign-ups, and no hidden charges. Generate as many icon packs as you need.',
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, '\\u003c') }} />
      {pathname === '/' && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage).replace(/</g, '\\u003c') }} />
      )}
    </>
  );
}
