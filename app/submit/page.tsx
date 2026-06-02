'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { submitComplaint } from '../actions'

type Step = 1 | 2 | 3 | 'done'

export default function SubmitPage() {
  const [step, setStep] = useState<Step>(1)
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  async function handleSubmit(withEmail: boolean) {
    setLoading(true)
    setError('')
    try {
      await submitComplaint(content, withEmail ? email : undefined)
      setStep('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : '送出失敗，請再試一次')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.shiftKey === false && content.trim()) {
      e.preventDefault()
      setStep(2)
    }
  }

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="park-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <nav className="site-nav">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <button className="menu-btn" aria-label="選單">☰</button>
            </Link>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span className="site-brand">煩惱盒子</span>
            </Link>
          </nav>

          {/* Title */}
          <div style={{ textAlign: 'center', padding: '16px 24px 0', flexShrink: 0 }}>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 32, fontWeight: 700, color: '#fff',
              textShadow: '0 2px 12px rgba(0,0,0,0.3)', marginBottom: 8,
            }}>說說看，什麼讓你最近很煩？</h1>
            <p style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7,
            }}>
              生活中某件重複讓你覺得麻煩的事？人與人之間讓你覺得累的事？某個 App 或工具讓你用得很崩潰？
            </p>
          </div>

          {/* Typewriter + paper */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', position: 'relative', width: '100%' }}>

            {/* ENTER key — bottom right of typewriter */}
            <div style={{
              position: 'absolute',
              right: 'calc(50% - 340px)',
              bottom: 'calc(var(--footer-h) + 8px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6, zIndex: 10,
            }}>
              <span style={{
                fontFamily: 'var(--font-sans)', fontSize: 11,
                color: '#fff', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}>寫好了嗎？</span>
              <button
                className="tw-key-btn"
                onClick={() => content.trim() && setStep(2)}
                disabled={!content.trim()}
                style={{ opacity: content.trim() ? 1 : 0.4 }}
                aria-label="送出"
              >
                <span style={{ fontSize: 22, lineHeight: 1 }}>↵</span>
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 8, letterSpacing: '0.12em', fontWeight: 'bold' }}>ENTER</span>
              </button>
            </div>

            {/* Typewriter assembly */}
            <div style={{ maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {/* Paper */}
              <div style={{
                width: 360,
                backgroundColor: 'var(--paper-bg)',
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(160,148,128,0.16) 28px)',
                border: '1px solid rgba(220,210,190,0.6)',
                boxShadow: '2px 0 6px -2px rgba(0,0,0,0.08), -2px 0 6px -2px rgba(0,0,0,0.08), 0 -2px 4px rgba(0,0,0,0.05)',
                padding: '16px 28px 20px',
                position: 'relative', zIndex: 2,
                marginBottom: -160,
              }}>
                <div style={{
                  position: 'absolute', left: 44, top: 0, bottom: 0,
                  width: 1, background: 'rgba(220,160,160,0.25)',
                }} />
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="在這裡開始打字..."
                  style={{
                    width: '100%', minHeight: 100,
                    background: 'transparent', border: 'none', outline: 'none',
                    resize: 'none',
                    fontFamily: 'var(--font-sans)', fontSize: 15,
                    color: '#3a2a1e', lineHeight: '28px', paddingLeft: 6,
                  }}
                />
              </div>

              {/* Typewriter image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/typewriter.png"
                alt="打字機"
                style={{
                  width: 560, position: 'relative', zIndex: 3,
                  filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.5))',
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="white-footer" style={{ position: 'relative', zIndex: 1, marginTop: -56 }}>
            <div className="wf-links">
              <span className="wf-link">隱私權政策</span>
              <span className="wf-link">匿名條款</span>
              <span className="wf-link">聯繫我們</span>
            </div>
            <div className="wf-copy">© 煩惱盒子 | 匿名傾訴空間</div>
          </div>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="park-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <nav className="site-nav">
            <button className="menu-btn" onClick={() => setStep(1)} aria-label="返回">☰</button>
            <span className="site-brand">煩惱盒子</span>
          </nav>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div
              className="paper-lined paper-shadow"
              style={{
                maxWidth: 520, width: '100%',
                padding: '36px 48px', textAlign: 'center',
                position: 'relative', borderRadius: 2,
              }}
            >
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 22, fontWeight: 700, color: 'var(--brown-mid)', marginBottom: 8,
              }}>確定要把這個送出去嗎？</h2>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13, color: '#9b8878', marginBottom: 20,
              }}>送出後無法刪除，但完全匿名 🔒</p>

              <div style={{
                background: 'rgba(114,90,66,0.06)',
                borderLeft: '3px solid var(--brown-mid)',
                padding: '12px 16px', borderRadius: '0 4px 4px 0',
                textAlign: 'left', marginBottom: 28,
                fontFamily: 'var(--font-sans)',
                fontSize: 14, color: '#3a2a1e',
                lineHeight: 1.8, fontStyle: 'italic',
              }}>
                「{content.length > 120 ? content.slice(0, 120) + '…' : content}」
              </div>

              {error && (
                <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(114,90,66,0.3)',
                    color: 'var(--brown-mid)', padding: '10px 28px',
                    borderRadius: 4, cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', fontSize: 14,
                  }}
                >← 再改一下</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={loading}
                  style={{
                    background: 'var(--orange-cta)', color: '#fff',
                    border: 'none', padding: '10px 36px',
                    borderRadius: 4, cursor: 'pointer',
                    fontFamily: 'var(--font-sans)', fontSize: 14,
                    letterSpacing: '0.05em', opacity: loading ? 0.7 : 1,
                  }}
                >確認送出 ✓</button>
              </div>
            </div>
          </div>

          <footer className="white-footer">
            <div className="wf-links">
              <span className="wf-link">隱私權政策</span>
              <span className="wf-link">匿名條款</span>
              <span className="wf-link">聯繫我們</span>
            </div>
            <div className="wf-copy">© 煩惱盒子 | 匿名傾訴空間</div>
          </footer>
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div className="park-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <nav className="site-nav">
            <span className="site-brand">煩惱盒子</span>
          </nav>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div
              className="paper-lined paper-shadow"
              style={{
                maxWidth: 480, width: '100%',
                padding: '36px 48px', textAlign: 'center',
                position: 'relative', borderRadius: 2,
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>✉️</div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 20, fontWeight: 700, color: 'var(--brown-mid)', marginBottom: 10,
              }}>想收到一封回信嗎？</h2>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 13, color: '#9b8878', lineHeight: 1.8, marginBottom: 22,
              }}>
                留下 Email，我們也許會親自回覆你。<br />
                不一定會收到，但我們會試試。<br />
                <span style={{ fontSize: 12, color: '#c4b5a8' }}>（Email 不會公開，只有我們看得到）</span>
              </p>

              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1px solid rgba(220,193,177,0.6)', borderRadius: 4,
                  background: 'rgba(255,255,255,0.7)',
                  fontFamily: 'var(--font-sans)', fontSize: 14,
                  color: '#3a2a1e', outline: 'none', marginBottom: 12,
                }}
              />

              {error && (
                <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>
              )}

              <button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                style={{
                  width: '100%', background: 'var(--orange-cta)', color: '#fff',
                  border: 'none', padding: 12, borderRadius: 4,
                  fontFamily: 'var(--font-sans)', fontSize: 14,
                  cursor: 'pointer', marginBottom: 10,
                  opacity: loading ? 0.7 : 1,
                }}
              >好，等你的信 →</button>
              <br />
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                style={{
                  background: 'none', border: 'none',
                  color: '#9b8878', fontSize: 13, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  textDecoration: 'underline', textUnderlineOffset: 3,
                }}
              >不用了，直接完成</button>
            </div>
          </div>

          <footer className="white-footer">
            <div className="wf-links">
              <span className="wf-link">隱私權政策</span>
              <span className="wf-link">匿名條款</span>
              <span className="wf-link">聯繫我們</span>
            </div>
            <div className="wf-copy">© 煩惱盒子 | 匿名傾訴空間</div>
          </footer>
        </div>
      )}

      {/* ── DONE ── */}
      {step === 'done' && (
        <div className="park-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <nav className="site-nav">
            <span className="site-brand">煩惱盒子</span>
          </nav>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div
              className="paper-lined paper-shadow"
              style={{
                maxWidth: 440, width: '100%',
                padding: '40px 48px', textAlign: 'center',
                position: 'relative', borderRadius: 2,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>🌿</div>
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 22, fontWeight: 700, color: 'var(--brown-mid)', marginBottom: 10,
              }}>說出來了</h2>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 14, color: '#9b8878', lineHeight: 1.8, marginBottom: 28,
              }}>
                你的煩惱已經留在這裡了。<br />
                也許有人懂你，甚至是幫你解決問題。
              </p>
              <Link href="/browse" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'var(--brown-mid)', color: '#fff',
                  border: 'none', padding: '10px 32px',
                  borderRadius: 4, cursor: 'pointer',
                  fontFamily: 'var(--font-sans)', fontSize: 14,
                  letterSpacing: '0.05em',
                }}>看看大家在煩什麼</button>
              </Link>
            </div>
          </div>

          <footer className="white-footer">
            <div className="wf-links">
              <span className="wf-link">隱私權政策</span>
              <span className="wf-link">匿名條款</span>
              <span className="wf-link">聯繫我們</span>
            </div>
            <div className="wf-copy">© 煩惱盒子 | 匿名傾訴空間</div>
          </footer>
        </div>
      )}
    </div>
  )
}
