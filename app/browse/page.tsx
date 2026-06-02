import { createClient } from '@supabase/supabase-js'
import NavMenu from '../components/NavMenu'
import BrowseClient from './BrowseClient'

export const revalidate = 60

async function getComplaints() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: complaints, error } = await supabase
    .from('complaints')
    .select('id, content, category, created_at, reactions(count)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(60)

  if (error || !complaints) return []

  return complaints.map(c => ({
    id: c.id,
    content: c.content,
    category: c.category,
    created_at: c.created_at,
    reactionCount: (c.reactions as unknown as { count: number }[])[0]?.count ?? 0,
  }))
}

export default async function BrowsePage() {
  const complaints = await getComplaints()

  return (
    <div className="park-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <div style={{ flexShrink: 0 }}>
        <NavMenu />
        <div style={{ textAlign: 'center', padding: '20px 32px 28px' }}>
          <h1 className="browse-hero-title" style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 40, fontWeight: 700, color: '#fff',
            marginBottom: 8, textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}>看看大家在煩什麼</h1>
          <p className="browse-hero-sub" style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 15, color: 'rgba(255,255,255,0.72)',
          }}>在這些碎紙片中，或許你會發現自己並不孤單，或許你也可以找到你的靈感。</p>
        </div>
      </div>

      <div style={{
        flex: 1, overflowY: 'auto', overflowX: 'hidden',
        background: 'transparent',
        padding: '24px 24px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <BrowseClient complaints={complaints} />
        </div>
      </div>

      <footer className="white-footer">
        <div className="wf-copy">© 煩惱盒子 | 匿名傾訴空間</div>
      </footer>
    </div>
  )
}
