import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generatePageMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: {
      default: t('title'),
      template: '%s | Ionity',
    },
    description: t('description'),
    alternates: {
      canonical: `https://ionitytech.com/${locale}`,
      languages: {
        'en': 'https://ionitytech.com/en',
        'ar': 'https://ionitytech.com/ar',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://ionitytech.com/${locale}`,
      siteName: 'Ionity',
      images: [`/og/og-${locale}.png`],
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: [`/og/og-${locale}.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ionity',
    url: 'https://ionitytech.com',
    logo: 'https://ionitytech.com/icons/ionity-logo.svg',
    description: 'Premium software engineering for high-performance web systems.',
    sameAs: [
      'https://github.com/ionity',
      'https://linkedin.com/company/ionity',
      'https://x.com/ionity'
    ]
  };
}
