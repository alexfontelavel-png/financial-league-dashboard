'use client'

import { useMemo, useState } from 'react'
import { Minus, Plus, Check } from 'lucide-react'
import { tradeable } from '@/lib/data'
import { formatEuro } from '@/lib/format'
import { cn } from '@/lib/utils'
import { TickerBadge } from './ticker-badge'

type Side = 'buy' | 'sell'

export function TradePanel() {
  const [side, setSide] = useState<Side>('buy')
  const [selected, setSelected] = useState(tradeable[0].ticker)
  const [qty, setQty] = useState(5)
  const [confirmed, setConfirmed] = useState(false)

  const stock = useMemo(
    () => tradeable.find((s) => s.ticker === selected) ?? tradeable[0],
    [selected],
  )

  const estimate = stock.price * qty
  const fee = estimate * 0.001

  function changeQty(delta: number) {
    setQty((q) => Math.max(1, q + delta))
    setConfirmed(false)
  }

  return (
    <section className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-card-foreground">
        Trade Stocks
      </h2>
      <p className="text-sm text-muted-foreground">
        Buy or sell with your league balance
      </p>

      {/* Buy / Sell toggle */}
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
        {(['buy', 'sell'] as Side[]).map((s) => (
          <button
            key={s}
            onClick={() => {
              setSide(s)
              setConfirmed(false)
            }}
            className={cn(
              'rounded-lg py-2 text-sm font-semibold capitalize transition-colors',
              side === s
                ? s === 'buy'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-highlight text-highlight-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Stock selector */}
      <label className="mt-4 block text-xs font-medium text-muted-foreground">
        Select stock
      </label>
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-border p-2.5">
        <TickerBadge ticker={stock.ticker} color={stock.color} />
        <div className="min-w-0 flex-1">
          <select
            aria-label="Select stock"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value)
              setConfirmed(false)
            }}
            className="w-full bg-transparent text-sm font-semibold text-card-foreground focus:outline-none"
          >
            {tradeable.map((s) => (
              <option key={s.ticker} value={s.ticker}>
                {s.ticker} — {s.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            {formatEuro(stock.price, { decimals: 2 })} / share
          </p>
        </div>
      </div>

      {/* Quantity stepper */}
      <label className="mt-4 block text-xs font-medium text-muted-foreground">
        Quantity (shares)
      </label>
      <div className="mt-2 flex items-center justify-between rounded-xl border border-border p-2">
        <button
          onClick={() => changeQty(-1)}
          aria-label="Decrease quantity"
          className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-accent"
        >
          <Minus className="size-4" />
        </button>
        <span className="text-lg font-semibold text-card-foreground">{qty}</span>
        <button
          onClick={() => changeQty(1)}
          aria-label="Increase quantity"
          className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-accent"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {/* Summary */}
      <div className="mt-4 space-y-2 rounded-xl bg-secondary p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated total</span>
          <span className="font-semibold text-card-foreground">
            {formatEuro(estimate, { decimals: 2 })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fee (0.1%)</span>
          <span className="font-medium text-card-foreground">
            {formatEuro(fee, { decimals: 2 })}
          </span>
        </div>
      </div>

      <button
        onClick={() => setConfirmed(true)}
        className={cn(
          'mt-4 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90',
          side === 'buy'
            ? 'bg-primary text-primary-foreground'
            : 'bg-highlight text-highlight-foreground',
        )}
      >
        {confirmed ? (
          <>
            <Check className="size-4" />
            Order placed
          </>
        ) : (
          `${side === 'buy' ? 'Buy' : 'Sell'} ${qty} ${stock.ticker}`
        )}
      </button>
    </section>
  )
}
