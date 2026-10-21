import { Search, X, Loader2 } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  isLoading?: boolean
  placeholder?: string
}

export function SearchBar({
  value,
  onChange,
  isLoading = false,
  placeholder = 'Buscar películas o series por título (ej. Inception, Stranger Things)...',
}: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-12 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition shadow-lg text-sm sm:text-base"
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center gap-1.5">
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
        {value && !isLoading && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
            title="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
