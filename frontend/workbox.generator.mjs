import { generateSW } from 'workbox-build';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  swDest: path.join(__dirname, 'dist', 'sw.js'),
  clientsClaim: true,
  skipWaiting: true,
  globPatterns: ['**/*.{js,css,html,png,svg,json,xml}'],
  globIgnores: [
    'node_modules/**/*',
    'dist/sw.js',
    'src/**/*',
    '**/*.map',
    'workbox*.mjs',
    'workbox*.js',
  ],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-styles',
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 60 * 60 * 24 * 7,
        },
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
  ],
  navigateFallback: '/index.html',
  navigateFallbackDenylist: [/^\/api\//, /^\/_/, /\.map$/],
};

try {
  await generateSW(config);
  console.log('Service worker generated successfully!');
} catch (error) {
  console.error('Error generating service worker:', error);
  process.exit(1);
}
