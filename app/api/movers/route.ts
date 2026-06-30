import { NextResponse } from 'next/server'

const TICKERS = [
  'AAPL','NVDA','TSLA','MSFT','AMZN','META','GOOGL','AMD',
  'NFLX','PYPL','INTC','BABA','UBER','SPOT','SHOP','COIN',
  'PLTR','SNAP','RIVN','ARM'
]

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function GET() {
  const apiKey = process.env.POLYGON_API_KEY
  if (!apiKey) return NextResponse.json({ gainers: [], losers: [] })

  const results: ({ ticker: string; price: number; change: number } | null)[] = []

  const batchSize = 5
  for (let i = 0; i < TICKERS.length; i += batchSize) {
    const batch = TICKERS.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(async ticker => {
        try {
          const res = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`,
            { cache: 'no-store' }
          )
          const data = await res.json()
          const r = data.results?.[0]
          if (!r) return null
          const change = ((r.c - r.o) / r.o) * 100
          return { ticker, price: r.c, change: parseFloat(change.toFixed(2)) }
        } catch {
          return null
        }
      })
    )
    results.push(...batchResults)

    if (i + batchSize < TICKERS.length) {
      await sleep(12000)
    }
  }

  const valid = results.filter(Boolean) as { ticker: string; price: number; change: number }[]
  const sorted = [...valid].sort((a, b) => b.change - a.change)

  return NextResponse.json({
    gainers: sorted.slice(0, 8),
    losers: sorted.slice(-8).reverse(),
  })
}
