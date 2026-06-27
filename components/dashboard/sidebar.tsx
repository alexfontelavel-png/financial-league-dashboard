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
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

const nav = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'Markets', icon: TrendingUp },
  { label: 'Portfolio', icon: Wallet },
  { label: 'Leagues', icon: Trophy },
  { label: 'Players', icon: Users },
  { label: 'Crypto Boost', icon: Zap },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl mx-4"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Ligas disponibles</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Únete a una liga y compite por el premio</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
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
                      <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                      {f}
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
                  <div className="w-full rounded-xl bg-green-50 border border-green-200 py-3 text-center text-sm font-semibold text-green-600">
                    ✓ Te has unido a la liga
                  </div>
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
    fetch('/api/movers')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleAsk() {
    if (!question.trim()) return
    setAsking(true)
    setAnswer('')
    await new Promise(r => setTimeout(r, 1000))
    setAnswer(`Análisis de "${question}": Esta funcionalidad se conectará próximamente a un modelo de IA financiera para darte insights y recomendaciones personalizadas basadas en datos reales del mercado.`)
    setAsking(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl mx-4"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Markets</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Mejores y peores del día · Cierre anterior</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {!loading && data && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="size-4 text-green-500" />
                <h3 className="text-sm font-semibold text-foreground">Daily Gainers</h3>
              </div>
              <div className="flex flex-col gap-2">
                {data.gainers.map(m => (
                  <div key={m.ticker}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 hover:bg-accent transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground">{m.ticker}</p>
                      <p className="text-xs text-muted-foreground">${m.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-green-500">+{m.change.toFixed(2)}%</span>
                      <div className="flex size-5 items-center justify-center rounded-full bg-green-500">
                        <TrendingUp className="size-3 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="size-4 text-red-500" />
                <h3 className="text-sm font-semibold text-foreground">Daily Losers</h3>
              </div>
              <div className="flex flex-col gap-2">
                {data.losers.map(m => (
                  <div key={m.ticker}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 hover:bg-accent transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground">{m.ticker}</p>
                      <p className="text-xs text-muted-foreground">${m.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-red-500">{m.change.toFixed(2)}%</span>
                      <div className="flex size-5 items-center justify-center rounded-full bg-red-500">
                        <TrendingDown className="size-3 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-sm font-semibold text-foreground mb-3">
            Ask Financial Agent to get insights &amp; potential recommendations
          </p>
          <div className="flex gap-2">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="e.g. ¿Por qué está bajando TSLA? ¿Es buen momento para comprar NVDA?"
              className="flex-1 h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40"
            />
            <button onClick={handleAsk} disabled={asking || !question.trim()}
              className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40">
              <Send className="size-4" />
            </button>
          </div>
          {asking && <p className="text-xs text-muted-foreground mt-3 animate-pulse">Analizando...</p>}
          {answer && !asking && (
            <div className="mt-3 rounded-xl bg-muted p-3">
              <p className="text-sm text-foreground leading-relaxed">{answer}</p>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl mx-4"
        onClick={e => e.stopPropagation()}>

        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-orange-500">
              <Zap className="size-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Crypto Boost</h2>
              <p className="text-xs text-muted-foreground">Activos digitales de alto rendimiento</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <ul className="flex flex-col gap-3 mb-6">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl bg-background border border-border px-4 py-3">
              <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-orange-500 mt-0.5">
                <Zap className="size-3 text-white" />
              </div>
              <p className="text-sm text-foreground">{f}</p>
            </li>
          ))}
        </ul>

        <p className="text-xs text-muted-foreground mb-4 px-1">
          ⚠️ Los activos crypto conllevan un alto nivel de riesgo. Las posiciones pueden variar significativamente en cortos periodos de tiempo.
        </p>

        <div className="flex items-center justify-between mb-4 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-orange-600">Añadir exposición</p>
            <p className="text-xs text-orange-400">Acceso completo a activos crypto</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-orange-600">5€</p>
            <p className="text-xs text-orange-400">/mes</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
          Añadir exposición · 5€/mes
        </button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [active, setActive]           = useState('Dashboard')
  const [showLeagues, setShowLeagues] = useState(false)
  const [showMarkets, setShowMarkets] = useState(false)
  const [showCrypto, setShowCrypto]   = useState(false)

  function handleNav(label: string) {
    setActive(label)
    if (label === 'Leagues')      setShowLeagues(true)
    if (label === 'Markets')      setShowMarkets(true)
    if (label === 'Crypto Boost') setShowCrypto(true)
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
            return (
              <button key={item.label} onClick={() => handleNav(item.label)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive && !isCrypto
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : isActive && isCrypto
                      ? 'bg-orange-500 text-white shadow-sm'
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
    </>
  )
}
