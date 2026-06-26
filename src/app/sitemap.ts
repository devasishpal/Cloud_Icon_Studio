import type { MetadataRoute } from 'next';

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://cloudicon.typely.in';
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl();
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/editor`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/docs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/changelog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.4 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/status`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/ccpa`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/gdpr`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/cookies`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];
}
