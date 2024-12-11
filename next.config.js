const withImages = require('next-images');
const withPWA = require('next-pwa')({
  dest: 'public',
});
const { i18n } = require('./next-i18next.config');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const path = require('path');

module.exports = {
  i18n,

  reactStrictMode: true,
  images: {
    domains: ['arweave.net'],
  },
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
    ];
  },
  pwa: {
    register: true,
    skipWaiting: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "variables.scss";`,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'arweave.net', port: '', pathname: '/**' },
    ],
  },
  plugins: [
    // To strip all locales except “en”
    new MomentLocalesPlugin(),

    // Or: To strip all locales except “en”, “es-us” and “ru”
    // (“en” is built into Moment and can’t be removed)
    new MomentLocalesPlugin({
      localesToKeep: ['en', 'ru'],
    }),
  ],
};
// module.exports = withPWA({
//   ...withImages(),
//   i18n,
//   headers() => {

//   },
//   output: 'standalone',
//   pwa: {
//     register: true,
//     skipWaiting: true,
//   },
//   sassOptions: {
//     includePaths: [path.join(__dirname, 'styles')],
//     prependData: `@import "variables.scss";`,
//   },
//   images: {
//     remotePatterns: [
//       { protocol: 'https', hostname: 'arweave.net', port: '', pathname: '/**' },
//     ],
//   },
//   plugins: [
//     // To strip all locales except “en”
//     new MomentLocalesPlugin(),

//     // Or: To strip all locales except “en”, “es-us” and “ru”
//     // (“en” is built into Moment and can’t be removed)
//     new MomentLocalesPlugin({
//       localesToKeep: ['en', 'ru'],
//     }),
//   ],
// });
