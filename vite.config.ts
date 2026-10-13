import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// After the client build, inject the SSR-rendered app shell into dist/index.html.
// Runs before the PWA plugin's closeBundle so Workbox precaches the final HTML.
function prerender(): Plugin {
  return {
    name: 'tuga-prerender',
    apply: 'build',
    async closeBundle() {
      const entry = resolve(process.cwd(), 'dist-ssr/entry-server.js')
      const indexPath = resolve(process.cwd(), 'dist/index.html')
      if (!existsSync(entry) || !existsSync(indexPath)) return

      const { render } = await import(pathToFileURL(entry).href)
      const html = readFileSync(indexPath, 'utf8')
      const appHtml: string = render()
      writeFileSync(
        indexPath,
        html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
      )
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [
    react(),
    tailwindcss(),
    // The SSR build only needs React; skip prerender/PWA to avoid recursion.
    ...(isSsrBuild
      ? []
      : [
          prerender(),
          VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.svg', 'favicons/*.svg', 'robots.txt'],
            manifest: {
              name: 'Lorem Ipsum Tuga',
              short_name: 'Ipsum Tuga',
              description: 'O gerador de texto oficial para encher chouriços com orgulho nacional. 🇵🇹',
              lang: 'pt-PT',
              theme_color: '#046A38',
              background_color: '#046A38',
              display: 'standalone',
              orientation: 'portrait',
              categories: ['utilities', 'productivity'],
              icons: [
                { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
                { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
              ],
            },
            workbox: {
              // The OG image is for scrapers and manifest icons are added by the plugin; neither belongs in every visitor's first load.
              globPatterns: ['**/*.{js,css,html,svg,woff2}'],
              globIgnores: ['404.html', '404.css'],
              // Single-route app: only "/" (with or without share params) falls back offline, so unknown paths still reach the real 404.
              navigateFallbackAllowlist: [/^\/(\?.*)?$/],
            },
          }),
        ]),
  ],
}))
