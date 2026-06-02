import Link from 'next/link'
import NavMenu from './components/NavMenu'

export default function LandingPage() {
  return (
    <div className="park-bg" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <NavMenu />

      {/* Main */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{ maxWidth: 896, width: '100%' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>

            {/* Card 1: Submit */}
            <Link href="/submit" style={{ textDecoration: 'none' }}>
              <div className="landing-card" style={{ position: 'relative', opacity: 0.88 }}>
                {/* Tape on card */}
                <div className="tape" style={{
                  position: 'absolute', top: -14, left: '50%',
                  transform: 'translateX(-50%) rotate(-2deg)',
                  width: 97, height: 26, zIndex: 2,
                }} />
                <div className="glass-card" style={{
                  padding: '40px 24px 32px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', textAlign: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 28 }}>✏️</span>
                  <h2 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 32, fontWeight: 700, color: 'var(--brown-mid)',
                  }}>我今天有點煩</h2>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14, color: 'var(--brown-light)',
                    lineHeight: 1.7, letterSpacing: '-0.02em', maxWidth: 260,
                  }}>
                    把不愉快的心事寫下來，<br />
                    或是生活遇到了什麼讓你不便的設計<br />
                    通通丟進盒子裡吧！
                  </p>
                  <div style={{
                    marginTop: 8, background: 'var(--orange-cta)', color: '#fff',
                    padding: '8px 24px', borderRadius: 4,
                    fontFamily: 'var(--font-sans)', fontSize: 14, letterSpacing: '0.05em',
                  }}>開始書寫</div>
                </div>
              </div>
            </Link>

            {/* Card 2: Browse */}
            <Link href="/browse" style={{ textDecoration: 'none' }}>
              <div className="landing-card landing-card-rotated" style={{ position: 'relative', opacity: 0.88 }}>
                {/* Tape on card */}
                <div className="tape" style={{
                  position: 'absolute', top: -14, left: '50%',
                  transform: 'translateX(-50%) rotate(2deg)',
                  width: 84, height: 26, zIndex: 2,
                }} />
                <div className="glass-card" style={{
                  padding: '40px 24px 32px',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', textAlign: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 28 }}>📖</span>
                  <h2 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 32, fontWeight: 700, color: 'var(--brown-mid)',
                  }}>看看大家在煩什麼</h2>
                  <p style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 14, color: 'var(--brown-light)',
                    lineHeight: 1.7, letterSpacing: '-0.02em',
                  }}>翻閱那些被留下的隻字片語</p>
                  <div style={{
                    marginTop: 8, background: 'var(--brown-mid)', color: '#fff',
                    padding: '8px 24px', borderRadius: 4,
                    fontFamily: 'var(--font-sans)', fontSize: 14, letterSpacing: '0.05em',
                  }}>隨機翻閱</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Anonymity note */}
          <div style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              backdropFilter: 'blur(6px)',
              background: 'rgba(233,226,211,0.8)',
              border: '1px solid rgba(220,193,177,0.3)',
              borderRadius: 8,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
              padding: '25px 33px', textAlign: 'center', maxWidth: 576,
            }}>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 16, color: '#696458',
                letterSpacing: '-0.02em', lineHeight: 1.7,
              }}>
                這裡是匿名的。你說的話會留在這裡，<br />
                也許有人懂你，甚至是幫你解決問題。
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="white-footer">
        <div className="wf-links">
          <span className="wf-link">隱私權政策</span>
          <span className="wf-link">匿名條款</span>
          <span className="wf-link">聯繫我們</span>
        </div>
        <div className="wf-copy">© 煩惱盒子 | 匿名傾訴空間 | 痛點靈感</div>
      </footer>
    </div>
  )
}
