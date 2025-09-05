/* eslint-env node */
/* eslint-disable no-undef */
// next.config.js
module.exports = {
  output: 'standalone',
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}