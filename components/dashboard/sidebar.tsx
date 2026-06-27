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
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const nav = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'Markets', icon: TrendingUp },
  { label: 'Portfolio', icon: Wallet },
  { label: 'Leagues', icon: Trophy },
  { label: 'Players', icon: Users },
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

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Ligas disponibles</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Únete a una liga y compite por el premio</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        {/* Lista de ligas */}
        <div className="flex flex-col gap-4">
          {LEAGUES.map(league => {
            const isJoined    = joined.includes(league.id)
            const spotsLeft   = league.spots.total - league.spots.taken
            const pct         = Math.round((league.spots.taken / league.spots.total) * 100)

            return (
              <div key={league.id}
                className="rounded-2xl border border-border bg-background p-5">

                {/* Nombre y premio */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{league.name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Premio actual</p>
                    <p className="text-2xl font-black text-foreground">
                      €{league.prize.toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-2 mb-4">
                  {league.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="size-4 text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {/* Plazas con barra */}
                  <li className="flex flex-col gap-1.5 mt-1">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="size-4 text-green-500 shrink-0" />
                      <span>Plazas disponibles: <strong>{spotsLeft}</strong> de {league.spots.total}</span>
                    </div>
                    <div className="ml-6">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-2 rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {league.spots.taken} plazas ocupadas · {spotsLeft} libres
                      </p>
                    </div>
                  </li>
                </ul>

                {/* Botón */}
                {isJoined ? (
                  <div className="w-full rounded-xl bg-green-50 border border-green-200 py-3 text-center text-sm font-semibold text-green-600">
                    ✓ Te has unido a la liga
                  </div>
                ) : (
                  <button
                    onClick={() => setJoined(prev => [...prev, league.id])}
                    className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
                    Unirse · €{league.spots.taken > 0 ? 50 : 0}
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

export function Sidebar() {
  const [active, setActive]           = useState('Dashboard')
  const [showLeagues, setShowLeagues] = useState(false)

  function handleNav(label: string) {
    setActive(label)
    if (label === 'Leagues') setShowLeagues(true)
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
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
          {nav.map((item) => {
            const Icon     = item.icon
            const isActive = active === item.label
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item.label)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
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
              <button
                key={item.label}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Icon className="size-[18px]" />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="rounded-2xl bg-secondary p-4">
          <p className="text-sm font-semibold text-secondary-foreground">Go Pro</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Unlock real-time data and unlimited leagues.
          </p>
          <button className="mt-3 w-full rounded-lg bg-highlight px-3 py-2 text-xs font-semibold text-highlight-foreground transition-opacity hover:opacity-90">
            Upgrade
          </button>
        </div>
      </aside>

      {/* Panel de ligas */}
      {showLeagues && (
        <LeaguesPanel onClose={() => setShowLeagues(false)} />
      )}
    </>
  )
}
