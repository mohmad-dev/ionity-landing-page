'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import React, { useTransition } from 'react';

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        minHeight: '48px',
        minWidth: '48px',
        borderRadius: '24px',
        border: '1px solid var(--border-subtle)',
        background: 'transparent',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.875rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        opacity: isPending ? 0.5 : 1
      }}
    >
      <span>{locale === 'en' ? 'عربي' : 'EN'}</span>
    </button>
  );
};
