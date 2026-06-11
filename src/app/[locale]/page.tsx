import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/sections/Hero/Hero';
import { SocialProof } from '@/components/sections/SocialProof/SocialProof';
import { ProblemSolution } from '@/components/sections/ProblemSolution/ProblemSolution';
import { Features } from '@/components/sections/Features/Features';
import { HowItWorks } from '@/components/sections/HowItWorks/HowItWorks';
import { About } from '@/components/sections/About/About';
import { Metrics } from '@/components/sections/Metrics/Metrics';
import { ProductShowcase } from '@/components/sections/ProductShowcase/ProductShowcase';
import { Testimonials } from '@/components/sections/Testimonials/Testimonials';
import { Contact } from '@/components/sections/Contact/Contact';
import { CTA } from '@/components/sections/CTA/CTA';
import { Footer } from '@/components/sections/Footer/Footer';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <SocialProof />
      <ProblemSolution />
      <Features />
      <About />
      <HowItWorks />
      <Metrics />
      <ProductShowcase />
      <Testimonials />
      <CTA />
      <Contact />
      <Footer />
    </main>
  );
}
