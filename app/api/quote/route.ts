import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get('ticker') ?? ''
  if (!ticker) return NextResponse.json({ error: 'ticker requerido' }, { status: 400 })

  const apiKey = process.env.POLYGON_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'API key no configurada' }, { status: 500 })

  try {
    const res = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/prev?adjusted=true&apiKey=${apiKey}`,
      { next: { revalidate: 3600 } }
    )
    const data = await res.json()
    const result = data.results?.[0]

    if (!result) {
      return NextResponse.json({ error: 'No hay datos para este ticker' }, { status: 404 })
    }

    const change = ((result.c - result.o) / result.o) * 100

    return NextResponse.json({
      ticker: ticker.toUpperCase(),
      price: result.c,
      open: result.o,
      high: result.h,
      low: result.l,
      volume: result.v,
      change: parseFloat(change.toFixed(2)),
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
