import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type ConfigEnv, type UserConfig } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.VITE_TMDB_API_KEY || 'd1d3b56748ca43921362d18b8c21a06f'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api/tmdb': {
          target: 'https://api.themoviedb.org/3',
          changeOrigin: true,
          configure: (proxy: any) => {
            proxy.on('proxyReq', (proxyReq: any, req: any) => {
              const url = new URL(req.url || '', 'http://localhost')
              url.searchParams.set('api_key', apiKey)
              if (!url.searchParams.has('language')) {
                url.searchParams.set('language', 'es-ES')
              }
              proxyReq.path =
                url.pathname.replace(/^\/api\/tmdb/, '') + url.search
            })
          },
        },
      },
    },
  }
})