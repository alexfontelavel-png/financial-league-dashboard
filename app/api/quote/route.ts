import { NextRequest, NextResponse } from 'next/server'

function todayET(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

function yesterdayET(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

export async function GET(req: NextRequest) {
  const ticker = req.nextUrl.searchParams.get('ticker') ?? ''
  if (!ticker) return NextResponse.json({ error: 'ticker requerido' }, { status: 400 })

  const apiKey = process.env.POLYGON_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'API key no configurada' }, { status: 500 })

  const t = ticker.toUpperCase()

  async function fetchDay(date: string) {
    const res = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${t}/range/1/day/${date}/${date}?adjusted=true&apiKey=${apiKey}`,
      { cache: 'no-store' }
    )
    const data = await res.json()
    return data.results?.[0] ?? null
  }

  try {
    // 1. Intentar cierre de hoy
    let result = await fetchDay(todayET())

    // 2. Si no hay datos, intentar ayer
    if (!result) result = await fetchDay(yesterdayET())

    // 3. Fallback a /prev
    if (!result) {
      const res = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${t}/prev?adjusted=true&apiKey=${apiKey}`,
        { cache: 'no-store' }
      )
      const data = await res.json()
      result = data.results?.[0] ?? null
    }

    if (!result) {
      return NextResponse.json({ error: 'No hay datos para este ticker' }, { status: 404 })
    }

    const change = ((result.c - result.o) / result.o) * 100
    return NextResponse.json({
      ticker: t,
      price:  result.c,
      open:   result.o,
      high:   result.h,
      low:    result.l,
      volume: result.v,
      change: parseFloat(change.toFixed(2)),
    })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
