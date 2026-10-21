import type { WatchlistItem, WatchStatus } from '@/types/domain'
import { MEDIA_TYPE_CONFIG, WATCH_STATUS_CONFIG } from '@/types/domain'
import { getImageUrl } from '@/lib/tmdbService'
import { RatingStars } from '@/components/detail/RatingStars'
import {
  Calendar,
  MessageSquare,
  Trash2,
  ExternalLink,
  Film,
  CheckCircle,
  PlayCircle,
  Clock,
} from 'lucide-react'

interface WatchlistGridProps {
  items: WatchlistItem[]
  onSelect: (item: WatchlistItem) => void
  onUpdateStatus: (id: number, status: WatchStatus) => void
  onRemove: (id: number) => void
}

export function WatchlistGrid({
  items,
  onSelect,
  onUpdateStatus,
  onRemove,
}: WatchlistGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 border border-slate-800 rounded-2xl my-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-3">
          <Film className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">
          No hay elementos en esta vista
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          No encontramos títulos que coincidan con tus filtros actuales o tu lista aún está vacía.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const statusCfg = WATCH_STATUS_CONFIG[item.estado]
        const typeCfg = MEDIA_TYPE_CONFIG[item.tipo_contenido]
        const dateFormatted = new Date(item.fecha_agregado).toLocaleDateString(
          'es-ES',
          { day: 'numeric', month: 'short', year: 'numeric' }
        )

        return (
          <div
            key={item.id}
            className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-700 transition flex flex-col justify-between"
          >
            {/* Poster & Badges */}
            <div
              onClick={() => onSelect(item)}
              className="relative aspect-[16/9] sm:aspect-[2/3] w-full overflow-hidden bg-slate-950 cursor-pointer"
            >
              <img
                src={getImageUrl(item.poster_url, 'w500')}
                alt={item.titulo}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

              {/* Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${typeCfg.badgeColor}`}
                >
                  {typeCfg.label}
                </span>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${statusCfg.badgeColor}`}
                >
                  {statusCfg.label}
                </span>
              </div>
            </div>

            {/* Content info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div
                  onClick={() => onSelect(item)}
                  className="cursor-pointer"
                >
                  <h4
                    className="text-base font-semibold text-white line-clamp-1 group-hover:text-amber-400 transition"
                    title={item.titulo}
                  >
                    {item.titulo}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Agregado {dateFormatted}</span>
                  </div>
                </div>

                {/* Personal Rating */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-400">
                    Tu nota:
                  </span>
                  {item.calificacion_personal ? (
                    <RatingStars
                      value={item.calificacion_personal}
                      readOnly
                      size="sm"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      Sin calificar
                    </span>
                  )}
                </div>

                {/* Personal Comment snippet */}
                {item.comentario && (
                  <div className="mt-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start gap-1.5 text-xs text-slate-300">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <p className="line-clamp-2 italic text-[11px] text-slate-300">
                      "{item.comentario}"
                    </p>
                  </div>
                )}
              </div>

              {/* Status Quick Toggle & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                {/* State selector */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(item.id, 'por_ver')}
                    title="Marcar Por Ver"
                    className={`p-1.5 rounded-md border transition cursor-pointer ${
                      item.estado === 'por_ver'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(item.id, 'viendo')}
                    title="Marcar Viendo"
                    className={`p-1.5 rounded-md border transition cursor-pointer ${
                      item.estado === 'viendo'
                        ? 'bg-blue-500 text-white border-blue-400 shadow-sm'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(item.id, 'vista')}
                    title="Marcar Vista"
                    className={`p-1.5 rounded-md border transition cursor-pointer ${
                      item.estado === 'vista'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelect(item)}
                    title="Editar detalles y reseña"
                    className="p-1.5 rounded-md bg-slate-950/80 text-slate-400 hover:text-amber-400 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    title="Eliminar de mi lista"
                    className="p-1.5 rounded-md bg-slate-950/80 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/20 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
