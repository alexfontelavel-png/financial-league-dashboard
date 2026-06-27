import { ArrowUpRight, Wallet, Coins } from 'lucide-react'
import { portfolio } from '@/lib/data'
import { formatEuro, formatPct } from '@/lib/format'

function AreaSparkline({ data }: { data: number[] }) {
  const width = 520
  const height = 130
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const stepX = width / (data.length - 1)

  const points = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * (height - 16) - 8
    return [x, y] as const
  })

  const linePath = points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ')

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-32 w-full"
      role="img"
      aria-label="Portfolio value trend over the last 12 months"
    >
      <defs>
        <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#equityFill)" />
      <path
        d={linePath}
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PortfolioCard() {
  return (
    <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-primary-foreground/70">
            Total Portfolio Value
          </p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">
            {formatEuro(portfolio.value)}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-semibold">
              <ArrowUpRight className="size-3.5" />
              {formatPct(portfolio.changePct)}
            </span>
            <span className="text-sm text-primary-foreground/70">
              {formatEuro(portfolio.changeAbs)} this season
            </span>
          </div>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary-foreground/15">
          <Wallet className="size-5" />
        </div>
      </div>

      <div className="-mx-1 mt-4">
        <AreaSparkline data={portfolio.equity} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-primary-foreground/10 p-4">
          <div className="flex items-center gap-2 text-primary-foreground/70">
            <Coins className="size-4" />
            <span className="text-xs font-medium">Invested</span>
          </div>
          <p className="mt-1.5 text-lg font-semibold">
            {formatEuro(portfolio.invested)}
          </p>
        </div>
        <div className="rounded-2xl bg-primary-foreground/10 p-4">
          <div className="flex items-center gap-2 text-primary-foreground/70">
            <Wallet className="size-4" />
            <span className="text-xs font-medium">Cash Available</span>
          </div>
          <p className="mt-1.5 text-lg font-semibold">
            {formatEuro(portfolio.cash)}
          </p>
        </div>
      </div>
    </section>
  )
}
