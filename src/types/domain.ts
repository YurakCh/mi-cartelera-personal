import type { Database, EstadoContenido, TipoContenido } from './supabase'

export type WatchlistItem = Database['public']['Tables']['mi_lista']['Row']
export type WatchlistInsert = Database['public']['Tables']['mi_lista']['Insert']
export type WatchlistUpdate = Database['public']['Tables']['mi_lista']['Update']

export type MediaType = TipoContenido
export type WatchStatus = EstadoContenido

export const WATCH_STATUS_CONFIG: Record<
  WatchStatus,
  { label: string; badgeColor: string; bgSoft: string; textClass: string }
> = {
  por_ver: {
    label: 'Por Ver',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    bgSoft: 'bg-amber-500/10',
    textClass: 'text-amber-400',
  },
  viendo: {
    label: 'Viendo',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    bgSoft: 'bg-blue-500/10',
    textClass: 'text-blue-400',
  },
  vista: {
    label: 'Vista',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    bgSoft: 'bg-emerald-500/10',
    textClass: 'text-emerald-400',
  },
}

export const MEDIA_TYPE_CONFIG: Record<
  MediaType,
  { label: string; badgeColor: string }
> = {
  pelicula: {
    label: 'Película',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  serie: {
    label: 'Serie',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
}
