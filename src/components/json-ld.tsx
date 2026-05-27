export function JsonLd() {
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://cloudicon.studio/#organization',
    name: 'CloudIcon Studio',
    url: 'https://cloudicon.studio',
    legalName: 'CloudIcon Studio',
    foundingDate: '2026',
    description: 'Free online app icon generator that runs entirely in your browser. Generate production-ready icons for Android, iOS, Web, and Desktop.',
    email: 'support@typely.in',
    image: 'https://cloudicon.studio/og-image.png',
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://cloudicon.studio/#website',
    name: 'CloudIcon Studio',
    url: 'https://cloudicon.studio',
    description: 'Generate perfect app icons for Android, iOS & Web. Free, fast, and runs entirely in your browser.',
    publisher: { '@id': 'https://cloudicon.studio/#organization' },
    inLanguage: 'en-US',
    datePublished: '2026-05-16',
  };

  const webApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': 'https://cloudicon.studio/#webapplication',
    name: 'CloudIcon Studio',
    url: 'https://cloudicon.studio',
    description: 'Generate perfect app icons for Android, iOS & Web. Free, fast, and runs entirely in your browser with zero server uploads.',
    applicationCategory: 'DesignApplication',
    applicationSubCategory: 'Icon Generator',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Works in Chrome, Edge, Firefox, Safari, Brave.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@id': 'https://cloudicon.studio/#organization' },
    image: 'https://cloudicon.studio/og-image.png',
    screenshot: 'https://cloudicon.studio/og-image.png',
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
    '@id': 'https://cloudicon.studio/#breadcrumb',
    name: 'Breadcrumb',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cloudicon.studio' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}
