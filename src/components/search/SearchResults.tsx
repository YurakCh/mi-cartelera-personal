import type { TMDBSearchItem } from '@/types/tmdb'
import type { WatchlistItem } from '@/types/domain'
import { MediaCard } from './MediaCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Film, SearchX } from 'lucide-react'

interface SearchResultsProps {
  items: TMDBSearchItem[]
  loading: boolean
  query: string
  watchlistItems: WatchlistItem[]
  onSelect: (item: TMDBSearchItem) => void
  onQuickAdd: (item: TMDBSearchItem) => void
  addingId?: number | null
}

export function SearchResults({
  items,
  loading,
  query,
  watchlistItems,
  onSelect,
  onQuickAdd,
  addingId,
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (query.trim() && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-400 mb-3">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">
          No se encontraron resultados para "{query}"
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Intenta buscar con otro término, verifica la ortografía o busca el título en su idioma original.
        </p>
      </div>
    )
  }

  if (!query.trim() && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
          <Film className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">
          Explora películas y series
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Escribe el título de cualquier película o serie en la barra superior para buscar en la base de datos de TMDB.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map((item) => {
        const isMovie = item.media_type === 'movie' || 'title' in item
        const mediaType = isMovie ? 'pelicula' : 'serie'
        const saved = watchlistItems.find(
          (w) => w.tmdb_id === item.id && w.tipo_contenido === mediaType
        )

        return (
          <MediaCard
            key={`${item.id}-${mediaType}`}
            item={item}
            watchlistItem={saved}
            onSelect={onSelect}
            onQuickAdd={onQuickAdd}
            isAdding={addingId === item.id}
          />
        )
      })}
    </div>
  )
}
