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

export async function GET() {
  const client = await pool.connect()
  try {
    const { rows } = await client.query(
      'SELECT ticker, price, change_pct FROM ticker_prices WHERE ticker = ANY($1)',
      [STOCK_TICKERS]
    )

    const valid = rows
      .filter(r => r.change_pct !== null)
      .map(r => ({
        ticker: r.ticker,
        price: parseFloat(r.price),
        change: parseFloat(r.change_pct),
      }))

    const sorted = [...valid].sort((a, b) => b.change - a.change)

    return NextResponse.json({
      gainers: sorted.slice(0, 8),
      losers: sorted.slice(-8).reverse(),
    })
  } finally {
    client.release()
  }
}
