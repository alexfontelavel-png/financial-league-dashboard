'use client'
import { useMemo, useState, useEffect } from 'react'
import { Minus, Plus, Check, AlertCircle } from 'lucide-react'
import { tradeable } from '@/lib/data'
import { formatEuro } from '@/lib/format'
import { cn } from '@/lib/utils'
import { TickerBadge } from './ticker-badge'

type Side = 'buy' | 'sell'

interface PortfolioData {
  cash_balance:   number
  total_value:    number
  invested_value: number
  positions: Array<{ ticker: string; shares: number; current_price: number }>
}

export function TradePanel() {
  const [side, setSide]           = useState<Side>('buy')
  const [selected, setSelected]   = useState(tradeable[0].ticker)
  const [qty, setQty]             = useState(5)
  const [loading, setLoading]     = useState(false)
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null)
  const [toast, setToast]         = useState<{ ok: boolean; msg: string } | null>(null)

  const stock = useMemo(
    () => tradeable.find(s => s.ticker === selected) ?? tradeable[0],
    [selected]
  )

  const estimate = stock.price * qty
  const fee      = estimate * 0.001

  // Cargar portfolio al montar
  useEffect(() => {
    fetchPortfolio()
  }, [])

  async function fetchPortfolio() {
    try {
      const res = await fetch('/api/portfolio')
      if (res.ok) setPortfolio(await res.json())
    } catch {}
  }

  function changeQty(delta: number) {
    setQty(q => Math.max(1, q + delta))
    setToast(null)
  }

  async function executeTrade() {
    setLoading(true)
    setToast(null)
    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: selected,
          type:   side,
          shares: qty,
        }),
      })
      const data = await res.json()

      if (data.success) {
        setToast({
          ok:  true,
          msg: `${side === 'buy' ? 'Compra' : 'Venta'} ejecutada: ${qty} acc. de ${selected} a $${data.price?.toFixed(2)} · Cash restante: ${formatEuro(data.cashAfter)}`,
        })
        // Refrescar portfolio
        await fetchPortfolio()
        // Disparar evento para que PortfolioCard también se refresque
        window.dispatchEvent(new Event('portfolio-updated'))
      } else {
        setToast({ ok: false, msg: data.error ?? 'Error desconocido' })
      }
    } catch {
      setToast({ ok: false, msg: 'Error de red. Inténtalo de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  const cashBalance    = portfolio?.cash_balance ?? 0
  const canAfford      = side === 'buy' ? estimate <= cashBalance : true
  const positionShares = portfolio?.positions.find(p => p.ticker === selected)?.shares ?? 0
  const canSell        = side === 'sell' ? positionShares >= qty : true

  return (
    <section className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">Trade Stocks</h2>
          <p className="text-sm text-muted-foreground">Buy or sell with your league balance</p>
        </div>
        {portfolio && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Cash</p>
            <p className="text-sm font-bold text-card-foreground">{formatEuro(cashBalance)}</p>
          </div>
        )}
      </div>

      {/* Buy / Sell toggle */}
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
        {(['buy', 'sell'] as Side[]).map(s => (
          <button key={s} onClick={() => { setSide(s); setToast(null) }}
            className={cn(
              'rounded-lg py-2 text-sm font-semibold capitalize transition-colors',
              side === s
                ? s === 'buy'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-highlight text-highlight-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}>
            {s}
          </button>
        ))}
      </div>

      {/* Stock selector */}
      <label className="mt-4 block text-xs font-medium text-muted-foreground">Select stock</label>
      <div className="mt-2 flex items-center gap-3 rounded-xl border border-border p-2.5">
        <TickerBadge ticker={stock.ticker} color={stock.color} />
        <div className="min-w-0 flex-1">
          <select value={selected} onChange={e => { setSelected(e.target.value); setToast(null) }}
            aria-label="Select stock"
            className="w-full bg-transparent text-sm font-semibold text-card-foreground focus:outline-none">
            {tradeable.map(s => (
              <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">{formatEuro(stock.price, { decimals: 2 })} / share</p>
        </div>
      </div>

      {/* Si vende, mostrar cuántas acciones tiene */}
      {side === 'sell' && (
        <p className="mt-2 text-xs text-muted-foreground">
          Tienes <strong>{positionShares.toFixed(4)}</strong> acciones de {selected}
        </p>
      )}

      {/* Quantity stepper */}
      <label className="mt-4 block text-xs font-medium text-muted-foreground">Quantity (shares)</label>
      <div className="mt-2 flex items-center justify-between rounded-xl border border-border p-2">
        <button onClick={() => changeQty(-1)} aria-label="Decrease"
          className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-accent">
          <Minus className="size-4" />
        </button>
        <span className="text-lg font-semibold text-card-foreground">{qty}</span>
        <button onClick={() => changeQty(1)} aria-label="Increase"
          className="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors hover:bg-accent">
          <Plus className="size-4" />
        </button>
      </div>

      {/* Summary */}
      <div className="mt-4 space-y-2 rounded-xl bg-secondary p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Estimated total</span>
          <span className="font-semibold text-card-foreground">{formatEuro(estimate, { decimals: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Fee (0.1%)</span>
          <span className="font-medium text-card-foreground">{formatEuro(fee, { decimals: 2 })}</span>
        </div>
        {side === 'buy' && portfolio && (
          <div className="flex justify-between border-t border-border pt-2 mt-1">
            <span className="text-muted-foreground">Cash restante</span>
            <span className={cn('font-semibold', canAfford ? 'text-green-600' : 'text-red-500')}>
              {formatEuro(cashBalance - estimate)}
            </span>
          </div>
        )}
      </div>

      {/* Warning saldo insuficiente */}
      {!canAfford && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle className="size-3.5 shrink-0" />
          Saldo insuficiente. Tienes {formatEuro(cashBalance)}.
        </div>
      )}
      {!canSell && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle className="size-3.5 shrink-0" />
          No tienes suficientes acciones de {selected}.
        </div>
      )}

      {/* Botón ejecutar */}
      <button
        onClick={executeTrade}
        disabled={loading || !canAfford || !canSell}
        className={cn(
          'mt-4 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-40',
          side === 'buy'
            ? 'bg-primary text-primary-foreground'
            : 'bg-highlight text-highlight-foreground',
        )}>
        {loading ? 'Ejecutando...' : `${side === 'buy' ? 'Buy' : 'Sell'} ${qty} ${stock.ticker}`}
      </button>

      {/* Toast resultado */}
      {toast && (
        <div className={cn(
          'mt-3 rounded-xl px-3 py-2.5 text-xs leading-snug',
          toast.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
        )}>
          {toast.ok && <Check className="size-3.5 inline mr-1" />}
          {toast.msg}
        </div>
      )}
    </section>
  )
}
