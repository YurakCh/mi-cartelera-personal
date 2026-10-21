import { useState, useEffect } from 'react'
import { searchMulti } from '@/lib/tmdbService'
import type { TMDBSearchItem } from '@/types/tmdb'
import type { MediaType } from '@/types/domain'
import { useDebounce } from '@/hooks/useDebounce'
import { useWatchlist } from '@/hooks/useWatchlist'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { DetailModal } from '@/components/detail/DetailModal'
import { ErrorFallback } from '@/components/ui/ErrorFallback'
import { Sparkles, TrendingUp } from 'lucide-react'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TMDBSearchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Watchlist hook
  const {
    items: watchlistItems,
    addItem,
    updateDetails,
    removeItem,
    isItemInWatchlist,
  } = useWatchlist()

  // Selected item for modal
  const [selectedMedia, setSelectedMedia] = useState<{
    id: number
    type: MediaType
  } | null>(null)
  const [addingId, setAddingId] = useState<number | null>(null)

  const debouncedQuery = useDebounce(query, 400)

  // Quick initial load suggestions
  useEffect(() => {
    let isMounted = true

    const doSearch = async (searchTerm: string) => {
      setLoading(true)
      setError(null)
      try {
        const items = await searchMulti(searchTerm)
        if (isMounted) setResults(items)
      } catch (err: unknown) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Error al buscar en TMDB.'
          )
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (debouncedQuery.trim()) {
      doSearch(debouncedQuery)
    } else {
      // Default initial explore view
      doSearch('Spider-Man')
    }

    return () => {
      isMounted = false
    }
  }, [debouncedQuery])

  const handleSelectMedia = (item: TMDBSearchItem) => {
    const isMovie = item.media_type === 'movie' || 'title' in item
    setSelectedMedia({
      id: item.id,
      type: isMovie ? 'pelicula' : 'serie',
    })
  }

  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const handleQuickAdd = async (item: TMDBSearchItem) => {
    const isMovie = item.media_type === 'movie' || 'title' in item
    const type: MediaType = isMovie ? 'pelicula' : 'serie'
    const title = (isMovie ? (item as any).title : (item as any).name) || 'Sin título'

    setAddingId(item.id)
    const res = await addItem({
      tmdbId: item.id,
      title,
      posterUrl: item.poster_path,
      type,
      status: 'por_ver',
    })
    setAddingId(null)

    if (res.success) {
      setNotification({
        type: 'success',
        message: `¡"${title}" agregada a tu lista!`,
      })
      setTimeout(() => setNotification(null), 3000)
    } else {
      setNotification({
        type: 'error',
        message: res.error || 'Error al agregar a la lista.',
      })
      setTimeout(() => setNotification(null), 5000)
    }
  }

  const selectedWatchlistItem = selectedMedia
    ? isItemInWatchlist(selectedMedia.id, selectedMedia.type)
    : undefined

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-sm animate-in slide-in-from-bottom-3 duration-200 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/90 border-red-500/30 text-red-300'
          }`}
        >
          <span>{notification.message}</span>
        </div>
      )}

      {/* Search Header Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Base de datos oficial de The Movie Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Descubre y Organiza tu Entretenimiento
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 mb-6">
            Busca cualquier película o serie, agrégala a tu lista con un clic y lleva el control de lo que has visto.
          </p>

          <SearchBar
            value={query}
            onChange={setQuery}
            isLoading={loading}
          />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300 font-semibold text-base sm:text-lg">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <h2>
            {query.trim()
              ? `Resultados de búsqueda: "${query}"`
              : 'Populares y Recomendados'}
          </h2>
        </div>
        {!loading && results.length > 0 && (
          <span className="text-xs text-slate-500 font-medium">
            {results.length} títulos encontrados
          </span>
        )}
      </div>

      {/* Results or Error */}
      {error ? (
        <ErrorFallback
          title="Error en la búsqueda"
          message={error}
          onRetry={() => {
            setError(null)
            searchMulti(query || 'Spider-Man').then(setResults).catch(() => {})
          }}
        />
      ) : (
        <SearchResults
          items={results}
          loading={loading}
          query={query}
          watchlistItems={watchlistItems}
          onSelect={handleSelectMedia}
          onQuickAdd={handleQuickAdd}
          addingId={addingId}
        />
      )}

      {/* Detail Modal */}
      {selectedMedia && (
        <DetailModal
          tmdbId={selectedMedia.id}
          type={selectedMedia.type}
          watchlistItem={selectedWatchlistItem}
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onAddToList={addItem}
          onUpdateDetails={updateDetails}
          onRemoveFromList={removeItem}
        />
      )}
    </div>
  )
}
