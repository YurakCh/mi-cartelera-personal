import type { TMDBSearchItem } from '@/types/tmdb'
import type { MediaType, WatchlistItem } from '@/types/domain'
import { MEDIA_TYPE_CONFIG, WATCH_STATUS_CONFIG } from '@/types/domain'
import { getImageUrl } from '@/lib/tmdbService'
import { Star, Plus, Check, Calendar } from 'lucide-react'

interface MediaCardProps {
  item: TMDBSearchItem
  watchlistItem?: WatchlistItem
  onSelect: (item: TMDBSearchItem) => void
  onQuickAdd: (item: TMDBSearchItem) => void
  isAdding?: boolean
}

export function MediaCard({
  item,
  watchlistItem,
  onSelect,
  onQuickAdd,
  isAdding = false,
}: MediaCardProps) {
  const isMovie = item.media_type === 'movie' || 'title' in item
  const title = (isMovie ? (item as any).title : (item as any).name) || 'Sin título'
  const date =
    (isMovie ? (item as any).release_date : (item as any).first_air_date) || ''
  const year = date ? date.split('-')[0] : ''
  const mediaType: MediaType = isMovie ? 'pelicula' : 'serie'
  const isSaved = !!watchlistItem

  return (
    <div className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-700 transition-all duration-300 flex flex-col">
      {/* Poster Image Container */}
      <div
        onClick={() => onSelect(item)}
        className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950 cursor-pointer"
      >
        <img
          src={getImageUrl(item.poster_path, 'w500')}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${
              MEDIA_TYPE_CONFIG[mediaType].badgeColor
            }`}
          >
            {MEDIA_TYPE_CONFIG[mediaType].label}
          </span>

          {item.vote_average > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-950/80 backdrop-blur-md border border-slate-800 text-amber-400 text-xs font-semibold">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{item.vote_average.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Watchlist Status Indicator (if already saved) */}
        {isSaved && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border backdrop-blur-md shadow-md ${
                WATCH_STATUS_CONFIG[watchlistItem.estado].badgeColor
              }`}
            >
              <Check className="w-3 h-3" />
              <span>{WATCH_STATUS_CONFIG[watchlistItem.estado].label}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Info & Quick Actions */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div onClick={() => onSelect(item)} className="cursor-pointer">
          <h4
            className="text-sm font-semibold text-slate-100 line-clamp-1 group-hover:text-amber-400 transition"
            title={title}
          >
            {title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            {year ? (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{year}</span>
              </span>
            ) : (
              <span className="text-slate-500">Año N/A</span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onSelect(item)}
            className="text-xs text-slate-400 hover:text-slate-200 font-medium transition cursor-pointer"
          >
            Ver detalle
          </button>

          {!isSaved ? (
            <button
              type="button"
              disabled={isAdding}
              onClick={() => onQuickAdd(item)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-xs font-semibold border border-amber-500/20 hover:border-transparent transition cursor-pointer disabled:opacity-50"
              title="Agregar a mi lista"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Guardar</span>
            </button>
          ) : (
            <span className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>En tu lista</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
