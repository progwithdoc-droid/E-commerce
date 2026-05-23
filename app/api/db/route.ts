import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET() {
  try {
    const sql = getDb()
    const result = await sql`SELECT 1 AS connected, NOW() AS server_time`
    return NextResponse.json({ ok: true, result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}
