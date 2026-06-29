import { Trophy, Users, Clock } from 'lucide-react'
import { prizePool } from '@/lib/data'
import { formatEuro } from '@/lib/format'

export function PrizePool() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm self-start">
      {/* decorative rings */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full border border-primary-foreground/10" />
      <div className="pointer-events-none absolute -right-4 -top-4 size-28 rounded-full border border-primary-foreground/10" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-highlight text-highlight-foreground">
            <Trophy className="size-5" />
          </div>
          <span className="text-sm font-medium text-primary-foreground/80">
            Season Prize Pool
          </span>
        </div>
        <p className="mt-4 text-4xl font-semibold tracking-tight">
          {formatEuro(prizePool.total)}
        </p>
        <p className="mt-1 text-sm text-primary-foreground/70">
          You&apos;re currently ranked #{prizePool.yourRank}
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-primary-foreground/80">
            <Users className="size-4" />
            {prizePool.participants.toLocaleString()} players
          </span>
          <span className="flex items-center gap-1.5 text-primary-foreground/80">
            <Clock className="size-4" />
            Ends in {prizePool.endsIn}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {prizePool.payouts.map((p) => (
            <div
              key={p.place}
              className="rounded-2xl bg-primary-foreground/10 p-3 text-center"
            >
              <p className="text-xs font-medium text-primary-foreground/70">
                {p.place}
              </p>
              <p className="mt-1 text-sm font-semibold">
                {formatEuro(p.amount)}
              </p>
            </div>
          ))}
        </div>
        <button className="mt-5 w-full rounded-xl bg-highlight py-3 text-sm font-semibold text-highlight-foreground transition-opacity hover:opacity-90">
          View league standings
        </button>
      </div>
    </section>
  )
}
