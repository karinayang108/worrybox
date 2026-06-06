'use server'

import { createClient } from '@supabase/supabase-js'
import { headers } from 'next/headers'
import { createHash } from 'crypto'
import Anthropic from '@anthropic-ai/sdk'
import { revalidatePath } from 'next/cache'

const VALID_CATEGORIES = ['人際關係', '工作/學業', '科技/工具', '日常生活', '其他'] as const

async function classifyComplaint(content: string): Promise<string[]> {
  try {
    const client = new Anthropic()
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 40,
      messages: [{
        role: 'user',
        content: `以下是一句用戶的煩惱，請從下列分類中選出所有符合的（可以多選），用逗號分隔，只回覆分類名稱，不要有其他文字。

分類說明：
- 人際關係：與特定的人之間的相處、溝通、情感糾紛、友情愛情家人同事關係有關。陌生人、黃牛、客服、系統不算。
- 工作/學業：工作內容、職場文化、學業壓力、考試、讀書有關
- 科技/工具：App、軟體、網站、裝置、網路、系統的使用體驗有關
- 日常生活：食衣住行、購物、外送、交通、娛樂、演唱會、票務、租房、醫療、生活中遇到的各種不便或麻煩
- 其他：內容非常抽象或完全無法歸入以上任何一類，才選此項

規則：優先選具體分類，只有真的完全無法歸類時才選「其他」。

煩惱：${content}`,
      }],
    })
    const raw = (msg.content[0] as { type: 'text'; text: string }).text.trim()
    const tags = raw.split(/[,，]/).map(t => t.trim()).filter(t => (VALID_CATEGORIES as readonly string[]).includes(t))
    return tags.length > 0 ? tags : ['其他']
  } catch {
    return ['其他']
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
  revalidatePath('/browse')
  return data
}
