import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

// After the client build, inject the SSR-rendered HTML into each page.
// Runs before the PWA plugin's closeBundle so Workbox precaches the final HTML.
const pages = { 'index.html': 'render', 'dicionario.html': 'renderDicionario' } as const

function prerender(): Plugin {
  return {
    name: 'tuga-prerender',
    apply: 'build',
    async closeBundle() {
      const entry = resolve(process.cwd(), 'dist-ssr/entry-server.js')
      if (!existsSync(entry)) return
      const server = await import(pathToFileURL(entry).href)

      for (const [page, renderer] of Object.entries(pages)) {
        const pagePath = resolve(process.cwd(), 'dist', page)
        if (!existsSync(pagePath)) continue
        const html = readFileSync(pagePath, 'utf8')
        const appHtml: string = server[renderer]()
        writeFileSync(pagePath, html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`))
      }
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  // Two static pages; the SSR build has its own entry (src/entry-server.tsx).
  build: isSsrBuild
    ? {}
    : { rollupOptions: { input: Object.keys(pages).map((page) => resolve(process.cwd(), page)) } },
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
