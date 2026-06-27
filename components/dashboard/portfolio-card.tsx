'use client'
import { ArrowUpRight, ArrowDownRight, Wallet, Coins } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { formatEuro } from '@/lib/format'

interface PortfolioData {
  cash_balance:   number
  total_value:    number
  invested_value: number
  roi_pct:        number
  positions: Array<{
    ticker:        string
    company_name:  string
    shares:        number
    avg_buy_price: number
    current_price: number
    current_value: number
    pnl:           number
    pnl_pct:       number
  }>
}

function AreaSparkline({ data }: { data: number[] }) {
  if (data.length < 2) return null
  const width  = 520
  const height = 130
  const min    = Math.min(...data)
  const max    = Math.max(...data)
  const range  = max - min || 1
  const stepX  = width / (data.length - 1)
  const points = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * (height - 16) - 8
    return [x, y] as const
  })
  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-32 w-full"
      role="img" aria-label="Portfolio value trend">
      <defs>
        <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#equityFill)" />
      <path d={linePath} fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PortfolioCard() {
  const [data, setData]       = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio')
      if (res.ok) setData(await res.json())
    } catch {} finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    window.addEventListener('portfolio-updated', fetchData)
    return () => window.removeEventListener('portfolio-updated', fetchData)
  }, [fetchData])

  const totalValue    = data?.total_value    ?? 10000
  const cashBalance   = data?.cash_balance   ?? 10000
  const investedValue = data?.invested_value ?? 0
  const roiPct        = data?.roi_pct        ?? 0
  const roiAbs        = totalValue - 10000
  const isPos         = roiPct >= 0

  const sparkData = data
    ? [10000, ...Array.from({ length: 10 }, (_, i) => 10000 + (roiAbs * (i + 1) / 11)), totalValue]
    : [10000, 10000]

  return (
    <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-primary-foreground/70">Total Portfolio Value</p>
          {loading ? (
            <div className="mt-2 h-10 w-36 rounded-lg bg-primary-foreground/20 animate-pulse" />
          ) : (
            <p className="mt-2 text-4xl font-semibold tracking-tight">{formatEuro(totalValue)}</p>
          )}
          {!loading && (
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-semibold">
                {isPos ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                {isPos ? '+' : ''}{roiPct.toFixed(2)}%
              </span>
              <span className="text-sm text-primary-foreground/70">
                {isPos ? '+' : ''}{formatEuro(roiAbs)} this season
              </span>
            </div>
          )}
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-foreground/15">
          <Wallet className="size-5" />
        </div>
      </div>

      <div className="-mx-1 mt-4">
        <AreaSparkline data={sparkData} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-primary-foreground/10 p-4">
          <div className="flex items-center gap-2 text-primary-foreground/70">
            <Coins className="size-4" />
            <span className="text-xs font-medium">Invested</span>
          </div>
          {loading
            ? <div className="mt-1.5 h-6 w-24 rounded bg-primary-foreground/20 animate-pulse" />
            : <p className="mt-1.5 text-lg font-semibold">{formatEuro(investedValue)}</p>
          }
        </div>
        <div className="rounded-2xl bg-primary-foreground/10 p-4">
          <div className="flex items-center gap-2 text-primary-foreground/70">
            <Wallet className="size-4" />
            <span className="text-xs font-medium">Cash</span>
          </div>
          {loading
            ? <div className="mt-1.5 h-6 w-24 rounded bg-primary-foreground/20 animate-pulse" />
            : <p className="mt-1.5 text-lg font-semibold">{formatEuro(cashBalance)}</p>
          }
        </div>
      </div>

      {!loading && data && data.positions.length > 0 && (
        <div className="mt-4 rounded-2xl bg-primary-foreground/10 p-4">
          <p className="text-xs font-medium text-primary-foreground/70 mb-3">Posiciones abiertas</p>
          <div className="flex flex-col gap-2">
            {data.positions.map(pos => (
              <div key={pos.ticker} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{pos.ticker}</p>
                  <p className="text-xs text-primary-foreground/60">{pos.shares.toFixed(4)} acc. · ${pos.current_price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatEuro(pos.current_value)}</p>
                  <p className={`text-xs font-semibold ${pos.pnl_pct >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {pos.pnl_pct >= 0 ? '+' : ''}{pos.pnl_pct.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
