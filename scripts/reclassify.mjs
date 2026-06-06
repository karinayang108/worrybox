import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Parse .env.local manually
const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
for (const line of envFile.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const VALID_CATEGORIES = ['人際關係', '工作/學業', '科技/工具', '日常生活', '其他']

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const anthropic = new Anthropic()

async function classify(content) {
  const msg = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 60,
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
  const raw = msg.content[0].text.trim()
  console.log(`  [AI raw]: "${raw}"`)
  const tags = raw.split(/[,，]/).map(t => t.trim()).filter(t => VALID_CATEGORIES.includes(t))
  return tags.length > 0 ? tags : ['其他']
}

// Fetch complaints currently classified as only ['其他']
const { data: complaints, error } = await supabase
  .from('complaints')
  .select('id, content, category')
  .eq('status', 'published')
  .contains('category', ['其他'])

if (error) { console.error(error); process.exit(1) }

console.log(`Found ${complaints.length} complaint(s) classified as 其他\n`)

for (const c of complaints) {
  const newTags = await classify(c.content)
  console.log(`[${c.id.slice(0, 5)}] "${c.content.slice(0, 50)}..."`)
  console.log(`  Before: ${JSON.stringify(c.category)}`)
  console.log(`  After:  ${JSON.stringify(newTags)}`)

  const { error: updateError } = await supabase
    .from('complaints')
    .update({ category: newTags })
    .eq('id', c.id)

  if (updateError) console.error('  Update failed:', updateError.message)
  else console.log('  ✓ Updated\n')
}

console.log('Done.')
