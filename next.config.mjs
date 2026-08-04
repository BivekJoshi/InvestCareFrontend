/**
 * `BUILD_TARGET=static` produces a plain HTML/CSS/JS bundle in `out/` for
 * upload to cPanel, where there is no Node process to serve the site. Every
 * route is already prerendered, so nothing is lost — but the on-demand image
 * optimiser needs a server, hence `unoptimized` in that mode only.
 *
 * Left unset, the build behaves normally so `npm start` still works locally.
 */
const isStaticExport = process.env.BUILD_TARGET === 'static';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: isStaticExport ? 'export' : undefined,
  images: {
    formats: ['image/avif', 'image/webp'],
    unoptimized: isStaticExport,
  },
  // three.js ships untranspiled ESM examples; Next handles this natively via transpilePackages.
  transpilePackages: ['three'],
};

export default nextConfig;
