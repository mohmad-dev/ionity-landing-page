import { setRequestLocale } from 'next-intl/server';
import { ImmersiveSceneLoader } from '@/components/ImmersiveScene/ImmersiveSceneLoader';
import { Contact } from '@/components/sections/Contact/Contact';
import { Footer } from '@/components/sections/Footer/Footer';

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      {/* Fully immersive 3D scroll experience */}
      <ImmersiveSceneLoader />

      {/* Contact + Footer outside the immersive scene */}
      <Contact />
      <Footer />
    </main>
  );
}
