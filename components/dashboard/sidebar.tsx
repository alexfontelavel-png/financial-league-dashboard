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

export function Sidebar() {
  const [active, setActive] = useState('Dashboard')

  return (
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
          const Icon = item.icon
          const isActive = active === item.label
          return (
            <button
              key={item.label}
              onClick={() => setActive(item.label)}
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
        <p className="text-sm font-semibold text-secondary-foreground">
          Go Pro
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Unlock real-time data and unlimited leagues.
        </p>
        <button className="mt-3 w-full rounded-lg bg-highlight px-3 py-2 text-xs font-semibold text-highlight-foreground transition-opacity hover:opacity-90">
          Upgrade
        </button>
      </div>
    </aside>
  )
}
