'use server'

import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { createHash } from 'crypto'
import Anthropic from '@anthropic-ai/sdk'

const VALID_CATEGORIES = ['人際關係', '工作/學業', '科技/工具', '日常生活', '其他'] as const

async function classifyComplaint(content: string): Promise<string> {
  try {
    const client = new Anthropic()
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 20,
      messages: [{
        role: 'user',
        content: `以下是一句用戶的煩惱，請從 [人際關係, 工作/學業, 科技/工具, 日常生活, 其他] 中選一個最符合的分類，只回覆分類名稱，不要有其他文字。\n\n煩惱：${content}`,
      }],
    })
    const result = (msg.content[0] as { type: 'text'; text: string }).text.trim()
    return (VALID_CATEGORIES as readonly string[]).includes(result) ? result : '其他'
  } catch {
    return '其他'
  }
}

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
      category: await classifyComplaint(content),
      email: email?.trim() || null,
      status: 'published',
      ip_hash: ipHash,
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)
  return data
}
