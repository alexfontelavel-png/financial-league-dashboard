import { Trophy, Users, Clock } from 'lucide-react'
import { prizePool } from '@/lib/data'
import { formatEuro } from '@/lib/format'

export function PrizePool() {
  const fillPct = Math.min(100, Math.round((prizePool.participants / 2000) * 100))

  return (
    <section className="relative overflow-hidden rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm flex flex-col">
      {/* decorative rings */}
      <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full border border-primary-foreground/10" />
      <div className="pointer-events-none absolute -right-4 -top-4 size-28 rounded-full border border-primary-foreground/10" />

      <div className="relative flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-highlight text-highlight-foreground">
            <Trophy className="size-5" />
          </div>
          <span className="text-sm font-medium text-primary-foreground/80">
            Season Prize Pool
          </span>
        </div>

        {/* Prize */}
        <p className="mt-4 text-4xl font-semibold tracking-tight">
          {formatEuro(prizePool.total)}
        </p>
        <p className="mt-1 text-sm text-primary-foreground/70">
          You&apos;re currently ranked #{prizePool.yourRank}
        </p>

        {/* Stats */}
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

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-primary-foreground/50 mb-1.5">
            <span>Season progress</span>
            <span>{fillPct}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-primary-foreground/10 overflow-hidden">
            <div
              className="h-1.5 rounded-full bg-highlight transition-all"
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        {/* Payouts */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {prizePool.payouts.map((p) => (
            <div
              key={p.place}
              className="rounded-2xl bg-primary-foreground/10 p-3 text-center"
            >
              <p className="text-xs font-medium text-primary-foreground/70">{p.place}</p>
              <p className="mt-1 text-sm font-semibold">{formatEuro(p.amount)}</p>
            </div>
          ))}
        </div>

        {/* Motivational nudge */}
        <div className="mt-4 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 px-4 py-3">
          <p className="text-xs text-primary-foreground/60 leading-relaxed">
            {prizePool.yourRank <= 3
              ? '🏆 You\'re in the podium! Keep trading to hold your position.'
              : `🚀 ${prizePool.yourRank - 3} positions away from the podium. Make your move.`}
          </p>
        </div>

        {/* CTA */}
        <button className="mt-4 w-full rounded-xl bg-highlight py-3 text-sm font-semibold text-highlight-foreground transition-opacity hover:opacity-90">
          View league standings
        </button>
      </div>
    </section>
  )
}
