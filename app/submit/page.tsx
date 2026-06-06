'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NavMenu from '../components/NavMenu'
import { submitComplaint } from '../actions'
import TypewriterImage from '../../public/typewriter.png'

type Step = 1 | 2 | 3 | 'done'

export default function SubmitPage() {
  const [step, setStep] = useState<Step>(1)
  const [content, setContent] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const [flyKeys, setFlyKeys] = useState<{ key: string; id: number; x: number }[]>([])
  const flyKeyIdRef = useRef(0)
  const paperRef = useRef<HTMLDivElement>(null)
  const [paperShake, setPaperShake] = useState(false)

  // Keyboard row → pitch multiplier (higher row = higher pitch, like a real typewriter)
  const KEY_ROW: Record<string, number> = {
    // Number row — highest
    '`':4,'1':4,'2':4,'3':4,'4':4,'5':4,'6':4,'7':4,'8':4,'9':4,'0':4,'-':4,'=':4,
    // QWERTY row
    'q':3,'w':3,'e':3,'r':3,'t':3,'y':3,'u':3,'i':3,'o':3,'p':3,'[':3,']':3,'\\':3,
    // ASDF row
    'a':2,'s':2,'d':2,'f':2,'g':2,'h':2,'j':2,'k':2,'l':2,';':2,"'":2,'Enter':2,
    // ZXCV row
    'z':1,'x':1,'c':1,'v':1,'b':1,'n':1,'m':1,',':1,'.':1,'/':1,'Backspace':1,
    // Space bar — lowest thud
    ' ':0,
  }
  const ROW_HPF  = [300, 550, 850, 1150, 1500] // Hz per row (0=space … 4=numbers)
  const ROW_DECAY= [0.07, 0.06, 0.05, 0.04, 0.035] // seconds

  const playTypewriterClick = useCallback((key: string) => {
    if (typeof window === 'undefined') return
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    const ctx = audioCtxRef.current

    const row   = KEY_ROW[key.toLowerCase()] ?? KEY_ROW[key] ?? 2
    const hpfHz = ROW_HPF[row]
    const decay = ROW_DECAY[row]

    const bufferSize = Math.floor(ctx.sampleRate * 0.05)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * (decay / 0.05)))
    }

    const source = ctx.createBufferSource()
    source.buffer = buffer

    const hpf = ctx.createBiquadFilter()
    hpf.type = 'highpass'
    hpf.frequency.value = hpfHz

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(row === 0 ? 0.5 : 0.35, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decay)

    source.connect(hpf)
    hpf.connect(gain)
    gain.connect(ctx.destination)
    source.start()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  function spawnFlyKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    let label: string | null = null
    if (e.key === ' ')         label = '␣'
    else if (e.key === 'Enter')     label = '↵'
    else if (e.key === 'Backspace') label = '⌫'
    else if (e.key.length === 1)    label = e.key.toUpperCase()
    if (!label) return

    // Random horizontal offset so keys don't all stack
    const x = (Math.random() - 0.5) * 120
    const id = ++flyKeyIdRef.current
    setFlyKeys(prev => [...prev.slice(-6), { key: label!, id, x }])
    setTimeout(() => setFlyKeys(prev => prev.filter(k => k.id !== id)), 550)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Play click on every real keypress (skip modifier-only keys)
    if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Backspace') {
      playTypewriterClick(e.key)
      spawnFlyKey(e)
    }
    // Paper jitter on Enter
    if (e.key === 'Enter') {
      setPaperShake(true)
      setTimeout(() => setPaperShake(false), 180)
    }
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && content.trim()) {
      e.preventDefault()
      setStep(2)
    }
  }

  const wfFooter = (
    <div className="white-footer" style={{ position: 'relative', zIndex: 1, marginTop: -56 }}>
      <div className="wf-copy">© 煩惱盒子 | Pain points collection</div>
    </div>
  )

  const stdFooter = (
    <footer className="white-footer">
      <div className="wf-copy">© 煩惱盒子 | Pain points collection</div>
    </footer>
  )

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
    <style>{`
      @keyframes keyFly {
        0%   { opacity: 1; transform: translateX(var(--kx)) translateY(0)   scale(1);    }
        30%  { opacity: 1; transform: translateX(var(--kx)) translateY(-18px) scale(1.15); }
        100% { opacity: 0; transform: translateX(var(--kx)) translateY(-52px) scale(0.8); }
      }
      @keyframes paperJitter {
        0%,100% { transform: translateY(0); }
        25%      { transform: translateY(-3px); }
        75%      { transform: translateY(2px); }
      }
      .key-fly {
        position: absolute;
        pointer-events: none;
        width: 36px; height: 36px;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-family: Georgia, serif; font-size: 13px; font-weight: 700;
        color: #faecc0;
        background: radial-gradient(circle at 42% 28%, #f8d880 0%, #c88030 30%, #7a4010 65%, #3a1800 100%);
        border: 2px solid #2a1000;
        box-shadow: 0 4px 0 #1c0800, 0 6px 12px rgba(0,0,0,0.55),
                    inset 0 2px 4px rgba(250,210,100,0.6),
                    inset 0 -2px 4px rgba(0,0,0,0.35);
        animation: keyFly 0.52s ease-out forwards;
        z-index: 30;
      }
      .paper-jitter { animation: paperJitter 0.18s ease-in-out; }
      @media (max-width: 640px) {
        .paper-textarea { min-height: 200px !important; }
        .title-break { display: block; }
      }
    `}</style>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div className="park-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <NavMenu />

          {/* Title */}
          <div style={{ textAlign: 'center', padding: '20px 32px 28px', flexShrink: 0 }}>
            <h1 className="submit-hero-title" style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 40, fontWeight: 700, color: '#fff',
              textShadow: '0 2px 12px rgba(0,0,0,0.3)', marginBottom: 8,
            }}>說說看 <span className="title-break">什麼讓你一直都覺得很煩？</span></h1>
            <p className="submit-hero-sub" style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 15, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7,
            }}>
              生活中某件重複讓你覺得麻煩的事？人與人之間讓你覺得累的事？某個 App 或工具讓你用得很崩潰？
            </p>
          </div>

          {/* Typewriter + paper zone */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            position: 'relative', width: '100%',
          }}>

            {/* ENTER key — bottom right near typewriter */}
            <div className="tw-enter-wrap" style={{
              position: 'absolute',
              right: 'calc(50% - 340px)',
              bottom: 'calc(var(--footer-h) + 8px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 6, zIndex: 20,
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
            <div className="tw-assembly" style={{ maxWidth: 560, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

              {/* Paper — z-index 4 so it's above the typewriter image */}
              <div
                ref={paperRef}
                className={paperShake ? 'paper-jitter' : ''}
                style={{
                  width: 360,
                  backgroundColor: 'var(--paper-bg)',
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 27px, rgba(160,148,128,0.16) 28px)',
                  border: '1px solid rgba(220,210,190,0.6)',
                  boxShadow: '2px 0 6px -2px rgba(0,0,0,0.08), -2px 0 6px -2px rgba(0,0,0,0.08), 0 -2px 4px rgba(0,0,0,0.05)',
                  padding: '16px 28px 20px',
                  position: 'relative', zIndex: 4,
                  marginBottom: -160,
              }}>
                <div style={{
                  position: 'absolute', left: 44, top: 0, bottom: 0,
                  width: 1, background: 'rgba(220,160,160,0.25)',
                  pointerEvents: 'none',
                }} />
                {/* Textarea — z-index 5, always on top */}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="在這裡開始打字..."
                  className="paper-textarea"
                  style={{
                    width: '100%', minHeight: 100,
                    background: 'transparent', border: 'none', outline: 'none',
                    resize: 'none',
                    fontFamily: 'var(--font-sans)', fontSize: 15,
                    color: '#3a2a1e', lineHeight: '28px', paddingLeft: 6,
                    position: 'relative', zIndex: 5,
                  }}
                />
              </div>

              {/* Flying key caps layer — sits between paper and typewriter */}
              <div style={{ position: 'relative', width: 560, height: 0, zIndex: 6 }}>
                {flyKeys.map(({ key, id, x }) => (
                  <div
                    key={id}
                    className="key-fly"
                    style={{ '--kx': `${x}px`, left: '50%', marginLeft: -18, top: -20 } as React.CSSProperties}
                  >
                    {key}
                  </div>
                ))}
              </div>

              {/* Typewriter image — pointer-events none so it never blocks the paper */}
              <Image
                src={TypewriterImage}
                alt="打字機"
                width={560}
                height={560}
                priority
                placeholder="blur"
                style={{
                  position: 'relative', zIndex: 3,
                  filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.5))',
                  pointerEvents: 'none',
                }}
              />
            </div>
          </div>

          {wfFooter}
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div className="park-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <NavMenu />

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div
              className="paper-lined paper-shadow paper-card-padded"
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
          {stdFooter}
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div className="park-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <NavMenu />

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div
              className="paper-lined paper-shadow paper-card-padded"
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
          {stdFooter}
        </div>
      )}

      {/* ── DONE ── */}
      {step === 'done' && (
        <div className="park-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <NavMenu />

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div
              className="paper-lined paper-shadow paper-card-padded"
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
          {stdFooter}
        </div>
      )}
    </div>
  )
}
