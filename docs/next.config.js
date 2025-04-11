/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: process.env.NODE_ENV === 'production' ? '/typescript-testing-masterclass' : '',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '/typescript-testing-masterclass' : '',
  trailingSlash: true,
};

module.exports = nextConfig;
