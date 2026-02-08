import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      filename: 'sw.js',
      registerType: 'autoUpdate',
      includeAssets: ['assets/icons/icon-192.png','assets/icons/icon-512.png'],
      manifest: {
        name: 'Terraria Inventory Editor',
        short_name: 'TIE',
        start_url: '/',
        display: 'standalone',
        theme_color: '#0d6efd',
        icons: [
          { src: 'assets/icons/icon-192.png', sizes:'192x192', type:'image/png' },
          { src: 'assets/icons/icon-512.png', sizes:'512x512', type:'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/assets\/items\/.*\.(?:png|jpg|svg)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'item-sprites', expiration: { maxEntries:600, maxAgeSeconds:30*24*3600 } }
          }
        ]
      }
    })
  ]
})
