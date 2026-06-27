const BASE = 'https://api.polygon.io'

export interface TickerQuote {
  ticker: string
  price: number
  open: number
  high: number
  low: number
  volume: number
  change: number
  changePercent: number
  marketStatus: string
}

async function polygonFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`)
  url.searchParams.set('apiKey', process.env.POLYGON_API_KEY ?? '')
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`Polygon ${res.status}: ${await res.text()}`)
  return res.json()
}

export async function getSnapshot(ticker: string): Promise<TickerQuote> {
  const data = await polygonFetch<{
    results: Array<{ o: number; h: number; l: number; c: number; v: number }>
    ticker: string
  }>(`/v2/aggs/ticker/${ticker.toUpperCase()}/prev`, { adjusted: 'true' })

  const r = data.results?.[0]
  if (!r) throw new Error(`No data for ${ticker}`)

  const change = ((r.c - r.o) / r.o) * 100

  return {
    ticker:        ticker.toUpperCase(),
    price:         r.c,
    open:          r.o,
    high:          r.h,
    low:           r.l,
    volume:        r.v,
    change:        parseFloat((r.c - r.o).toFixed(4)),
    changePercent: parseFloat(change.toFixed(2)),
    marketStatus:  'closed',
  }
}

export async function searchTickers(query: string): Promise<Array<{ ticker: string; name: string; primaryExchange: string; type: string }>> {
  const data = await polygonFetch<{
    results: Array<{ ticker: string; name: string; primary_exchange: string; type: string }>
  }>(`/v3/reference/tickers`, {
    search: query, active: 'true', market: 'stocks', limit: '8'
  })
  return (data.results ?? []).map(r => ({
    ticker: r.ticker,
    name: r.name,
    primaryExchange: r.primary_exchange,
    type: r.type,
  }))
}
