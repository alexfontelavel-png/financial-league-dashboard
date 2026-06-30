import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const STOCK_TICKERS = [
  'AAPL','NVDA','TSLA','MSFT','AMZN','META','GOOGL','AMD',
  'NFLX','PYPL','INTC','BABA','UBER','SPOT','SHOP','COIN',
  'PLTR','SNAP','RIVN','ARM','AVGO','DIS',
]

const TICKER_TO_COINGECKO_ID: Record<string, string> = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin',
  XRP: 'ripple', ADA: 'cardano', DOGE: 'dogecoin', AVAX: 'avalanche-2',
  DOT: 'polkadot', MATIC: 'matic-network', SHIB: 'shiba-inu', LTC: 'litecoin',
  UNI: 'uniswap', LINK: 'chainlink', ATOM: 'cosmos', XLM: 'stellar',
  ALGO: 'algorand', VET: 'vechain', ICP: 'internet-computer', FIL: 'filecoin',
  APT: 'aptos', ARB: 'arbitrum', OP: 'optimism', SUI: 'sui', SEI: 'sei-network',
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function GET(req: Request) {
  // Proteger con secret para que no lo llame cualquiera
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const apiKey = process.env.POLYGON_API_KEY
  const client = await pool.connect()
  const updated: string[] = []
  const failed: string[] = []

  try {
    // Acciones — respetando 5 req/min de Polygon
    if (apiKey) {
      for (let i = 0; i < STOCK_TICKERS.length; i++) {
        const ticker = STOCK_TICKERS[i]
        try {
          const res = await fetch(
            `https://api.polygon.io/v2/aggs/ticker/${ticker}/prev?adjusted=true&apiKey=${apiKey}`,
            { cache: 'no-store' }
          )
          const data = await res.json()
          const r = data.results?.[0]
          if (r) {
            const changePct = ((r.c - r.o) / r.o) * 100
            await client.query(
              `INSERT INTO ticker_prices (ticker, price, change_pct, updated_at)
               VALUES ($1, $2, $3, NOW())
               ON CONFLICT (ticker) DO UPDATE SET price = $2, change_pct = $3, updated_at = NOW()`,
              [ticker, r.c, changePct]
            )
            updated.push(ticker)
          } else {
            failed.push(ticker)
          }
        } catch {
          failed.push(ticker)
        }
        // 13s entre llamadas para respetar 5 req/min
        if (i < STOCK_TICKERS.length - 1) await delay(13000)
      }
    }

    // Crypto — todas de golpe, CoinGecko permite más volumen
    const coinIds = Object.values(TICKER_TO_COINGECKO_ID).join(',')
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=eur&include_24hr_change=true`,
        { cache: 'no-store' }
      )
      const data = await res.json()
      for (const [ticker, coinId] of Object.entries(TICKER_TO_COINGECKO_ID)) {
        const info = data[coinId]
        if (info?.eur) {
          await client.query(
            `INSERT INTO ticker_prices (ticker, price, change_pct, updated_at)
             VALUES ($1, $2, $3, NOW())
             ON CONFLICT (ticker) DO UPDATE SET price = $2, change_pct = $3, updated_at = NOW()`,
            [ticker, info.eur, info.eur_24h_change ?? null]
          )
          updated.push(ticker)
        } else {
          failed.push(ticker)
        }
      }
    } catch {
      // ignorar fallos crypto puntuales
    }

    return NextResponse.json({ updated, failed, count: updated.length })
  } finally {
    client.release()
  }
}
