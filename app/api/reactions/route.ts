import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function getIpHash(request: NextRequest): string {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    '127.0.0.1'
  return createHash('sha256').update(ip).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { complaintId } = await request.json()
    if (!complaintId) {
      return NextResponse.json({ error: 'Missing complaintId' }, { status: 400 })
    }

    const supabase = getSupabase()
    const ipHash = getIpHash(request)

    // Check if already reacted
    const { data: existing } = await supabase
      .from('reactions')
      .select('id')
      .eq('complaint_id', complaintId)
      .eq('ip_hash', ipHash)
      .maybeSingle()

    if (existing) {
      // Toggle off
      await supabase.from('reactions').delete().eq('id', existing.id)
      return NextResponse.json({ reacted: false })
    }

    // Add reaction
    const { error } = await supabase
      .from('reactions')
      .insert({ complaint_id: complaintId, ip_hash: ipHash })

    if (error) throw error
    return NextResponse.json({ reacted: true })
  } catch (err) {
    console.error('[reactions]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
