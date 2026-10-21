export type TMDBMediaType = 'movie' | 'tv'

export interface TMDBMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  media_type?: 'movie'
}

export interface TMDBSeries {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date?: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  media_type?: 'tv'
}

export type TMDBSearchItem = (TMDBMovie | TMDBSeries) & {
  media_type?: 'movie' | 'tv' | 'person'
}

export interface TMDBSearchResponse {
  page: number
  results: TMDBSearchItem[]
  total_pages: number
  total_results: number
}

export interface TMDBCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TMDBMediaDetail {
  id: number
  title: string
  original_title?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  vote_average: number
  vote_count: number
  runtime?: number | null // in minutes for movies
  number_of_seasons?: number // for series
  number_of_episodes?: number // for series
  genres: Array<{ id: number; name: string }>
  tagline?: string
  status?: string
  media_type: 'movie' | 'tv'
  cast: TMDBCastMember[]
}
