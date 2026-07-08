import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true,
      },

      manifest: {
        name: "Todo PWA",
        short_name: "Todo",

        description:
          "Offline-first Todo application built with Vue, RxDB and IndexedDB.",

        theme_color: "#2563EB",
        background_color: "#FFFFFF",

        display: "standalone",

        start_url: "/",

        icons: [
          {
            src: "todo_pwa_icon_1.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "todo_pwa_icon_2.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,woff2}"
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
