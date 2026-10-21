import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useWatchlist } from '@/hooks/useWatchlist'
import { MetricCards } from '@/components/watchlist/MetricCards'
import {
  WatchlistFilters,
  type FilterStatus,
  type FilterType,
  type SortOption,
} from '@/components/watchlist/WatchlistFilters'
import { WatchlistGrid } from '@/components/watchlist/WatchlistGrid'
import { DetailModal } from '@/components/detail/DetailModal'
import { Skeleton } from '@/components/ui/Skeleton'
import { ErrorFallback } from '@/components/ui/ErrorFallback'
import type { WatchlistItem } from '@/types/domain'
import { BookmarkCheck, Plus } from 'lucide-react'

export function WatchlistPage() {
  const {
    items,
    loading,
    error,
    refetch,
    addItem,
    updateStatus,
    updateDetails,
    removeItem,
  } = useWatchlist()

  // Filters state
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todos')
  const [typeFilter, setTypeFilter] = useState<FilterType>('todos')
  const [sortBy, setSortBy] = useState<SortOption>('fecha_desc')
  const [searchTerm, setSearchTerm] = useState('')

  // Selected item for modal
  const [selectedItem, setSelectedItem] = useState<WatchlistItem | null>(null)

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Status filter
        if (statusFilter !== 'todos' && item.estado !== statusFilter) {
          return false
        }
        // Type filter
        if (typeFilter !== 'todos' && item.tipo_contenido !== typeFilter) {
          return false
        }
        // Search term
        if (
          searchTerm.trim() &&
          !item.titulo.toLowerCase().includes(searchTerm.toLowerCase().trim())
        ) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'fecha_desc') {
          return (
            new Date(b.fecha_agregado).getTime() -
            new Date(a.fecha_agregado).getTime()
          )
        }
        if (sortBy === 'fecha_asc') {
          return (
            new Date(a.fecha_agregado).getTime() -
            new Date(b.fecha_agregado).getTime()
          )
        }
        if (sortBy === 'calificacion_desc') {
          return (b.calificacion_personal || 0) - (a.calificacion_personal || 0)
        }
        if (sortBy === 'titulo_asc') {
          return a.titulo.localeCompare(b.titulo)
        }
        return 0
      })
  }, [items, statusFilter, typeFilter, searchTerm, sortBy])

  // Sync selectedItem with fresh data if modal is open
  const currentModalItem = selectedItem
    ? items.find((i) => i.id === selectedItem.id) || selectedItem
    : null

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-2">
            <BookmarkCheck className="w-3.5 h-3.5" />
            <span>Colección privada & sincronizada</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mi Lista Personal
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Gestiona tu estado de visualización, tus notas y calificaciones personales.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Explorar más títulos</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <MetricCards items={items} />

      {/* Filters Toolbar */}
      <WatchlistFilters
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Error State */}
      {error && (
        <ErrorFallback
          title="Error al cargar la lista"
          message={error}
          onRetry={refetch}
        />
      )}

      {/* Loading Skeletons */}
      {loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Content Grid */}
      {!loading && !error && (
        <WatchlistGrid
          items={filteredItems}
          onSelect={(item) => setSelectedItem(item)}
          onUpdateStatus={updateStatus}
          onRemove={removeItem}
        />
      )}

      {/* Detail Modal */}
      {currentModalItem && (
        <DetailModal
          tmdbId={currentModalItem.tmdb_id}
          type={currentModalItem.tipo_contenido}
          watchlistItem={currentModalItem}
          isOpen={!!currentModalItem}
          onClose={() => setSelectedItem(null)}
          onAddToList={addItem}
          onUpdateDetails={updateDetails}
          onRemoveFromList={removeItem}
        />
      )}
    </div>
  )
}
