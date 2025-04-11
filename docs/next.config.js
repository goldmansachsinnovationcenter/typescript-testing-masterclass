/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  basePath: process.env.NODE_ENV === 'production' && process.env.CI_PROJECT_NAME ? `/${process.env.CI_PROJECT_NAME}` : '',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  assetPrefix: process.env.NODE_ENV === 'production' && process.env.CI_PROJECT_NAME ? `/${process.env.CI_PROJECT_NAME}` : '',
  trailingSlash: true,
};

module.exports = nextConfig;
