import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import ReactionButton from './ReactionButton'

const CATEGORIES = ['全部', '人際關係', '工作／學業', '科技／工具', '日常生活', '其他'] as const

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins} 分鐘前`
  if (hours < 24) return `${hours} 小時前`
  if (days < 7) return `${days} 天前`
  return new Date(dateStr).toLocaleDateString('zh-TW')
}

async function getComplaints(category?: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  let query = supabase
    .from('complaints')
    .select('id, content, category, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(12)

  if (category && category !== '全部') {
    query = query.eq('category', category)
  }

  const { data: complaints, error } = await query
  if (error || !complaints) return []

  // Get reaction counts
  const ids = complaints.map(c => c.id)
  const { data: reactions } = await supabase
    .from('reactions')
    .select('complaint_id')
    .in('complaint_id', ids)

  const counts = (reactions || []).reduce<Record<string, number>>((acc, r) => {
    acc[r.complaint_id] = (acc[r.complaint_id] || 0) + 1
    return acc
  }, {})

  return complaints.map((c, i) => ({
    ...c,
    reactionCount: counts[c.id] || 0,
    index: i,
  }))
}

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function BrowsePage({ searchParams }: PageProps) {
  const { category } = await searchParams
  const complaints = await getComplaints(category)

  // Tape rotation pattern
  const rotations = [-0.8, 0.6, -1.2, 0.4, -0.5, 1.0, -0.9, 0.7, -0.3, 0.8, -1.1, 0.5]

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      className="browse-page">

      {/* Hero with park bg */}
      <div className="park-bg" style={{ flexShrink: 0 }}>
        <nav className="site-nav">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button className="menu-btn" aria-label="選單">☰</button>
          </Link>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span className="site-brand">煩惱盒子</span>
          </Link>
        </nav>
        <div style={{
          background: 'linear-gradient(rgba(20,25,20,0.38), rgba(20,25,20,0.5))',
          padding: '36px 32px 32px', textAlign: 'center',
        }}>
          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 40, fontWeight: 700, color: '#fff',
            marginBottom: 8, textShadow: '0 2px 12px rgba(0,0,0,0.3)',
          }}>看看大家在煩什麼</h1>
          <p style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 15, color: 'rgba(255,255,255,0.72)',
          }}>在這些碎紙片中，或許你會發現自己並不孤單。</p>
        </div>
      </div>

      {/* Scrollable body over park bg */}
      <div style={{
        flex: 1, overflowY: 'auto',
        background: 'url(/bg.jpg) center / cover no-repeat fixed',
        padding: '24px 24px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Category filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                href={cat === '全部' ? '/browse' : `/browse?category=${encodeURIComponent(cat)}`}
                style={{ textDecoration: 'none' }}
              >
                <button className={`filter-pill ${(!category && cat === '全部') || category === cat ? 'active' : ''}`}>
                  {cat}
                </button>
              </Link>
            ))}
          </div>

          {/* Cards grid */}
          {complaints.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 24px',
              fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.7)', fontSize: 16,
            }}>
              這個分類還沒有煩惱，快去投遞第一個吧 🌿
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24, marginBottom: 28,
              alignItems: 'start',
            }}>
              {complaints.map((complaint, i) => (
                <div
                  key={complaint.id}
                  className="worry-card"
                  style={{ transform: `rotate(${rotations[i % rotations.length]}deg)` }}
                >
                  {/* Tape */}
                  <div className="tape" style={{
                    position: 'absolute', top: -12,
                    left: i % 3 === 2 ? '45%' : '50%',
                    transform: `translateX(-50%) rotate(${i % 2 === 0 ? -1.5 : 1.8}deg)`,
                    width: i % 3 === 2 ? 72 : 88, height: 22,
                    zIndex: 10,
                  }} />

                  <div style={{
                    fontFamily: 'var(--font-sans)', fontSize: 12,
                    color: '#b8a888', marginBottom: 10,
                    letterSpacing: '0.02em',
                  }}>
                    #{complaint.id.slice(0, 5).toUpperCase()} — {timeAgo(complaint.created_at)}
                  </div>

                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14, color: '#3a2a1e',
                    lineHeight: 1.85, marginBottom: 14, letterSpacing: '0.02em',
                  }}>{complaint.content}</p>

                  <ReactionButton
                    complaintId={complaint.id}
                    initialCount={complaint.reactionCount}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Load more */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 28 }}>
            <button style={{
              background: 'rgba(252,250,242,0.9)',
              border: '1.5px solid #b8a888', borderRadius: 6,
              padding: '12px 48px', cursor: 'pointer',
              fontFamily: 'var(--font-sans)', fontSize: 14,
              color: 'var(--brown-light)', letterSpacing: '0.03em',
              backdropFilter: 'blur(4px)',
            }}>翻閱更多碎紙片...</button>
          </div>
        </div>

        {/* Footer inside scroll area */}
        <footer className="white-footer">
          <div className="wf-links">
            <span className="wf-link">隱私權政策</span>
            <span className="wf-link">匿名條款</span>
            <span className="wf-link">聯繫我們</span>
          </div>
          <div className="wf-copy">© 煩惱盒子 | 匿名傾訴空間</div>
        </footer>
      </div>
    </div>
  )
}
