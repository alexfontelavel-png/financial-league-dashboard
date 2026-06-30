import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { auth } from '@/lib/auth'
import { getSnapshot } from '@/lib/polygon'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const CRYPTO_TICKERS = new Set([
  'BTC', 'ETH', 'SOL', 'BNB', 'XRP', 'ADA', 'DOGE', 'AVAX',
  'DOT', 'MATIC', 'SHIB', 'LTC', 'UNI', 'LINK', 'ATOM', 'XLM',
  'ALGO', 'VET', 'ICP', 'FIL', 'APT', 'ARB', 'OP', 'SUI', 'SEI',
])

const TICKER_TO_COINGECKO_ID: Record<string, string> = {
  BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', BNB: 'binancecoin',
  XRP: 'ripple', ADA: 'cardano', DOGE: 'dogecoin', AVAX: 'avalanche-2',
  DOT: 'polkadot', MATIC: 'matic-network', SHIB: 'shiba-inu', LTC: 'litecoin',
  UNI: 'uniswap', LINK: 'chainlink', ATOM: 'cosmos', XLM: 'stellar',
  ALGO: 'algorand', VET: 'vechain', ICP: 'internet-computer', FIL: 'filecoin',
  APT: 'aptos', ARB: 'arbitrum', OP: 'optimism', SUI: 'sui', SEI: 'sei-network',
}

function isCrypto(ticker: string): boolean {
  return CRYPTO_TICKERS.has(ticker.toUpperCase())
}

async function getCryptoPrice(ticker: string): Promise<number | null> {
  const coinId = TICKER_TO_COINGECKO_ID[ticker.toUpperCase()]
  if (!coinId) return null
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=eur`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data[coinId]?.eur ?? null
  } catch {
    return null
  }
}

async function getPositionPrice(ticker: string): Promise<number | null> {
  if (isCrypto(ticker)) {
    return getCryptoPrice(ticker)
  }
  try {
    const quote = await getSnapshot(ticker)
    return quote.price ?? null
  } catch (err) {
    console.error(`Polygon error for ${ticker}:`, err)
    return null
  }
}

const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

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

    const updatedPositions = []
    let stockCallCount = 0

    for (const pos of positions) {
      const price = await getPositionPrice(pos.ticker)

      if (price !== null) {
        await client.query(
          'UPDATE positions SET current_price = $1, updated_at = NOW() WHERE id = $2',
          [price, pos.id]
        )
        updatedPositions.push({ ...pos, current_price: price })
      } else {
        // Mantener el precio anterior si falla la API
        updatedPositions.push(pos)
      }

      // Espaciar llamadas a Polygon: máx 5/min con margen de seguridad → 13s entre llamadas
      if (!isCrypto(pos.ticker)) {
        stockCallCount++
        if (stockCallCount < positions.filter(p => !isCrypto(p.ticker)).length) {
          await delay(13000)
        }
      }
    }

    const investedValue = updatedPositions.reduce(
      (acc, pos) => acc + parseFloat(pos.shares) * parseFloat(pos.current_price), 0
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
        current_price: parseFloat(pos.current_price),
        current_value: parseFloat(pos.shares) * parseFloat(pos.current_price),
        pnl:           (parseFloat(pos.current_price) - parseFloat(pos.avg_buy_price)) * parseFloat(pos.shares),
        pnl_pct:       ((parseFloat(pos.current_price) - parseFloat(pos.avg_buy_price)) / parseFloat(pos.avg_buy_price)) * 100,
      })),
      transactions,
    })
  } finally {
    client.release()
  }
}
