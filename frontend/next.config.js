/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: 'public',
  disable: false,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  dynamicStartUrl: true,
  cacheStartUrl: true,
  runtimeCaching: [
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|ico|js|css)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "static-images",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /.*/i, 
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 60 * 60 * 24,
        },
      },
    }
  ],
});

module.exports = withPWA({
  
});
