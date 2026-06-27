import { cn } from '@/lib/utils'

export function TickerBadge({
  ticker,
  color,
  className,
}: {
  ticker: string
  color: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white',
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {ticker.slice(0, 2)}
    </span>
  )
}
