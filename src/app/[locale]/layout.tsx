import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { generatePageMetadata } from '@/lib/metadata';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import { CustomCursor } from '@/components/ui/CustomCursor/CustomCursor';
import { Navbar } from '@/components/layout/Navbar/Navbar';
import { Analytics } from '@vercel/analytics/react';
import { IntroLoader } from '@/components/ui/IntroLoader/IntroLoader';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata(locale);
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

import { setRequestLocale } from 'next-intl/server';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Ensure that the incoming `locale` is valid
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();
  
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${GeistSans.variable} ${GeistMono.variable} ${ibmPlexArabic.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <IntroLoader />
          <CustomCursor />
          <Navbar />
          {children}
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
