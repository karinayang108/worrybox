'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/',       label: '首頁',   icon: '🏠' },
  { href: '/submit', label: '投遞煩惱', icon: '✏️' },
  { href: '/browse', label: '隨機翻閱', icon: '📖' },
]

export default function NavMenu() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Top nav bar */}
      <nav className="site-nav">
        <button
          className="menu-btn"
          onClick={() => setOpen(true)}
          aria-label="開啟選單"
        >
          ☰
        </button>
        <span className="site-brand">煩惱盒子</span>
      </nav>

      {/* Slide-out sidebar */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.32)',
              zIndex: 200,
            }}
          />

          {/* Sidebar panel */}
          <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0,
            width: 256, background: '#fff',
            zIndex: 201,
            display: 'flex', flexDirection: 'column',
            boxShadow: '4px 0 24px rgba(0,0,0,0.18)',
          }}>
            {/* Brand header */}
            <div style={{ padding: '32px 24px 20px' }}>
              <span style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 20, fontWeight: 700,
                color: 'var(--brown-mid)',
              }}>煩惱盒子</span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(220,193,177,0.2)', margin: '0 16px 12px' }} />

            {/* Nav items */}
            <div style={{ padding: '0 8px', flex: 1 }}>
              {NAV_ITEMS.map(item => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '11px 16px', borderRadius: 8, marginBottom: 4,
                      background: isActive ? 'var(--orange-cta)' : 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}>
                      <span style={{ fontSize: 17, lineHeight: 1 }}>{item.icon}</span>
                      <span style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 15,
                        color: isActive ? '#fff' : 'var(--brown-mid)',
                        letterSpacing: '0.02em',
                      }}>{item.label}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </>
      )}
    </>
  )
}
