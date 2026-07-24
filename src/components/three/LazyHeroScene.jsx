'use client';

import dynamic from 'next/dynamic';

/**
 * WebGL is browser-only and heavy, so the scene is code-split and never
 * server-rendered. The gradient fallback keeps the hero looking finished
 * while the chunk loads.
 */
const HeroScene = dynamic(() => import('./HeroScene'), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full bg-[radial-gradient(circle_at_60%_45%,rgba(87,164,121,.28),transparent_62%)]"
      aria-hidden="true"
    />
  ),
});

export default HeroScene;
