'use server'

import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { createHash } from 'crypto'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

async function getIpHash(): Promise<string> {
  const headersList = await headers()
  const ip =
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  return createHash('sha256').update(ip).digest('hex')
}

export async function submitComplaint(
  content: string,
  email?: string
): Promise<{ id: string }> {
  if (!content.trim()) throw new Error('內容不能為空')

  const supabase = getSupabase()
  const ipHash = await getIpHash()

  const { data, error } = await supabase
    .from('complaints')
    .insert({
      content: content.trim(),
      category: '其他',
      email: email?.trim() || null,
      status: 'published',
      ip_hash: ipHash,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return data
}
