'use client'

import { useState } from 'react'
import ReactionButton from './ReactionButton'

const CATEGORIES = ['全部', '人際關係', '工作/學業', '科技/工具', '日常生活', '其他'] as const
const ROTATIONS = [-0.8, 0.6, -1.2, 0.4, -0.5, 1.0, -0.9, 0.7, -0.3, 0.8, -1.1, 0.5]

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

type Complaint = {
  id: string
  content: string
  category: string | null
  created_at: string
  reactionCount: number
}

export default function BrowseClient({ complaints }: { complaints: Complaint[] }) {
  const [active, setActive] = useState<string>('全部')

  const filtered = active === '全部'
    ? complaints
    : complaints.filter(c => c.category === active)

  return (
    <>
      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`filter-pill ${active === cat ? 'active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 24px',
          fontFamily: 'var(--font-sans)', color: 'rgba(255,255,255,0.75)', fontSize: 16,
        }}>
          這個分類還沒有煩惱，快去投遞第一個吧 🌿
        </div>
      ) : (
        <div className="browse-grid">
          {filtered.map((complaint, i) => (
            <div
              key={complaint.id}
              className="worry-card"
              style={{ transform: `rotate(${ROTATIONS[i % ROTATIONS.length]}deg)` }}
            >
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
    </>
  )
}
