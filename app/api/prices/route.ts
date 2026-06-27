import { NextResponse } from 'next/server'

const TICKERS = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'META', 'GOOGL']

export async function GET() {
  const apiKey = process.env.POLYGON_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'API key no encontrada', apiKey: 'undefined' }, { status: 500 })
  }

  try {
    const tickerList = TICKERS.join(',')
    const url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?tickers=${tickerList}&apiKey=${apiKey}`
    
    const res = await fetch(url, { next: { revalidate: 60 } })
    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: 'Polygon error', status: res.status, data }, { status: 500 })
    }

    const prices: Record<string, { price: number; change: number }> = {}
    for (const snap of data.tickers ?? []) {
      prices[snap.ticker] = {
        price: snap.min?.c ?? snap.day?.c ?? 0,
        change: snap.todaysChangePerc ?? 0,
      }
    }

    return NextResponse.json(prices)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
