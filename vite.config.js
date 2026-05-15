import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        id: 'com.lumena',
        name: 'Lumena Velas Aromáticas',
        short_name: 'Lumena',
        description: 'Aplicativo PWA para divulgação de velas aromáticas',
        theme_color: '#0C2645',
        background_color: '#F8F9F9',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',

          },
        ],
      },

      workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
  cleanupOutdatedCaches: true,
  sourcemap: false,

  runtimeCaching: [
    {
      urlPattern: /^http:\/\/127\.0\.0\.1:8000\/api\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24,
        },
        networkTimeoutSeconds: 10,
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
},

      devOptions: {
        enabled: true,
      },
    }),

    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
