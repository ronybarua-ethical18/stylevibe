/* eslint-env node */
/* eslint-disable no-undef */
// next.config.js
module.exports = {
  compiler: {
    styledComponents: true,
  },
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}