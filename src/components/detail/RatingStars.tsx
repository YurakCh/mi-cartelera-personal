import { useState } from 'react'
import { Star } from 'lucide-react'

interface RatingStarsProps {
  value: number | null | undefined
  onChange?: (rating: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function RatingStars({
  value = 0,
  onChange,
  readOnly = false,
  size = 'md',
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  const currentRating = hoverRating !== null ? hoverRating : value || 0

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= currentRating
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(star)}
            onMouseEnter={() => !readOnly && setHoverRating(star)}
            onMouseLeave={() => !readOnly && setHoverRating(null)}
            className={`transition transform ${
              readOnly
                ? 'cursor-default'
                : 'cursor-pointer hover:scale-110 active:scale-95'
            }`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'text-slate-600 hover:text-slate-400'
              } transition-colors`}
            />
          </button>
        )
      })}
    </div>
  )
}
