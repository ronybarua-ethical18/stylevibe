/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable Next.js built-in ESLint since we're using our own
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Any experimental features you might need
  },
};

module.exports = nextConfig;
