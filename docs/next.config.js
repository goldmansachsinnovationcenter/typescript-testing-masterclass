/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: '/typescript-testing-masterclass',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  assetPrefix: '/typescript-testing-masterclass',
  trailingSlash: true,
};

module.exports = nextConfig;
