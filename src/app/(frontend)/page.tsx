import React from 'react';
import { Hero } from '@/components/hero/hero';
import { LossesInfographic } from '@/components/losses-infographic/losses-infographic';

export default async function HomePage() {
  return (
    <div className="flex justify-center flex-col gap-20 container mx-auto">
      <Hero className="mt-10" />
      <LossesInfographic />
    </div>
  );
} 