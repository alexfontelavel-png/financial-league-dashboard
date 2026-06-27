import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 1) return NextResponse.json([])

  const apiKey = process.env.POLYGON_API_KEY
  if (!apiKey) return NextResponse.json([])

  try {
    const res = await fetch(
      `https://api.polygon.io/v3/reference/tickers?search=${encodeURIComponent(q)}&active=true&market=stocks&limit=8&apiKey=${apiKey}`,
      { next: { revalidate: 60 } }
    )
    const data = await res.json()
    return NextResponse.json(
      (data.results ?? []).map((r: { ticker: string; name: string; primary_exchange: string }) => ({
        ticker: r.ticker,
        name: r.name,
        exchange: r.primary_exchange,
      }))
    )
  } catch {
    return NextResponse.json([])
  }
}
