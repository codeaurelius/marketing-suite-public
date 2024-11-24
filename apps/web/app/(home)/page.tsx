// Keeping the original imports as documentation
/*
import { showBetaFeature } from '@repo/feature-flags';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import { Cases } from './components/cases';
import { CTA } from './components/cta';
import { FAQ } from './components/faq';
import { Features } from './components/features';
import { Hero } from './components/hero';
import { Stats } from './components/stats';
import { Testimonials } from './components/testimonials';
*/

import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';

const meta = {
  title: 'Amaze Suite - Simplify Your Marketing',
  description:
    '[1] Amaze Suite helps you streamline your marketing operations and achieve better results.',
};

export const metadata: Metadata = createMetadata(meta);

const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h1 className="mb-6 font-bold text-6xl text-gray-900 tracking-tight">
          Amaze Suite
        </h1>
        <p className="mx-auto max-w-2xl text-gray-600 text-xl">
          Your marketing operations, simplified.
        </p>
      </div>
    </main>
  );
};

export default Home;

/* Original component for documentation
const Home = async () => {
  const betaFeature = await showBetaFeature();

  return (
    <>
      {betaFeature && (
        <div className="w-full bg-black py-2 text-center text-white">
          Beta feature now available
        </div>
      )}
      <Hero />
      <Cases />
      <Features />
      <Stats />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
};
*/
