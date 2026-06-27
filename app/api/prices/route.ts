import { NextResponse } from 'next/server'

const TICKERS = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'META', 'GOOGL']

export async function GET() {
  const apiKey = process.env.POLYGON_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'POLYGON_API_KEY no configurada' }, { status: 500 })
  }

  try {
    const tickerList = TICKERS.join(',')
    const res = await fetch(
      `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${tickerList}&apiKey=${apiKey}`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error(`Polygon error: ${res.status}`)

    const data = await res.json()
    const prices: Record<string, { price: number; change: number }> = {}

    for (const snap of data.tickers ?? []) {
      prices[snap.ticker] = {
        price: snap.min?.c ?? snap.day?.c ?? 0,
        change: snap.todaysChangePerc ?? 0,
      }
    }

    return NextResponse.json(prices)
  } catch (err) {
    console.error('Polygon fetch error:', err)
    return NextResponse.json({ error: 'Error obteniendo precios' }, { status: 500 })
  }
}
