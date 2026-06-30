import { NextResponse } from 'next/server'

const TICKERS = ['AAPL', 'NVDA', 'TSLA']

export async function GET() {
  const apiKey = process.env.POLYGON_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'No API key' })

  const debug: any[] = []

  for (const ticker of TICKERS) {
    try {
      const res = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`,
        { cache: 'no-store' }
      )
      const data = await res.json()
      debug.push({ ticker, status: res.status, data })
    } catch (err) {
      debug.push({ ticker, error: String(err) })
    }
  }

  return NextResponse.json({ debug })
}
