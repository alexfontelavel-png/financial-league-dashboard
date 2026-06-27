import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { auth } from '@/lib/auth'
import { getSnapshot } from '@/lib/polygon'

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
    // Obtener portfolio
    let { rows: [portfolio] } = await client.query(
      'SELECT * FROM portfolios WHERE user_id = $1',
      [session.user.id]
    )

    // Crear si no existe
    if (!portfolio) {
      const { rows: [newPortfolio] } = await client.query(
        'INSERT INTO portfolios (user_id, cash_balance, total_value) VALUES ($1, 10000, 10000) RETURNING *',
        [session.user.id]
      )
      portfolio = newPortfolio
    }

    // Obtener posiciones
    const { rows: positions } = await client.query(
      'SELECT * FROM positions WHERE portfolio_id = $1 ORDER BY created_at DESC',
      [portfolio.id]
    )

    // Actualizar precios actuales de Polygon
    let updatedPositions = positions
    if (positions.length > 0) {
      updatedPositions = await Promise.all(
        positions.map(async (pos) => {
          try {
            const quote = await getSnapshot(pos.ticker)
            await client.query(
              'UPDATE positions SET current_price = $1, updated_at = NOW() WHERE id = $2',
              [quote.price, pos.id]
            )
            return { ...pos, current_price: quote.price }
          } catch {
            return pos
          }
        })
      )
    }

    // Calcular valor total
    const investedValue = updatedPositions.reduce(
      (acc, pos) => acc + parseFloat(pos.shares) * parseFloat(pos.current_price), 0
    )
    const totalValue = parseFloat(portfolio.cash_balance) + investedValue

    // Actualizar total_value en BD
    await client.query(
      'UPDATE portfolios SET total_value = $1, updated_at = NOW() WHERE id = $2',
      [totalValue, portfolio.id]
    )

    // Historial de transacciones
    const { rows: transactions } = await client.query(
      'SELECT * FROM transactions WHERE portfolio_id = $1 ORDER BY executed_at DESC LIMIT 20',
      [portfolio.id]
    )

    return NextResponse.json({
      cash_balance: parseFloat(portfolio.cash_balance),
      total_value: totalValue,
      invested_value: investedValue,
      roi_pct: ((totalValue - 10000) / 10000) * 100,
      positions: updatedPositions.map(pos => ({
        ticker: pos.ticker,
        company_name: pos.company_name,
        shares: parseFloat(pos.shares),
        avg_buy_price: parseFloat(pos.avg_buy_price),
        current_price: parseFloat(pos.current_price),
        current_value: parseFloat(pos.shares) * parseFloat(pos.current_price),
        pnl: (parseFloat(pos.current_price) - parseFloat(pos.avg_buy_price)) * parseFloat(pos.shares),
        pnl_pct: ((parseFloat(pos.current_price) - parseFloat(pos.avg_buy_price)) / parseFloat(pos.avg_buy_price)) * 100,
      })),
      transactions,
    })
  } finally {
    client.release()
  }
}
