import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'gsap'],
    viewTransition: true,
  },
  cacheComponents: true,
};

export default withNextIntl(nextConfig);
