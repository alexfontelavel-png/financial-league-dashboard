'use client'
import { Search, Bell, ChevronDown, X, Plus, Minus, Check } from 'lucide-react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { authClient } from '@/lib/auth-client'

interface SearchResult { ticker: string; name: string; exchange: string }
interface Quote { ticker: string; name: string; price: number; change: number }

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
  WFC: 'wellsfargo.com', C: 'citi.com', BRK: 'berkshirehathaway.com',
  XOM: 'exxonmobil.com', CVX: 'chevron.com', T: 'att.com',
  VZ: 'verizon.com', CSCO: 'cisco.com', AMAT: 'appliedmaterials.com',
}

function TickerLogo({ ticker, name, size = 'sm' }: { ticker: string; name: string; size?: 'sm' | 'lg' }) {
  const [imgError, setImgError] = useState(false)
  const domain = TICKER_DOMAINS[ticker.toUpperCase()]
  const logoUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null
  const dim = size === 'lg'
    ? { outer: '48px', inner: '32px', radius: '12px' }
    : { outer: '32px', inner: '20px', radius: '8px' }
  const fontSize = size === 'lg' ? '14px' : '11px'

  if (!imgError && logoUrl) {
    return (
      <div style={{
        width: dim.outer, height: dim.outer, borderRadius: dim.radius,
        background: '#fff', border: '1px solid #f0f0f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, overflow: 'hidden',
      }}>
        <img src={logoUrl} alt={name}
          style={{ width: dim.inner, height: dim.inner, objectFit: 'contain' }}
          onError={() => setImgError(true)} />
      </div>
    )
  }

  return (
    <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary"
      style={{ width: dim.outer, height: dim.outer, borderRadius: dim.radius, fontSize }}>
      {ticker.slice(0, 2)}
    </div>
  )
}

export function Topbar() {
  const [query, setQuery]               = useState('')
  const [results, setResults]           = useState<SearchResult[]>([])
  const [loading, setLoading]           = useState(false)
  const [selected, setSelected]         = useState<Quote | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [showBuy, setShowBuy]           = useState(false)
  const [shares, setShares]             = useState(1)
  const [mode, setMode]                 = useState<'shares' | 'amount'>('shares')
  const [amount, setAmount]             = useState('')
  const [tradeLoading, setTradeLoading] = useState(false)
  const [toast, setToast]               = useState<{ ok: boolean; msg: string } | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: session } = authClient.useSession()
  const userName    = session?.user?.name ?? 'Trader'
  const userInitial = userName.charAt(0).toUpperCase()

  const closeAll = useCallback(() => {
    setSelected(null); setShowBuy(false)
    setShares(1); setAmount(''); setToast(null); setQuery('')
  }, [])

  // Escape para cerrar modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAll() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeAll])

  useEffect(() => {
    if (query.length < 1) { setResults([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        setResults(await res.json())
      } catch { setResults([]) }
      setLoading(false)
    }, 350)
  }, [query])

  async function selectTicker(r: SearchResult) {
    setQuery(r.ticker); setResults([])
    setQuoteLoading(true); setShowBuy(false)
    setShares(1); setAmount(''); setToast(null)
    try {
      const res = await fetch(`/api/quote?ticker=${r.ticker}`)
      if (res.ok) {
        const data = await res.json()
        setSelected({ ticker: r.ticker, name: r.name, price: data.price, change: data.change })
      } else {
        setSelected({ ticker: r.ticker, name: r.name, price: 0, change: 0 })
      }
    } catch { setSelected(null) }
    setQuoteLoading(false)
  }

  async function executeTrade() {
    if (!selected) return
    setTradeLoading(true); setToast(null)
    const body = mode === 'shares'
      ? { ticker: selected.ticker, type: 'buy', shares }
      : { ticker: selected.ticker, type: 'buy', shares: parseFloat(amount) / selected.price }
    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.success) {
        setToast({ ok: true, msg: `✓ Compra ejecutada: ${Number(data.shares).toFixed(4)} acc. de ${selected.ticker} a $${Number(data.price).toFixed(2)} · Cash restante: €${Number(data.cashAfter).toFixed(2)}` })
        window.dispatchEvent(new Event('portfolio-updated'))
        setTimeout(() => closeAll(), 2500)
      } else {
        setToast({ ok: false, msg: data.error ?? 'Error desconocido' })
      }
    } catch {
      setToast({ ok: false, msg: 'Error de red. Inténtalo de nuevo.' })
    }
    setTradeLoading(false)
  }

  const totalByShares  = selected ? shares * selected.price : 0
  const sharesByAmount = selected && parseFloat(amount) > 0 ? parseFloat(amount) / selected.price : 0
  const canBuy = mode === 'shares'
    ? shares > 0 && selected && selected.price > 0
    : parseFloat(amount) > 0 && selected && selected.price > 0

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back, trader</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Good morning, {userName}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Buscador */}
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search stocks, leagues..."
            aria-label="Search"
            className="h-10 w-64 rounded-xl border border-border bg-card pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 transition-shadow"
          />
          {query && (
            <button onClick={() => { setQuery(''); setResults([]); setSelected(null) }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-3.5" />
            </button>
          )}
          {(results.length > 0 || loading) && (
            <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-border bg-card shadow-lg overflow-hidden dropdown-anim">
              {loading && <p className="px-4 py-3 text-xs text-muted-foreground animate-pulse">Buscando...</p>}
              {results.map(r => (
                <button key={r.ticker} onMouseDown={() => selectTicker(r)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent transition-colors border-b border-border last:border-0">
                  <TickerLogo ticker={r.ticker} name={r.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{r.ticker}</p>
                    <p className="truncate text-xs text-muted-foreground">{r.name}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{r.exchange}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notificaciones */}
        <button aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent">
          <Bell className="size-[18px]" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-highlight" />
        </button>

        {/* Avatar */}
        <button className="flex items-center gap-2 rounded-xl border border-border bg-card py-1.5 pl-1.5 pr-3 transition-colors hover:bg-accent">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            {userInitial}
          </span>
          <span className="hidden text-sm font-medium text-foreground sm:block">{userName}</span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* Modal cotización + compra */}
      {(selected || quoteLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm modal-backdrop"
          onClick={closeAll}>
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl modal-content"
            onClick={e => e.stopPropagation()}>
            {quoteLoading ? (
              <p className="text-center text-sm text-muted-foreground animate-pulse">Cargando cotización...</p>
            ) : selected && (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <TickerLogo ticker={selected.ticker} name={selected.name} size="lg" />
                    <div>
                      <h2 className="text-lg font-bold text-foreground">{selected.ticker}</h2>
                      <p className="text-xs text-muted-foreground">{selected.name}</p>
                    </div>
                  </div>
                  <button onClick={closeAll} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="size-5" />
                  </button>
                </div>

                <div className="mb-5">
                  <p className="text-3xl font-black text-foreground">
                    ${selected.price > 0 ? selected.price.toFixed(2) : '—'}
                  </p>
                  <p className={`text-sm font-semibold mt-0.5 ${selected.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {selected.change >= 0 ? '+' : ''}{selected.change.toFixed(2)}% hoy
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Precio de cierre del día anterior vía Polygon.io</p>
                </div>

                {!showBuy ? (
                  <button onClick={() => setShowBuy(true)}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    Comprar
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="flex rounded-xl border border-border overflow-hidden">
                      <button onClick={() => setMode('shares')}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'shares' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>
                        Por acciones
                      </button>
                      <button onClick={() => setMode('amount')}
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'amount' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>
                        Por importe
                      </button>
                    </div>

                    {mode === 'shares' && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Número de acciones</p>
                        <div className="flex items-center gap-3">
                          <button onClick={() => setShares(s => Math.max(1, s - 1))}
                            className="flex size-9 items-center justify-center rounded-xl border border-border hover:bg-accent transition-colors">
                            <Minus className="size-4" />
                          </button>
                          <input type="number" value={shares} min={1}
                            onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                            className="flex-1 h-9 rounded-xl border border-border bg-background px-3 text-center text-sm font-bold text-foreground outline-none" />
                          <button onClick={() => setShares(s => s + 1)}
                            className="flex size-9 items-center justify-center rounded-xl border border-border hover:bg-accent transition-colors">
                            <Plus className="size-4" />
                          </button>
                        </div>
                        <div className="mt-3 rounded-xl bg-muted px-4 py-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Precio por acción</span>
                            <span className="font-semibold text-foreground">${selected.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-muted-foreground">Total estimado</span>
                            <span className="font-black text-foreground">${totalByShares.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {mode === 'amount' && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Importe en euros</p>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
                          <input type="number" value={amount} min={0} placeholder="0.00"
                            onChange={e => setAmount(e.target.value)}
                            className="w-full h-10 rounded-xl border border-border bg-background pl-7 pr-3 text-sm font-bold text-foreground outline-none" />
                        </div>
                        {parseFloat(amount) > 0 && selected.price > 0 && (
                          <div className="mt-3 rounded-xl bg-muted px-4 py-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Acciones aproximadas</span>
                              <span className="font-semibold text-foreground">{sharesByAmount.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-muted-foreground">Precio por acción</span>
                              <span className="font-semibold text-foreground">${selected.price.toFixed(2)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {toast && (
                      <div className={`rounded-xl px-3 py-2.5 text-xs leading-snug ${toast.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {toast.msg}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button onClick={() => setShowBuy(false)}
                        className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent transition-colors">
                        Cancelar
                      </button>
                      <button onClick={executeTrade} disabled={!canBuy || tradeLoading}
                        className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-1.5">
                        {tradeLoading ? 'Ejecutando...' : toast?.ok ? <><Check className="size-3.5" />Comprado</> : 'Confirmar compra'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
