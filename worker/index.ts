interface Env {
  ASSETS: Fetcher
  TMDB_API_KEY?: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // Intercept TMDB API requests securely on the edge
    if (url.pathname.startsWith('/api/tmdb/')) {
      const tmdbSubPath = url.pathname.replace('/api/tmdb', '')
      const targetUrl = new URL(`https://api.themoviedb.org/3${tmdbSubPath}`)

      // Copy incoming query parameters
      url.searchParams.forEach((value, key) => {
        targetUrl.searchParams.set(key, value)
      })

      // Inject private API key securely on the server side
      const apiKey = env.TMDB_API_KEY || 'd1d3b56748ca43921362d18b8c21a06f'
      targetUrl.searchParams.set('api_key', apiKey)

      if (!targetUrl.searchParams.has('language')) {
        targetUrl.searchParams.set('language', 'es-ES')
      }

      // Fetch from TMDB
      const tmdbResponse = await fetch(targetUrl.toString(), {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'MiCarteleraPersonal/1.0',
        },
      })

      const responseHeaders = new Headers(tmdbResponse.headers)
      responseHeaders.set('Access-Control-Allow-Origin', '*')
      responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
      responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type')

      // Cache API responses at Cloudflare edge for performance
      responseHeaders.set('Cache-Control', 'public, max-age=1800, s-maxage=3600')

      return new Response(tmdbResponse.body, {
        status: tmdbResponse.status,
        statusText: tmdbResponse.statusText,
        headers: responseHeaders,
      })
    }

    // Pass through all other requests to static assets (SPA router)
    return env.ASSETS.fetch(request)
  },
}
