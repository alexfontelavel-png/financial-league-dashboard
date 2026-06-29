'use client'
import { useMemo, useState, useEffect, useRef } from 'react'
import { Minus, Plus, Check, AlertCircle, Search, X } from 'lucide-react'
import { formatEuro } from '@/lib/format'
import { cn } from '@/lib/utils'

type Side = 'buy' | 'sell'

interface SearchResult { ticker: string; name: string; exchange: string }

interface PortfolioData {
  cash_balance:   number
  total_value:    number
  invested_value: number
  positions: Array<{ ticker: string; shares: number; current_price: number }>
}

const TICKER_DOMAINS: Record<string, string> = {
  AAPL: 'apple.com', MSFT: 'microsoft.com', GOOGL: 'google.com',
  GOOG: 'google.com', AMZN: 'amazon.com', META: 'meta.com',
  TSLA: 'tesla.com', NVDA: 'nvidia.com', AMD: 'amd.com',
  NFLX: 'netflix.com', PYPL: 'paypal.com', INTC: 'intel.com',
  UBER: 'uber.com', SPOT: 'spotify.com', SHOP: 'shopify.com',
  COIN: 'coinbase.com', PLTR: 'palantir.com', SNAP: 'snap.com',
  BABA: 'alibaba.com', DIS: 'disney.com', BA: 'boeing.com',
  JPM: 'jpmorganchase.com', V: 'visa.com', MA: 'mastercard.com',
  WMT: 'walmart.com', JNJ: 'jnj.com', PG: 'pg.com',
  KO: 'coca-cola.com', PEP: 'pepsico.com', MCD: 'mcdonalds.com',
  SBUX: 'starbucks.com', NKE: 'nike.com', ADBE: 'adobe.com',
  CRM: 'salesforce.com', ORCL: 'oracle.com', IBM: 'ibm.com',
  QCOM: 'qualcomm.com', TXN: 'ti.com', AVGO: 'broadcom.com',
  ARM: 'arm.com', RIVN: 'rivian.com', ABNB: 'airbnb.com',
  LYFT: 'lyft.com', HOOD: 'robinhood.com', SOFI: 'sofi.com',
  RBLX: 'roblox.com', TWLO: 'twilio.com', ZM: 'zoom.us',
  NET: 'cloudflare.com', SNOW: 'snowflake.com', DDOG: 'datadoghq.com',
  MDB: 'mongodb.com', DOCN: 'digitalocean.com', AMGN: 'amgen.com',
  GILD: 'gilead.com', BMY: 'bms.com', PFE: 'pfizer.com',
  MRNA: 'modernatx.com', LLY: 'lilly.com', UNH: 'unitedhealthgroup.com',
  GS: 'goldmansachs.com', MS: 'morganstanley.com', BAC: 'bankofamerica.com',
  WFC: 'wellsfargo.com', C: 'citi.com', XOM: 'exxonmobil.com',
  CVX: 'chevron.com', CSCO: 'cisco.com', AMAT: 'appliedmaterials.com',
}

function StockLogo({ ticker }: { ticker: string }) {
  const [imgError, setImgError] = useState(false)
  const domain  = TICKER_DOMAINS[ticker.toUpperCase()]
  const logoUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null

  if (!imgError && logoUrl) {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-white border border-border">
        <img src={logoUrl} alt={ticker} className="size-6 object-contain" onError={() => setImgError(true)} />
      </div>
    )
  }
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
      {ticker.slice(0, 2)}
    </div>
  )
}

export function TradePanel() {
  const [side, setSide]               = useState<Side>('buy')
  const [query, setQuery]             = useState('')
  const [results, setResults]         = useState<SearchResult[]>([])
  const [searching, setSearching]     = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selected, setSelected]       = useState<{ ticker: string; name: string; price: number } | null>(null)
  const [priceLoading, setPriceLoading] = useState(false)
  const [qty, setQty]                 = useState(1)
  const [loading, setLoading]         = useState(false)
  const [portfolio, setPortfolio]     = useState<PortfolioData | null>(null)
  const [toast, setToast]             = useState<{ ok: boolean; msg: string } | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetchPortfolio()
    window.addEventListener('portfolio-updated', fetchPortfolio)
    return () => window.removeEventListener('portfolio-updated', fetchPortfolio)
  }, [])

  async function fetchPortfolio() {
    try {
      const res = await fetch('/api/portfolio')
      if (res.ok) setPortfolio(await res.json())
    } catch {}
  }

  useEffect(() => {
    if (query.length < 1) { setResults([]); setShowResults(false); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true); setShowResults(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        setResults(await res.json())
      } catch { setResults([]) }
      setSearching(false)
    }, 350)
  }, [query])

  async function selectStock(r: SearchResult) {
    setQuery(''); setResults([]); setShowResults(false)
    setToast(null); setQty(1)
    setPriceLoading(true)
    try {
      const res = await fetch(`/api/quote?ticker=${r.ticker}`)
      if (res.ok) {
        const data = await res.json()
        setSelected({ ticker: r.ticker, name: r.name, price: data.price })
      }
    } catch {}
    setPriceLoading(false)
  }

  function changeQty(delta: number) {
    setQty(q => Math.max(1, q + delta))
    setToast(null)
  }

  async function executeTrade() {
    if (!selected) return
    setLoading(true); setToast(null)
    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker: selected.ticker, type: side, shares: qty }),
      })
      const data = await res.json()
      if (data.success) {
        setToast({
          ok: true,
          msg: `✓ ${side === 'buy' ? 'Compra' : 'Venta'} ejecutada: ${qty} acc. de ${selected.ticker} a $${data.price?.toFixed(2)} · Cash: ${formatEuro(data.cashAfter)}`,
        })
        await fetchPortfolio()
        window.dispatchEvent(new Event('portfolio-updated'))
      } else {
        setToast({ ok: false, msg: data.error ?? 'Error desconocido' })
      }
    } catch {
      setToast({ ok: false, msg: 'Error de red. Inténtalo de nuevo.' })
    }
    setLoading(false)
  }

  const cashBalance    = portfolio?.cash_balance ?? 0
  const estimate       = selected ? selected.price * qty : 0
  const fee            = estimate * 0.001
  const canAfford      = side === 'buy' ? estimate <= cashBalance : true
  const positionShares = portfolio?.positions.find(p => p.ticker === selected?.ticker)?.shares ?? 0
  const canSell        = side === 'sell' ? positionShares >= qty : true
  const canExecute     = !!selected && selected.price > 0 && canAfford && canSell && !loading

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
                ? s === 'buy' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-highlight text-highlight-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}>
            {s === 'buy' ? 'Buy' : 'Sell'}
          </button>
        ))}
      </div>

      {/* Buscador */}
      <label className="mt-4 block text-xs font-medium text-muted-foreground">Select stock</label>
      <div className="mt-2 relative">
        {selected && !query ? (
          /* Stock seleccionado */
          <div className="flex items-center gap-3 rounded-xl border border-border p-2.5">
            <StockLogo ticker={selected.ticker} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground">{selected.ticker} — {selected.name}</p>
              {priceLoading
                ? <p className="text-xs text-muted-foreground animate-pulse">Cargando precio...</p>
                : <p className="text-xs text-muted-foreground">${selected.price.toFixed(2)} / share</p>
              }
            </div>
            <button onClick={() => { setSelected(null); setToast(null); setQty(1) }}
              className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-4" />
            </button>
          </div>
        ) : (
          /* Buscador */
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 focus-within:ring-2 focus-within:ring-ring/40 transition-shadow">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar acción... AAPL, TSLA, NVDA"
              className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
            />
            {searching && <span className="text-xs text-muted-foreground animate-pulse shrink-0">Buscando...</span>}
            {query && <button onClick={() => { setQuery(''); setResults([]) }} className="text-muted-foreground hover:text-foreground"><X className="size-3.5" /></button>}
          </div>
        )}

        {/* Dropdown resultados */}
        {showResults && (results.length > 0 || searching) && (
          <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden dropdown-anim">
            {searching && <p className="px-4 py-3 text-xs text-muted-foreground animate-pulse">Buscando...</p>}
            {results.map(r => (
              <button key={r.ticker} onMouseDown={() => selectStock(r)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent transition-colors border-b border-border last:border-0">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-white border border-border">
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${TICKER_DOMAINS[r.ticker] ?? 'google.com'}&sz=32`}
                    alt={r.ticker}
                    className="size-5 object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{r.ticker}</p>
                  <p className="truncate text-xs text-muted-foreground">{r.name}</p>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">{r.exchange}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Acciones en posesión si vende */}
      {side === 'sell' && selected && (
        <p className="mt-2 text-xs text-muted-foreground">
          Tienes <strong>{positionShares.toFixed(4)}</strong> acciones de {selected.ticker}
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
      {selected && (
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
      )}

      {!selected && (
        <div className="mt-4 rounded-xl bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">Busca una acción para empezar a operar</p>
        </div>
      )}

      {!canAfford && selected && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle className="size-3.5 shrink-0" />
          Saldo insuficiente. Tienes {formatEuro(cashBalance)}.
        </div>
      )}
      {!canSell && selected && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-600">
          <AlertCircle className="size-3.5 shrink-0" />
          No tienes suficientes acciones de {selected.ticker}.
        </div>
      )}

      <button
        onClick={executeTrade}
        disabled={!canExecute}
        className={cn(
          'mt-4 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-40',
          side === 'buy' ? 'bg-primary text-primary-foreground' : 'bg-highlight text-highlight-foreground',
        )}>
        {loading ? 'Ejecutando...' : selected ? `${side === 'buy' ? 'Buy' : 'Sell'} ${qty} ${selected.ticker}` : 'Selecciona una acción'}
      </button>

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
