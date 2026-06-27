'use client'
import {
  LayoutGrid,
  TrendingUp,
  Trophy,
  Wallet,
  Users,
  Settings,
  LifeBuoy,
  CandlestickChart,
  Check,
  X,
  TrendingDown,
  Send,
  Zap,
  Flame,
  Search,
  Plus,
  Minus,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const nav = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'Markets', icon: TrendingUp },
  { label: 'Portfolio', icon: Wallet },
  { label: 'Leagues', icon: Trophy },
  { label: 'Players', icon: Users },
  { label: 'Crypto Boost', icon: Zap },
  { label: 'Degen Trade', icon: Flame },
]

const bottomNav = [
  { label: 'Settings', icon: Settings },
  { label: 'Support', icon: LifeBuoy },
]

const LEAGUES = [
  {
    id: 1,
    name: '2026 League',
    features: [
      'Trading available SP500 + NASDAQ + EUROSTOXX',
      'Cuota de entrada 50€',
      'Duración 60 días',
    ],
    spots: { taken: 36, total: 70 },
    prize: 1700,
    joined: false,
  },
]

function LeaguesPanel({ onClose }: { onClose: () => void }) {
  const [joined, setJoined] = useState<number[]>([])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Ligas disponibles</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Únete a una liga y compite por el premio</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>
        <div className="flex flex-col gap-4">
          {LEAGUES.map(league => {
            const isJoined  = joined.includes(league.id)
            const spotsLeft = league.spots.total - league.spots.taken
            const pct       = Math.round((league.spots.taken / league.spots.total) * 100)
            return (
              <div key={league.id} className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-lg font-bold text-foreground">{league.name}</h3>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Premio actual</p>
                    <p className="text-2xl font-black text-foreground">€{league.prize.toLocaleString('es-ES')}</p>
                  </div>
                </div>
                <ul className="flex flex-col gap-2 mb-4">
                  {league.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="size-4 text-green-500 shrink-0 mt-0.5" />{f}
                    </li>
                  ))}
                  <li className="flex flex-col gap-1.5 mt-1">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="size-4 text-green-500 shrink-0" />
                      <span>Plazas disponibles: <strong>{spotsLeft}</strong> de {league.spots.total}</span>
                    </div>
                    <div className="ml-6">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{league.spots.taken} plazas ocupadas · {spotsLeft} libres</p>
                    </div>
                  </li>
                </ul>
                {isJoined ? (
                  <div className="w-full rounded-xl bg-green-50 border border-green-200 py-3 text-center text-sm font-semibold text-green-600">✓ Te has unido a la liga</div>
                ) : (
                  <button onClick={() => setJoined(prev => [...prev, league.id])}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    Unirse · €50
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface Mover { ticker: string; price: number; change: number }
interface MoversData { gainers: Mover[]; losers: Mover[] }

function MarketsPanel({ onClose }: { onClose: () => void }) {
  const [data, setData]         = useState<MoversData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer]     = useState('')
  const [asking, setAsking]     = useState(false)

  useEffect(() => {
    fetch('/api/movers').then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  async function handleAsk() {
    if (!question.trim()) return
    setAsking(true); setAnswer('')
    try {
      const res = await fetch('/api/market-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      const data = await res.json()
      setAnswer(data.answer ?? 'No se pudo obtener respuesta.')
    } catch {
      setAnswer('Error conectando con el agente. Inténtalo de nuevo.')
    }
    setAsking(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Markets</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Mejores y peores del día · Cierre anterior</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>
        {loading && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />)}
          </div>
        )}
        {!loading && data && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="size-4 text-green-500" /><h3 className="text-sm font-semibold text-foreground">Daily Gainers</h3></div>
              <div className="flex flex-col gap-2">
                {data.gainers.map(m => (
                  <div key={m.ticker} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 hover:bg-accent transition-colors">
                    <div><p className="text-sm font-bold text-foreground">{m.ticker}</p><p className="text-xs text-muted-foreground">${m.price.toFixed(2)}</p></div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-green-500">+{m.change.toFixed(2)}%</span>
                      <div className="flex size-5 items-center justify-center rounded-full bg-green-500"><TrendingUp className="size-3 text-white" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3"><TrendingDown className="size-4 text-red-500" /><h3 className="text-sm font-semibold text-foreground">Daily Losers</h3></div>
              <div className="flex flex-col gap-2">
                {data.losers.map(m => (
                  <div key={m.ticker} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 hover:bg-accent transition-colors">
                    <div><p className="text-sm font-bold text-foreground">{m.ticker}</p><p className="text-xs text-muted-foreground">${m.price.toFixed(2)}</p></div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-red-500">{m.change.toFixed(2)}%</span>
                      <div className="flex size-5 items-center justify-center rounded-full bg-red-500"><TrendingDown className="size-3 text-white" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Ask Financial Agent to get insights &amp; potential recommendations</p>
          <div className="flex gap-2">
            <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="e.g. ¿Por qué está bajando TSLA? ¿Es buen momento para comprar NVDA?"
              className="flex-1 h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40" />
            <button onClick={handleAsk} disabled={asking || !question.trim()}
              className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40">
              <Send className="size-4" />
            </button>
          </div>
          {asking && <p className="text-xs text-muted-foreground mt-3 animate-pulse">Consultando con Gemini AI...</p>}
          {answer && !asking && (
            <div className="mt-3 rounded-xl bg-muted p-3 max-h-48 overflow-y-auto">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CryptoBoostPanel({ onClose }: { onClose: () => void }) {
  const features = [
    'Añade las principales Criptomonedas a tu cartera',
    'Incrementa la volatilidad de tu portfolio con activos de alto riesgo',
    'Inyecta rentabilidad diferencial vs el resto de usuarios',
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500"><Zap className="size-5 text-white" /></div>
            <div><h2 className="text-lg font-bold text-foreground">Crypto Boost</h2><p className="text-xs text-muted-foreground">Activos digitales de alto rendimiento</p></div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>
        <ul className="flex flex-col gap-3 mb-6">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-background border border-border px-4 py-3">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-500 mt-0.5"><Zap className="size-3 text-white" /></div>
              <p className="text-sm text-foreground">{f}</p>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mb-4 px-1">⚠️ Los activos crypto conllevan un alto nivel de riesgo. Las posiciones pueden variar significativamente en cortos periodos de tiempo.</p>
        <div className="flex items-center justify-between mb-4 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3">
          <div><p className="text-sm font-bold text-orange-600">Añadir exposición</p><p className="text-xs text-orange-400">Acceso completo a activos crypto</p></div>
          <div className="text-right"><p className="text-xl font-black text-orange-600">5€</p><p className="text-xs text-orange-400">/mes</p></div>
        </div>
        <button onClick={onClose} className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
          Añadir exposición · 5€/mes
        </button>
      </div>
    </div>
  )
}

interface SearchResult { ticker: string; name: string; exchange: string }

function DegenTradeOrder({ leverage, onBack, onClose }: {
  leverage: 2 | 3
  onBack: () => void
  onClose: () => void
}) {
  const [ticker, setTicker]             = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching]       = useState(false)
  const [quotePrice, setQuotePrice]     = useState<number | null>(null)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [mode, setMode]                 = useState<'shares' | 'amount'>('shares')
  const [shares, setShares]             = useState(1)
  const [amount, setAmount]             = useState('')
  const [confirmed, setConfirmed]       = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const price = quotePrice ?? 0

  useEffect(() => {
    if (ticker.length < 1) { setSearchResults([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(ticker)}`)
        setSearchResults(await res.json())
      } catch { setSearchResults([]) }
      setSearching(false)
    }, 350)
  }, [ticker])

  async function selectTicker(r: SearchResult) {
    setTicker(r.ticker)
    setSearchResults([])
    setQuoteLoading(true)
    try {
      const res = await fetch(`/api/quote?ticker=${r.ticker}`)
      if (res.ok) { const d = await res.json(); setQuotePrice(d.price) }
    } catch { setQuotePrice(null) }
    setQuoteLoading(false)
  }

  const totalByShares  = price > 0 ? shares * price : 0
  const sharesByAmount = price > 0 && parseFloat(amount) > 0 ? parseFloat(amount) / price : 0
  const exposureShares = totalByShares * leverage
  const exposureAmount = parseFloat(amount) > 0 ? parseFloat(amount) * leverage : 0

  if (confirmed) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-100">
          <Flame className="size-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-foreground">¡Degen Trade activado!</h3>
        <p className="text-sm text-muted-foreground">
          Tu trade {leverage}x en <strong>{ticker}</strong> ha sido registrado.<br />
          Exposición real: <strong>${(mode === 'shares' ? exposureShares : exposureAmount).toFixed(2)}</strong>
        </p>
        <button onClick={onClose} className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
          Cerrar
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground text-sm">← Volver</button>
        <div className="flex-1">
          <p className="text-base font-bold text-red-600">Degen Trade {leverage}x</p>
          <p className="text-xs text-muted-foreground">Coste: {leverage === 2 ? '4€' : '6,50€'} · Selecciona acción y cantidad</p>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 bg-background rounded-xl border border-border px-3 py-2.5 focus-within:border-red-400 transition-colors">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            value={ticker}
            onChange={e => { setTicker(e.target.value.toUpperCase()); setQuotePrice(null) }}
            placeholder="Buscar acción... AAPL, TSLA, NVDA"
            className="bg-transparent text-sm font-mono font-bold text-foreground placeholder:text-muted-foreground outline-none flex-1"
          />
          {quoteLoading && <span className="text-xs text-muted-foreground animate-pulse">Cargando...</span>}
          {quotePrice && !quoteLoading && <span className="text-sm font-bold text-foreground shrink-0">${quotePrice.toFixed(2)}</span>}
        </div>
        {(searchResults.length > 0 || searching) && (
          <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden">
            {searching && <p className="px-4 py-3 text-xs text-muted-foreground">Buscando...</p>}
            {searchResults.slice(0, 5).map(r => (
              <button key={r.ticker} onMouseDown={() => selectTicker(r)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent transition-colors border-b border-border last:border-0">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-[10px] font-bold text-red-600">
                  {r.ticker.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{r.ticker}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{r.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex rounded-xl border border-border overflow-hidden">
        <button onClick={() => setMode('shares')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'shares' ? 'bg-red-500 text-white' : 'text-muted-foreground hover:bg-accent'}`}>
          Por acciones
        </button>
        <button onClick={() => setMode('amount')}
          className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'amount' ? 'bg-red-500 text-white' : 'text-muted-foreground hover:bg-accent'}`}>
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
          {price > 0 && (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tu inversión ({shares} acc.)</span>
                <span className="font-semibold text-foreground">${totalByShares.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-red-600 font-semibold">Exposición real {leverage}x</span>
                <span className="font-black text-red-600">${exposureShares.toFixed(2)}</span>
              </div>
            </div>
          )}
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
          {parseFloat(amount) > 0 && price > 0 && (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Acciones aproximadas</span>
                <span className="font-semibold text-foreground">{sharesByAmount.toFixed(4)} acc.</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Precio por acción</span>
                <span className="font-semibold text-foreground">${price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs border-t border-red-200 pt-1 mt-1">
                <span className="text-red-600 font-semibold">Exposición real {leverage}x</span>
                <span className="font-black text-red-600">${exposureAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => { if (ticker && (mode === 'shares' ? price > 0 : parseFloat(amount) > 0)) setConfirmed(true) }}
        disabled={!ticker || !price || (mode === 'amount' && parseFloat(amount) <= 0)}
        className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40">
        Confirmar Degen Trade {leverage}x · {leverage === 2 ? '4€' : '6,50€'}
      </button>
    </div>
  )
}

function DegenTradePanel({ onClose }: { onClose: () => void }) {
  const [selectedLeverage, setSelectedLeverage] = useState<2 | 3 | null>(null)

  const features = [
    '¿Has escuchado sobre los degen trades?',
    'Si tienes convicción con un movimiento, ves a por todas',
    'Apalanca un trade y multiplica tus resultados',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl mx-4" onClick={e => e.stopPropagation()}>
        {selectedLeverage ? (
          <DegenTradeOrder leverage={selectedLeverage} onBack={() => setSelectedLeverage(null)} onClose={onClose} />
        ) : (
          <>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-red-500"><Flame className="size-5 text-white" /></div>
                <div><h2 className="text-lg font-bold text-foreground">Degen Trade</h2><p className="text-xs text-muted-foreground">Apalancamiento para traders con convicción</p></div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
            </div>

            <ul className="flex flex-col gap-3 mb-6">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl bg-background border border-border px-4 py-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 mt-0.5"><Flame className="size-3 text-white" /></div>
                  <p className="text-sm text-foreground">{f}</p>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div><p className="text-base font-black text-red-600">Apalanca 2x</p><p className="text-xs text-red-400">Duplica tu exposición</p></div>
                  <div className="text-right"><p className="text-xl font-black text-red-600">4€</p><p className="text-xs text-red-400">/trade</p></div>
                </div>
                <button onClick={() => setSelectedLeverage(2)}
                  className="w-full rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                  Añadir · 4€
                </button>
              </div>
              <div className="rounded-2xl border-2 border-red-400 bg-red-100 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div><p className="text-base font-black text-red-700">Apalanca 3x</p><p className="text-xs text-red-500">Triplica tu exposición</p></div>
                  <div className="text-right"><p className="text-xl font-black text-red-700">6,50€</p><p className="text-xs text-red-500">/trade</p></div>
                </div>
                <button onClick={() => setSelectedLeverage(3)}
                  className="w-full rounded-xl bg-red-700 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
                  Añadir · 6,50€
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-700 mb-3">⚠️ ¿Qué implica el Apalancamiento 2x?</p>
              <p className="text-xs text-red-600 mb-3 leading-relaxed">
                Al activar este boost, tanto tus ganancias como tus pérdidas se multiplicarán por dos.
                Ejemplo si inviertes 100€ en Amazon (Posición real en mercado: 200€):
              </p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2 text-xs text-red-600"><span>🚀</span><span><strong>Si Amazon sube un 10%:</strong> Tú ganas un 20% (tu saldo sube a 120€).</span></li>
                <li className="flex items-start gap-2 text-xs text-red-600"><span>📉</span><span><strong>Si Amazon baja un 10%:</strong> Tú pierdes un 20% (tu saldo baja a 80€).</span></li>
                <li className="flex items-start gap-2 text-xs text-red-600"><span>💥</span><span><strong>Si Amazon baja un 50%:</strong> Tu posición se liquida automáticamente para devolver el préstamo y te quedas con 0€.</span></li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function Sidebar() {
  const [active, setActive]           = useState('Dashboard')
  const [showLeagues, setShowLeagues] = useState(false)
  const [showMarkets, setShowMarkets] = useState(false)
  const [showCrypto, setShowCrypto]   = useState(false)
  const [showDegen, setShowDegen]     = useState(false)

  function handleNav(label: string) {
    setActive(label)
    if (label === 'Leagues')      setShowLeagues(true)
    if (label === 'Markets')      setShowMarkets(true)
    if (label === 'Crypto Boost') setShowCrypto(true)
    if (label === 'Degen Trade')  setShowDegen(true)
  }

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-8 border-r border-border bg-sidebar px-5 py-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CandlestickChart className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">Bull League</p>
            <p className="text-xs text-muted-foreground">Fantasy Trading</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Menu</p>
          {nav.map((item) => {
            const Icon     = item.icon
            const isActive = active === item.label
            const isCrypto = item.label === 'Crypto Boost'
            const isDegen  = item.label === 'Degen Trade'
            return (
              <button key={item.label} onClick={() => handleNav(item.label)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive && isDegen
                    ? 'bg-red-500 text-white shadow-sm'
                    : isActive && isCrypto
                      ? 'bg-orange-500 text-white shadow-sm'
                      : isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : isDegen
                          ? 'text-red-500 hover:bg-red-50'
                          : isCrypto
                            ? 'text-orange-500 hover:bg-orange-50'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}>
                <Icon className="size-[18px]" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="flex flex-col gap-1">
          {bottomNav.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.label}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                <Icon className="size-[18px]" />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="rounded-2xl bg-secondary p-4">
          <p className="text-sm font-semibold text-secondary-foreground">Go Pro</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Unlock real-time data and unlimited leagues.</p>
          <button className="mt-3 w-full rounded-lg bg-highlight px-3 py-2 text-xs font-semibold text-highlight-foreground transition-opacity hover:opacity-90">
            Upgrade
          </button>
        </div>
      </aside>

      {showLeagues && <LeaguesPanel onClose={() => setShowLeagues(false)} />}
      {showMarkets && <MarketsPanel onClose={() => setShowMarkets(false)} />}
      {showCrypto  && <CryptoBoostPanel onClose={() => setShowCrypto(false)} />}
      {showDegen   && <DegenTradePanel onClose={() => setShowDegen(false)} />}
    </>
  )
}
