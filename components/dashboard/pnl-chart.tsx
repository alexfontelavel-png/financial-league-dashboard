'use client'

import { useState } from 'react'
import { pnl } from '@/lib/data'
import { formatEuro } from '@/lib/format'
import { cn } from '@/lib/utils'

const ranges = ['6M', '1Y', 'All']

export function PnlChart() {
  const [range, setRange] = useState('1Y')

  const maxAbs = Math.max(...pnl.map((m) => Math.abs(m.value)))
  const totalProfit = pnl.reduce((sum, m) => sum + m.value, 0)
  const bestMonth = pnl.reduce((best, m) => (m.value > best.value ? m : best))

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Profit &amp; Loss
          </h2>
          <p className="text-sm text-muted-foreground">
            Monthly realised P&amp;L for the season
          </p>
        </div>
        <div className="flex rounded-xl bg-secondary p-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors',
                range === r
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-6">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Net profit
          </p>
          <p className="text-2xl font-semibold text-card-foreground">
            {formatEuro(totalProfit)}
          </p>
        </div>
        <div className="h-9 w-px bg-border" />
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Best month
          </p>
          <p className="text-2xl font-semibold text-primary">
            {bestMonth.month} · {formatEuro(bestMonth.value)}
          </p>
        </div>
      </div>

      {/* Bar chart with centered zero baseline */}
      <div className="mt-6">
        <div className="flex h-48 items-stretch gap-2 sm:gap-3">
          {pnl.map((m) => {
            const isProfit = m.value >= 0
            const heightPct = (Math.abs(m.value) / maxAbs) * 50 // half the track per side
            return (
              <div
                key={m.month}
                className="group relative flex flex-1 flex-col items-center"
              >
                {/* tooltip */}
                <div className="pointer-events-none absolute -top-2 z-10 -translate-y-full rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
                  {formatEuro(m.value)}
                </div>

                <div className="flex h-full w-full flex-col items-center justify-center">
                  {/* top half (profits grow up) */}
                  <div className="flex w-full flex-1 items-end justify-center">
                    {isProfit && (
                      <div
                        className="w-full max-w-7 rounded-t-md bg-primary transition-all group-hover:opacity-80"
                        style={{ height: `${heightPct * 2}%` }}
                      />
                    )}
                  </div>
                  {/* zero line */}
                  <div className="h-px w-full bg-border" />
                  {/* bottom half (losses grow down) */}
                  <div className="flex w-full flex-1 items-start justify-center">
                    {!isProfit && (
                      <div
                        className="w-full max-w-7 rounded-b-md bg-chart-2 transition-all group-hover:opacity-80"
                        style={{ height: `${heightPct * 2}%` }}
                      />
                    )}
                  </div>
                </div>

                <span className="mt-2 text-[11px] font-medium text-muted-foreground">
                  {m.month}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-primary" />
          <span className="text-xs text-muted-foreground">Profit</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-sm bg-chart-2" />
          <span className="text-xs text-muted-foreground">Loss</span>
        </div>
      </div>
    </section>
  )
}
