import { Search, SlidersHorizontal } from 'lucide-react'
import type { WatchStatus, MediaType } from '@/types/domain'

export type FilterStatus = 'todos' | WatchStatus
export type FilterType = 'todos' | MediaType
export type SortOption =
  | 'fecha_desc'
  | 'fecha_asc'
  | 'calificacion_desc'
  | 'titulo_asc'

interface WatchlistFiltersProps {
  statusFilter: FilterStatus
  onStatusChange: (status: FilterStatus) => void
  typeFilter: FilterType
  onTypeChange: (type: FilterType) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function WatchlistFilters({
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sortBy,
  onSortChange,
  searchTerm,
  onSearchChange,
}: WatchlistFiltersProps) {
  const statusOptions: Array<{ id: FilterStatus; label: string }> = [
    { id: 'todos', label: 'Todos los Estados' },
    { id: 'por_ver', label: 'Por Ver' },
    { id: 'viendo', label: 'Viendo' },
    { id: 'vista', label: 'Vistas' },
  ]

  const typeOptions: Array<{ id: FilterType; label: string }> = [
    { id: 'todos', label: 'Todo tipo' },
    { id: 'pelicula', label: 'Películas' },
    { id: 'serie', label: 'Series' },
  ]

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md space-y-4">
      {/* Top bar: Search inside list + Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Local search input */}
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filtrar por título guardado..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-1.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
          >
            <option value="fecha_desc">Más recientes primero</option>
            <option value="fecha_asc">Más antiguos primero</option>
            <option value="calificacion_desc">Mejor calificados</option>
            <option value="titulo_asc">Título (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Badges / Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Estado:
          </span>
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onStatusChange(opt.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                statusFilter === opt.id
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Type filters */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
            Tipo:
          </span>
          {typeOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onTypeChange(opt.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                typeFilter === opt.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
