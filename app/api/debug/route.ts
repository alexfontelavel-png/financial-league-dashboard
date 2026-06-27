import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasDbUrl: !!process.env.DATABASE_URL,
    dbUrlStart: process.env.DATABASE_URL?.slice(0, 20) ?? 'undefined',
  })
}
