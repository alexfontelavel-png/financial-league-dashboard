import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { auth } from '@/lib/auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')

  const client = await pool.connect()
  try {
    if (!name) return NextResponse.json({ error: 'Falta nombre' }, { status: 400 })

    const { rows: [league] } = await client.query(
      'SELECT * FROM leagues WHERE LOWER(name) = LOWER($1)',
      [name]
    )
    if (!league) return NextResponse.json({ error: 'Liga no encontrada' }, { status: 404 })

    const { rows: members } = await client.query(`
      SELECT lm.user_id, lm.username, lm.joined_at,
             p.total_value, p.cash_balance,
             ROUND(((p.total_value - 10000) / 10000) * 100, 2) AS roi_pct
      FROM league_members lm
      LEFT JOIN portfolios p ON p.user_id = lm.user_id
      WHERE lm.league_id = $1
      ORDER BY p.total_value DESC NULLS LAST
    `, [league.id])

    return NextResponse.json({ league, members })
  } finally {
    client.release()
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { name, max_participants, entry_fee, duration_days } = await req.json()
  if (!name || !max_participants || !entry_fee || !duration_days) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    const end_date = new Date()
    end_date.setDate(end_date.getDate() + parseInt(duration_days))

    const { rows: [league] } = await client.query(
      `INSERT INTO leagues (name, max_participants, entry_fee, duration_days, end_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name.trim(), parseInt(max_participants), parseFloat(entry_fee), parseInt(duration_days), end_date, session.user.id]
    )

    await client.query(
      `INSERT INTO league_members (league_id, user_id, username) VALUES ($1, $2, $3)`,
      [league.id, session.user.id, session.user.name ?? session.user.email]
    )

    return NextResponse.json({ success: true, league })
  } catch (e: any) {
    if (e.code === '23505') return NextResponse.json({ error: 'Ya existe una liga con ese nombre' }, { status: 409 })
    return NextResponse.json({ error: 'Error creando liga' }, { status: 500 })
  } finally {
    client.release()
  }
}
