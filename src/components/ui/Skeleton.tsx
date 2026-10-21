interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-800/80 rounded-lg ${className}`}
      aria-hidden="true"
    />
  )
}
