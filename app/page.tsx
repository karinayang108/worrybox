import Link from 'next/link'
import NavMenu from './components/NavMenu'

export default function LandingPage() {
  return (
    <div className="park-bg landing-outer" style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <NavMenu />

      {/* Main */}
      <main className="landing-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
        <div style={{ maxWidth: 896, width: '100%' }}>

          <div className="landing-grid">

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
                fontSize: 13, color: '#a89880', letterSpacing: '0.04em',
                marginBottom: 12, textTransform: 'uppercase',
              }}>
                不用擔心，這裡是匿名的
              </p>
              <style>{`@media (min-width: 640px) { .m-br { display: none; } }`}</style>
              <p style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 15, color: '#696458',
                letterSpacing: '-0.02em', lineHeight: 1.85,
              }}>
                煩惱盒子收集真實的日常不滿——<br className="m-br" />
                來自每個不想大聲說、<br className="m-br" />但忍不住想說的人。<br />
                <br />
                如果你只是想說說，這裡有人聽。<br />
                如果你想解決問題，<br className="m-br" />
                這裡是最誠實的靈感來源。
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="white-footer">
        <div className="wf-copy">© 煩惱盒子 | Pain points collection</div>
      </footer>
    </div>
  )
}
