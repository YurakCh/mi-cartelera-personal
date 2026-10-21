import type {
  TMDBCastMember,
  TMDBMediaDetail,
  TMDBSearchItem,
  TMDBSearchResponse,
} from '@/types/tmdb'

// Secure Backend-For-Frontend Proxy URL
// In production: Handled by Cloudflare Edge Worker
// In local dev: Handled by Vite server proxy
const TMDB_API_PROXY = '/api/tmdb'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export function getImageUrl(
  path: string | null | undefined,
  size: 'w185' | 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'
): string {
  if (!path) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80'
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`
}

async function fetchFromTMDB<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const queryParams = new URLSearchParams({
    language: 'es-ES',
    ...params,
  })

  // The client never sends nor exposes the API key. The server proxy injects it securely.
  const url = `${TMDB_API_PROXY}${endpoint}?${queryParams.toString()}`

  const response = await fetch(url)
  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(
      `Error al comunicarse con TMDB (${response.status}): ${response.statusText}. ${errorBody}`
    )
  }

  return response.json() as Promise<T>
}

export async function searchMulti(
  query: string,
  page: number = 1
): Promise<TMDBSearchItem[]> {
  const cleanQuery = query.trim()
  if (!cleanQuery) return []

  const data = await fetchFromTMDB<TMDBSearchResponse>('/search/multi', {
    query: cleanQuery,
    page: page.toString(),
    include_adult: 'false',
  })

  // Filter out people or media without posters or valid type
  return data.results.filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv'
  )
}

interface TMDBRawDetail {
  id: number
  title?: string
  name?: string
  original_title?: string
  original_name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  vote_count: number
  runtime?: number | null
  number_of_seasons?: number
  number_of_episodes?: number
  genres: Array<{ id: number; name: string }>
  tagline?: string
  status?: string
  credits?: {
    cast?: Array<{
      id: number
      name: string
      character: string
      profile_path: string | null
      order: number
    }>
  }
}

export async function getMediaDetail(
  tmdbId: number,
  type: 'pelicula' | 'serie'
): Promise<TMDBMediaDetail> {
  const endpoint = type === 'pelicula' ? `/movie/${tmdbId}` : `/tv/${tmdbId}`
  const raw = await fetchFromTMDB<TMDBRawDetail>(endpoint, {
    append_to_response: 'credits',
  })

  const cast: TMDBCastMember[] = (raw.credits?.cast || [])
    .slice(0, 10)
    .map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
      order: c.order,
    }))

  return {
    id: raw.id,
    title: raw.title || raw.name || 'Sin título',
    original_title: raw.original_title || raw.original_name,
    overview: raw.overview || 'Sin descripción disponible.',
    poster_path: raw.poster_path,
    backdrop_path: raw.backdrop_path,
    release_date: raw.release_date || raw.first_air_date || '',
    vote_average: raw.vote_average || 0,
    vote_count: raw.vote_count || 0,
    runtime: raw.runtime,
    number_of_seasons: raw.number_of_seasons,
    number_of_episodes: raw.number_of_episodes,
    genres: raw.genres || [],
    tagline: raw.tagline,
    status: raw.status,
    media_type: type === 'pelicula' ? 'movie' : 'tv',
    cast,
  }
}
