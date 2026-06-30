import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { auth } from '@/lib/auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const client = await pool.connect()
  try {
    let { rows: [portfolio] } = await client.query(
      'SELECT * FROM portfolios WHERE user_id = $1',
      [session.user.id]
    )

    if (!portfolio) {
      const { rows: [newPortfolio] } = await client.query(
        'INSERT INTO portfolios (user_id, cash_balance, total_value) VALUES ($1, 10000, 10000) RETURNING *',
        [session.user.id]
      )
      portfolio = newPortfolio
    }

    const { rows: positions } = await client.query(
      'SELECT * FROM positions WHERE portfolio_id = $1 ORDER BY created_at DESC',
      [portfolio.id]
    )

    // Leer precios actuales desde la caché compartida
    const tickers = positions.map(p => p.ticker)
    const priceMap = new Map<string, number>()

    if (tickers.length > 0) {
      const { rows: cachedPrices } = await client.query(
        'SELECT ticker, price FROM ticker_prices WHERE ticker = ANY($1)',
        [tickers]
      )
      for (const row of cachedPrices) {
        priceMap.set(row.ticker, parseFloat(row.price))
      }
    }

    const updatedPositions = positions.map(pos => {
      const cachedPrice = priceMap.get(pos.ticker)
      return {
        ...pos,
        current_price: cachedPrice ?? parseFloat(pos.current_price),
      }
    })

    const investedValue = updatedPositions.reduce(
      (acc, pos) => acc + parseFloat(pos.shares) * parseFloat(pos.current_price as any), 0
    )
    const totalValue = parseFloat(portfolio.cash_balance) + investedValue

    await client.query(
      'UPDATE portfolios SET total_value = $1, updated_at = NOW() WHERE id = $2',
      [totalValue, portfolio.id]
    )

    const { rows: transactions } = await client.query(
      'SELECT * FROM transactions WHERE portfolio_id = $1 ORDER BY executed_at DESC LIMIT 20',
      [portfolio.id]
    )

    return NextResponse.json({
      cash_balance:   parseFloat(portfolio.cash_balance),
      total_value:    totalValue,
      invested_value: investedValue,
      roi_pct:        ((totalValue - 10000) / 10000) * 100,
      positions: updatedPositions.map(pos => ({
        ticker:        pos.ticker,
        company_name:  pos.company_name,
        shares:        parseFloat(pos.shares),
        avg_buy_price: parseFloat(pos.avg_buy_price),
        current_price: parseFloat(pos.current_price as any),
        current_value: parseFloat(pos.shares) * parseFloat(pos.current_price as any),
        pnl:           (parseFloat(pos.current_price as any) - parseFloat(pos.avg_buy_price)) * parseFloat(pos.shares),
        pnl_pct:       ((parseFloat(pos.current_price as any) - parseFloat(pos.avg_buy_price)) / parseFloat(pos.avg_buy_price)) * 100,
      })),
      transactions,
    })
  } finally {
    client.release()
  }
}
