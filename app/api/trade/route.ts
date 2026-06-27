import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { auth } from '@/lib/auth'
import { getSnapshot } from '@/lib/polygon'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function POST(req: NextRequest) {
  // Verificar sesión
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { ticker, type, shares: sharesInput, amountEur } = await req.json()

  if (!ticker || !type || (!sharesInput && !amountEur)) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  if (!['buy', 'sell'].includes(type)) {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  }

  // Obtener precio real de Polygon
  let quote
  try {
    quote = await getSnapshot(ticker.toUpperCase())
  } catch {
    return NextResponse.json({ error: `No se pudo obtener precio de ${ticker}` }, { status: 400 })
  }

  const price = quote.price
  if (price <= 0) {
    return NextResponse.json({ error: 'Precio inválido' }, { status: 400 })
  }

  // Calcular shares y total
  const shares = sharesInput ? parseFloat(sharesInput) : parseFloat(amountEur) / price
  const totalAmount = shares * price

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    // Obtener portfolio del usuario
    const { rows: [portfolio] } = await client.query(
      'SELECT * FROM portfolios WHERE user_id = $1 FOR UPDATE',
      [session.user.id]
    )

    if (!portfolio) {
      // Crear portfolio si no existe
      await client.query(
        'INSERT INTO portfolios (user_id, cash_balance, total_value) VALUES ($1, 10000, 10000)',
        [session.user.id]
      )
      await client.query('ROLLBACK')
      return NextResponse.json({ error: 'Portfolio creado. Inténtalo de nuevo.' }, { status: 400 })
    }

    const cashBefore = parseFloat(portfolio.cash_balance)

    if (type === 'buy') {
      // Verificar saldo suficiente
      if (totalAmount > cashBefore) {
        await client.query('ROLLBACK')
        return NextResponse.json({
          error: `Saldo insuficiente. Tienes €${cashBefore.toFixed(2)} y necesitas €${totalAmount.toFixed(2)}`
        }, { status: 400 })
      }

      const cashAfter = cashBefore - totalAmount

      // Actualizar o crear posición
      const { rows: [existing] } = await client.query(
        'SELECT * FROM positions WHERE portfolio_id = $1 AND ticker = $2',
        [portfolio.id, ticker.toUpperCase()]
      )

      if (existing) {
        const totalShares = parseFloat(existing.shares) + shares
        const newAvg = (parseFloat(existing.shares) * parseFloat(existing.avg_buy_price) + shares * price) / totalShares
        await client.query(
          'UPDATE positions SET shares = $1, avg_buy_price = $2, current_price = $3, updated_at = NOW() WHERE id = $4',
          [totalShares, newAvg, price, existing.id]
        )
      } else {
        await client.query(
          'INSERT INTO positions (portfolio_id, ticker, company_name, shares, avg_buy_price, current_price) VALUES ($1, $2, $3, $4, $5, $6)',
          [portfolio.id, ticker.toUpperCase(), quote.ticker, shares, price, price]
        )
      }

      // Actualizar cash
      await client.query(
        'UPDATE portfolios SET cash_balance = $1, updated_at = NOW() WHERE id = $2',
        [cashAfter, portfolio.id]
      )

      // Registrar transacción
      await client.query(
        'INSERT INTO transactions (portfolio_id, ticker, company_name, type, shares, price_per_share, total_amount, cash_before, cash_after) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [portfolio.id, ticker.toUpperCase(), quote.ticker, 'buy', shares, price, totalAmount, cashBefore, cashAfter]
      )

      await client.query('COMMIT')
      return NextResponse.json({ success: true, cashAfter, shares, price, totalAmount })

    } else {
      // SELL: verificar que tiene acciones suficientes
      const { rows: [position] } = await client.query(
        'SELECT * FROM positions WHERE portfolio_id = $1 AND ticker = $2',
        [portfolio.id, ticker.toUpperCase()]
      )

      if (!position || parseFloat(position.shares) < shares) {
        await client.query('ROLLBACK')
        return NextResponse.json({
          error: `No tienes suficientes acciones de ${ticker}`
        }, { status: 400 })
      }

      const cashAfter = cashBefore + totalAmount
      const remainingShares = parseFloat(position.shares) - shares

      if (remainingShares < 0.0001) {
        await client.query('DELETE FROM positions WHERE id = $1', [position.id])
      } else {
        await client.query(
          'UPDATE positions SET shares = $1, current_price = $2, updated_at = NOW() WHERE id = $3',
          [remainingShares, price, position.id]
        )
      }

      await client.query(
        'UPDATE portfolios SET cash_balance = $1, updated_at = NOW() WHERE id = $2',
        [cashAfter, portfolio.id]
      )

      await client.query(
        'INSERT INTO transactions (portfolio_id, ticker, company_name, type, shares, price_per_share, total_amount, cash_before, cash_after) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
        [portfolio.id, ticker.toUpperCase(), quote.ticker, 'sell', shares, price, totalAmount, cashBefore, cashAfter]
      )

      await client.query('COMMIT')
      return NextResponse.json({ success: true, cashAfter, shares, price, totalAmount })
    }

  } catch (err) {
    await client.query('ROLLBACK')
    return NextResponse.json({ error: String(err) }, { status: 500 })
  } finally {
    client.release()
  }
}
