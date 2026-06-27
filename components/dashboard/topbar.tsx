'use client'

import { Search, Bell, ChevronDown } from 'lucide-react'

export function Topbar() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Welcome back, trader</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Good morning, Alex
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search stocks, leagues..."
            aria-label="Search"
            className="h-10 w-56 rounded-xl border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <button
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-accent"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-highlight" />
        </button>

        <button className="flex items-center gap-2 rounded-xl border border-border bg-card py-1.5 pl-1.5 pr-3 transition-colors hover:bg-accent">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            A
          </span>
          <span className="hidden text-sm font-medium text-foreground sm:block">
            Alex Rivera
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>
    </header>
  )
}
