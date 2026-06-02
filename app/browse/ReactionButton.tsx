'use client'

import { useState, useEffect } from 'react'

const LS_KEY = 'worrybox_reacted'

function getReacted(): Set<string> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch { return new Set() }
}

function saveReacted(set: Set<string>) {
  try { localStorage.setItem(LS_KEY, JSON.stringify([...set])) } catch {}
}

interface Props {
  complaintId: string
  initialCount: number
}

export default function ReactionButton({ complaintId, initialCount }: Props) {
  const [count, setCount] = useState(initialCount)
  const [reacted, setReacted] = useState(false)
  const [loading, setLoading] = useState(false)

  // Initialise from localStorage after mount (client-only)
  useEffect(() => {
    setReacted(getReacted().has(complaintId))
  }, [complaintId])

  async function handleClick() {
    if (loading) return
    setLoading(true)

    // Optimistic update
    const newReacted = !reacted
    setReacted(newReacted)
    setCount(c => newReacted ? c + 1 : c - 1)

    try {
      const res = await fetch('/api/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaintId }),
      })
      const data = await res.json()
      // Sync with server truth
      const finalReacted = data.reacted ?? newReacted
      if (finalReacted !== newReacted) {
        setReacted(finalReacted)
        setCount(c => finalReacted ? c + 1 : c - 1)
      }
      // Persist to localStorage
      const set = getReacted()
      if (finalReacted) set.add(complaintId); else set.delete(complaintId)
      saveReacted(set)
    } catch {
      // Roll back on error
      setReacted(reacted)
      setCount(initialCount)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: reacted ? 'var(--brown-dark)' : 'rgba(252,250,242,0.9)',
          border: `1.5px solid ${reacted ? 'var(--brown-dark)' : '#b8a888'}`,
          borderRadius: 4, padding: '6px 16px',
          color: reacted ? '#fff' : 'var(--brown-light)',
          fontFamily: 'var(--font-sans)', fontSize: 13,
          cursor: loading ? 'default' : 'pointer',
          transition: 'all 0.15s',
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap',
        }}
      >
        {reacted ? '🤎' : '🤍'} SAME
      </button>
      <span style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 12, color: '#b8a888',
        whiteSpace: 'nowrap',
      }}>{count} 人共鳴</span>
    </div>
  )
}
