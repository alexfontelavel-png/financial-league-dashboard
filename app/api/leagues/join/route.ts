import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { auth } from '@/lib/auth'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { league_id } = await req.json()
  if (!league_id) return NextResponse.json({ error: 'Falta league_id' }, { status: 400 })

  const client = await pool.connect()
  try {
    const { rows: [league] } = await client.query(
      'SELECT * FROM leagues WHERE id = $1', [league_id]
    )
    if (!league) return NextResponse.json({ error: 'Liga no encontrada' }, { status: 404 })

    const { rows: members } = await client.query(
      'SELECT COUNT(*) as count FROM league_members WHERE league_id = $1', [league_id]
    )
    if (parseInt(members[0].count) >= league.max_participants) {
      return NextResponse.json({ error: 'Liga llena' }, { status: 409 })
    }

    await client.query(
      `INSERT INTO league_members (league_id, user_id, username) VALUES ($1, $2, $3)
       ON CONFLICT (league_id, user_id) DO NOTHING`,
      [league_id, session.user.id, session.user.name ?? session.user.email]
    )

    return NextResponse.json({ success: true })
  } finally {
    client.release()
  }
}
