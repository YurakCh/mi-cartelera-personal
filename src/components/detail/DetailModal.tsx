import { useEffect, useState } from 'react'
import type { TMDBMediaDetail } from '@/types/tmdb'
import type { MediaType, WatchlistItem, WatchStatus } from '@/types/domain'
import { MEDIA_TYPE_CONFIG } from '@/types/domain'
import { getMediaDetail, getImageUrl } from '@/lib/tmdbService'
import { CastList } from './CastList'
import { RatingStars } from './RatingStars'
import { Skeleton } from '@/components/ui/Skeleton'
import {
  X,
  Star,
  Calendar,
  Clock,
  Film,
  Tv,
  BookmarkPlus,
  Trash2,
  Save,
  Check,
  Loader2,
} from 'lucide-react'

interface DetailModalProps {
  tmdbId: number
  type: MediaType
  watchlistItem?: WatchlistItem
  isOpen: boolean
  onClose: () => void
  onAddToList: (data: {
    tmdbId: number
    title: string
    posterUrl: string | null
    type: MediaType
    status: WatchStatus
  }) => Promise<{ success: boolean; error?: string }>
  onUpdateDetails: (
    id: number,
    updates: {
      estado?: WatchStatus
      calificacion_personal?: number | null
      comentario?: string | null
    }
  ) => Promise<{ success: boolean; error?: string }>
  onRemoveFromList: (id: number) => Promise<{ success: boolean; error?: string }>
}

export function DetailModal({
  tmdbId,
  type,
  watchlistItem,
  isOpen,
  onClose,
  onAddToList,
  onUpdateDetails,
  onRemoveFromList,
}: DetailModalProps) {
  const [detail, setDetail] = useState<TMDBMediaDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Local editable state for watchlist item
  const [status, setStatus] = useState<WatchStatus>(
    watchlistItem?.estado || 'por_ver'
  )
  const [rating, setRating] = useState<number | null>(
    watchlistItem?.calificacion_personal ?? null
  )
  const [comment, setComment] = useState<string>(
    watchlistItem?.comentario || ''
  )
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Sync state when watchlistItem changes
  useEffect(() => {
    if (watchlistItem) {
      setStatus(watchlistItem.estado)
      setRating(watchlistItem.calificacion_personal)
      setComment(watchlistItem.comentario || '')
    } else {
      setStatus('por_ver')
      setRating(null)
      setComment('')
    }
  }, [watchlistItem])

  // Fetch TMDB detail
  useEffect(() => {
    if (!isOpen || !tmdbId) return

    let isMounted = true
    setLoading(true)
    setError(null)

    getMediaDetail(tmdbId, type)
      .then((data) => {
        if (isMounted) setDetail(data)
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Error al obtener detalles.'
          )
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [tmdbId, type, isOpen])

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleAdd = async () => {
    if (!detail) return
    setActionLoading(true)
    setActionError(null)
    const res = await onAddToList({
      tmdbId: detail.id,
      title: detail.title,
      posterUrl: detail.poster_path,
      type,
      status: 'por_ver',
    })
    setActionLoading(false)
    if (res.success) {
      setActionSuccess('¡Agregado a tu lista!')
      setTimeout(() => setActionSuccess(null), 2500)
    } else {
      setActionError(res.error || 'No se pudo agregar a tu lista.')
    }
  }

  const handleSaveDetails = async () => {
    if (!watchlistItem) return
    setActionLoading(true)
    setActionError(null)
    const res = await onUpdateDetails(watchlistItem.id, {
      estado: status,
      calificacion_personal: rating,
      comentario: comment.trim() || null,
    })
    setActionLoading(false)
    if (res.success) {
      setActionSuccess('¡Cambios guardados!')
      setTimeout(() => setActionSuccess(null), 2500)
    } else {
      setActionError(res.error || 'No se pudieron guardar los cambios.')
    }
  }

  const handleRemove = async () => {
    if (!watchlistItem) return
    if (!window.confirm('¿Estás seguro de que deseas eliminar este contenido de tu lista?')) {
      return
    }
    setActionLoading(true)
    const res = await onRemoveFromList(watchlistItem.id)
    setActionLoading(false)
    if (res.success) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-700/60 transition cursor-pointer"
          title="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="p-8 space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : error || !detail ? (
          <div className="p-8 text-center">
            <p className="text-red-400 mb-4">{error || 'No se encontró información.'}</p>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-sm hover:bg-slate-700 transition"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div>
            {/* Header / Backdrop Image */}
            <div className="relative h-64 sm:h-72 w-full bg-slate-950 overflow-hidden">
              <img
                src={getImageUrl(detail.backdrop_path || detail.poster_path, 'w1280')}
                alt={detail.title}
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

              {/* Poster & Quick Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end gap-4">
                <div className="w-24 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden border-2 border-slate-700/80 shadow-2xl flex-shrink-0 bg-slate-800">
                  <img
                    src={getImageUrl(detail.poster_path, 'w500')}
                    alt={detail.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        MEDIA_TYPE_CONFIG[type].badgeColor
                      }`}
                    >
                      {MEDIA_TYPE_CONFIG[type].label}
                    </span>
                    {detail.release_date && (
                      <span className="flex items-center gap-1 text-xs text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{detail.release_date.split('-')[0]}</span>
                      </span>
                    )}
                    {detail.runtime ? (
                      <span className="flex items-center gap-1 text-xs text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{detail.runtime} min</span>
                      </span>
                    ) : detail.number_of_seasons ? (
                      <span className="flex items-center gap-1 text-xs text-slate-300">
                        <Tv className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {detail.number_of_seasons}{' '}
                          {detail.number_of_seasons === 1 ? 'temporada' : 'temporadas'}
                        </span>
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white line-clamp-2">
                    {detail.title}
                  </h2>
                  {detail.tagline && (
                    <p className="text-xs italic text-amber-400/90 line-clamp-1 mt-0.5">
                      "{detail.tagline}"
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-slate-200">
                      {detail.vote_average.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({detail.vote_count.toLocaleString()} votos TMDB)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 max-h-[50vh] overflow-y-auto">
              {/* Genres */}
              {detail.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {detail.genres.map((g) => (
                    <span
                      key={g.id}
                      className="px-2.5 py-1 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Sinopsis
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {detail.overview}
                </p>
              </div>

              {/* Cast */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                  Reparto Principal
                </h3>
                <CastList cast={detail.cast} />
              </div>

              {/* Personalized Watchlist Section */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Film className="w-4 h-4" />
                    <span>Tu Registro Personal</span>
                  </h3>
                  {actionSuccess && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 animate-in fade-in">
                      <Check className="w-3.5 h-3.5" />
                      {actionSuccess}
                    </span>
                  )}
                </div>

                {actionError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <span className="font-semibold">Error:</span>
                    <span>{actionError}</span>
                  </div>
                )}

                {!watchlistItem ? (
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-slate-300">
                      Este contenido no está en tu lista personal todavía.
                    </p>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleAdd}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <BookmarkPlus className="w-4 h-4" />
                      )}
                      <span>Agregar a mi lista</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Estado selector */}
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          Estado de visualización
                        </label>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as WatchStatus)}
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        >
                          <option value="por_ver">Por Ver</option>
                          <option value="viendo">Viendo</option>
                          <option value="vista">Vista</option>
                        </select>
                      </div>

                      {/* Calificación personal */}
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1.5">
                          Mi Calificación (1 - 5 estrellas)
                        </label>
                        <div className="flex items-center gap-3 pt-1">
                          <RatingStars
                            value={rating}
                            onChange={(r) => setRating(r)}
                            size="md"
                          />
                          {rating && (
                            <button
                              type="button"
                              onClick={() => setRating(null)}
                              className="text-[11px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
                            >
                              Limpiar
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Comentario / Reseña personal */}
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Notas y reseña personal
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Escribe lo que te pareció, qué temporada vas, con quién la viste..."
                        rows={3}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 placeholder-slate-600 resize-none"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={handleRemove}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar de mi lista</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveDetails}
                        disabled={actionLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs transition cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {actionLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>Guardar cambios</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
