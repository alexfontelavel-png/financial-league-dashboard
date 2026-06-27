import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { topAssets } from '@/lib/data'
import { formatEuro } from '@/lib/format'
import { cn } from '@/lib/utils'
import { TickerBadge } from './ticker-badge'

async function getLivePrices(): Promise<Record<string, { price: number; change: number }>> {
  try {
    const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/prices`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return {}
    return res.json()
  } catch {
    return {}
  }
}

export async function TopAssets() {
  const prices = await getLivePrices()

  const assets = topAssets.map(asset => ({
    ...asset,
    price: prices[asset.ticker]?.price ?? asset.price,
    change: prices[asset.ticker]?.change ?? asset.change,
    holding: prices[asset.ticker]?.price
      ? prices[asset.ticker].price * asset.shares
      : asset.holding,
  }))

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Top Assets
          </h2>
          <p className="text-sm text-muted-foreground">Your biggest holdings</p>
        </div>
        <button className="text-sm font-semibold text-primary hover:underline">
          View all
        </button>
      </div>
      <ul className="mt-4 flex flex-col">
        {assets.map((asset) => {
          const up = asset.change >= 0
          return (
            <li
              key={asset.ticker}
              className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
            >
              <TickerBadge ticker={asset.ticker} color={asset.color} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-card-foreground">
                  {asset.ticker}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {asset.shares} shares · ${asset.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-card-foreground">
                  {formatEuro(asset.holding)}
                </p>
                <p
                  className={cn(
                    'flex items-center justify-end gap-0.5 text-xs font-semibold',
                    up ? 'text-success' : 'text-danger',
                  )}
                >
                  {up ? (
                    <ArrowUpRight className="size-3" />
                  ) : (
                    <ArrowDownRight className="size-3" />
                  )}
                  {Math.abs(asset.change).toFixed(2)}%
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
