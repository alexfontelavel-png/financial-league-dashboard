import { NextResponse } from 'next/server'

const TICKERS = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'AMZN', 'META', 'GOOGL']

export async function GET() {
  const apiKey = process.env.POLYGON_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'API key no encontrada' }, { status: 500 })
  }

  try {
    const prices: Record<string, { price: number; change: number }> = {}

    await Promise.all(
      TICKERS.map(async (ticker) => {
        try {
          const res = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`,
            { next: { revalidate: 3600 } }
          )
          const data = await res.json()
          const result = data.results?.[0]
          if (result) {
            const change = ((result.c - result.o) / result.o) * 100
            prices[ticker] = {
              price: result.c,
              change: parseFloat(change.toFixed(2)),
            }
          }
        } catch {
          // si falla un ticker, continúa con los demás
        }
      })
    )

    return NextResponse.json(prices)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
