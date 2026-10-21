import type { WatchlistItem } from '@/types/domain'
import { Film, Clock, PlayCircle, CheckCircle2, Star } from 'lucide-react'

interface MetricCardsProps {
  items: WatchlistItem[]
}

export function MetricCards({ items }: MetricCardsProps) {
  const total = items.length
  const porVer = items.filter((i) => i.estado === 'por_ver').length
  const viendo = items.filter((i) => i.estado === 'viendo').length
  const vistas = items.filter((i) => i.estado === 'vista').length

  const ratedItems = items.filter(
    (i) => i.calificacion_personal !== null && i.calificacion_personal > 0
  )
  const averageRating =
    ratedItems.length > 0
      ? (
          ratedItems.reduce(
            (acc, curr) => acc + (curr.calificacion_personal || 0),
            0
          ) / ratedItems.length
        ).toFixed(1)
      : '-'

  const metrics = [
    {
      label: 'Total Guardados',
      value: total,
      icon: Film,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Por Ver',
      value: porVer,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Viendo Ahora',
      value: viendo,
      icon: PlayCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Completadas',
      value: vistas,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Calificación Prom.',
      value: averageRating,
      subtext: ratedItems.length > 0 ? `${ratedItems.length} evaluadas` : 'Sin calificar',
      icon: Star,
      color: 'text-amber-300',
      bg: 'bg-amber-400/10 border-amber-400/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {metrics.map((m) => {
        const Icon = m.icon
        return (
          <div
            key={m.label}
            className="p-4 rounded-xl bg-slate-900 border border-slate-800 shadow-md flex items-center gap-3.5 transition hover:border-slate-700"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${m.bg} ${m.color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {m.label}
              </p>
              <p className="text-xl font-bold text-white mt-0.5 leading-none">
                {m.value}
              </p>
              {m.subtext && (
                <p className="text-[10px] text-slate-500 mt-1">{m.subtext}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
