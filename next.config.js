/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  // Vercel specific settings
  output: 'standalone',
};

module.exports = nextConfig; 