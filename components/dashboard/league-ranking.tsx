import { league } from '@/lib/data'
import { formatEuro, formatPct } from '@/lib/format'
import { cn } from '@/lib/utils'

export function LeagueRanking() {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            League Ranking
          </h2>
          <p className="text-sm text-muted-foreground">
            Champions League · Season 4
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
          {league.length} of 1,280
        </span>
      </div>

      <ul className="mt-4 flex flex-col gap-1.5">
        {league.map((member) => {
          const positive = member.roi >= 0
          return (
            <li
              key={member.handle}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors',
                member.you
                  ? 'bg-primary/8 ring-1 ring-primary/30'
                  : 'hover:bg-secondary',
              )}
            >
              <span
                className={cn(
                  'flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                  member.rank === 1
                    ? 'bg-highlight text-highlight-foreground'
                    : member.rank <= 3
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground',
                )}
              >
                {member.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-card-foreground">
                  {member.name}
                  {member.you && (
                    <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      YOU
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {formatEuro(member.value)}
                </p>
              </div>
              <span
                className={cn(
                  'text-sm font-bold',
                  positive ? 'text-success' : 'text-danger',
                )}
              >
                {formatPct(member.roi)}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
