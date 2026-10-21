import type { TMDBCastMember } from '@/types/tmdb'
import { getImageUrl } from '@/lib/tmdbService'
import { User } from 'lucide-react'

interface CastListProps {
  cast: TMDBCastMember[]
}

export function CastList({ cast }: CastListProps) {
  if (!cast || cast.length === 0) {
    return (
      <p className="text-xs text-slate-500 italic">No hay información de reparto disponible.</p>
    )
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
      {cast.map((actor) => (
        <div
          key={actor.id}
          className="flex-shrink-0 w-20 flex flex-col items-center text-center group"
        >
          <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-800 border border-slate-700/80 mb-1.5 shadow-md group-hover:border-amber-500/50 transition">
            {actor.profile_path ? (
              <img
                src={getImageUrl(actor.profile_path, 'w185')}
                alt={actor.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                <User className="w-6 h-6" />
              </div>
            )}
          </div>
          <p className="text-xs font-medium text-slate-200 line-clamp-1 w-full" title={actor.name}>
            {actor.name}
          </p>
          <p className="text-[10px] text-slate-400 line-clamp-1 w-full" title={actor.character}>
            {actor.character}
          </p>
        </div>
      ))}
    </div>
  )
}
