import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorFallbackProps {
  title?: string
  message: string
  onRetry?: () => void
}

export function ErrorFallback({
  title = 'Ha ocurrido un error',
  message,
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-red-950/20 border border-red-500/20 text-center max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Intentar de nuevo</span>
        </button>
      )}
    </div>
  )
}
