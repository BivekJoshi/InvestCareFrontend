/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // three.js ships untranspiled ESM examples; Next handles this natively via transpilePackages.
  transpilePackages: ['three'],
};

export default nextConfig;
