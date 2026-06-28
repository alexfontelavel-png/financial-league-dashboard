export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', background: '#111', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
              <polyline points="16 7 22 7 22 13"/>
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0a0a0a', letterSpacing: '-0.01em' }}>
            Financial Fantasy League
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/login" style={{
            padding: '8px 18px', borderRadius: '100px',
            border: '1px solid #e0e0e0', background: 'transparent',
            fontSize: '14px', fontWeight: 500, color: '#0a0a0a',
            textDecoration: 'none',
          }}>
            Sign in
          </a>
          <a href="/register" style={{
            padding: '8px 18px', borderRadius: '100px',
            background: '#0a0a0a', border: '1px solid #0a0a0a',
            fontSize: '14px', fontWeight: 600, color: '#ffffff',
            textDecoration: 'none',
          }}>
            Sign up
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: '140px', paddingBottom: '80px',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#f5f5f5', borderRadius: '100px',
          padding: '6px 14px', marginBottom: '28px',
          fontSize: '12px', fontWeight: 600, color: '#555',
          letterSpacing: '0.02em',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff6b35', display: 'inline-block' }} />
          Real stock prices · Powered by Polygon.io
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 80px)',
          fontWeight: 900, color: '#0a0a0a',
          lineHeight: 1.05, letterSpacing: '-0.04em',
          margin: '0 auto 24px', maxWidth: '800px', padding: '0 24px',
        }}>
          Research, choose and<br />
          <span style={{ color: '#ff6b35' }}>create the best portfolio</span><br />
          among your peers.
        </h1>

        <p style={{
          fontSize: '18px', fontWeight: 400, color: '#666',
          maxWidth: '480px', margin: '0 auto 40px',
          lineHeight: 1.6, padding: '0 24px',
        }}>
          Compite en ligas privadas con dinero virtual y precios reales de bolsa. El mejor portfolio gana el bote.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', padding: '0 24px' }}>
          <a href="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 28px', borderRadius: '100px',
            background: '#0a0a0a', color: '#fff',
            fontSize: '15px', fontWeight: 700,
            textDecoration: 'none', letterSpacing: '-0.01em',
          }}>
            Empieza gratis →
          </a>
          <a href="/login" style={{
            display: 'inline-flex', alignItems: 'center',
            padding: '14px 28px', borderRadius: '100px',
            border: '1px solid #e0e0e0', background: '#fff',
            color: '#0a0a0a', fontSize: '15px', fontWeight: 600,
            textDecoration: 'none',
          }}>
            Iniciar sesión
          </a>
        </div>
      </section>

      {/* iPhone Mockups */}
      <section style={{
        padding: '20px 24px 100px',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
        gap: '24px', flexWrap: 'wrap',
      }}>
        {[
          { img: '/screenshots/screen1.png', label: 'Tu portfolio en tiempo real', offset: '40px' },
          { img: '/screenshots/screen2.png', label: 'Crypto Boost & features premium', offset: '0px' },
          { img: '/screenshots/screen3.png', label: 'Markets: gainers & losers del día', offset: '60px' },
        ].map((item, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
            marginTop: item.offset,
          }}>
            <div style={{
              width: '260px', height: '530px',
              background: '#0a0a0a', borderRadius: '44px', padding: '12px',
              boxShadow: '0 40px 80px rgba(0,0,0,0.18)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
                width: '80px', height: '24px', background: '#0a0a0a',
                borderRadius: '12px', zIndex: 10,
              }} />
              <div style={{
                width: '100%', height: '100%',
                borderRadius: '36px', overflow: 'hidden',
                background: i === 0 ? '#f7f7fb' : i === 1 ? '#fff8f5' : '#f5f5f5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <img
                  src={item.img}
                  alt={item.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#888', fontWeight: 500, textAlign: 'center', maxWidth: '200px' }}>
              {item.label}
            </p>
          </div>
        ))}
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px', background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900,
            color: '#0a0a0a', textAlign: 'center', letterSpacing: '-0.03em', marginBottom: '60px',
          }}>
            Todo lo que necesitas para competir
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { icon: '📈', title: 'Precios reales', desc: 'Datos de S&P500, NASDAQ y EUROSTOXX actualizados vía Polygon.io.' },
              { icon: '🏆', title: 'Ligas privadas', desc: 'Crea ligas con tus amigos, paga la entrada y compite por el bote.' },
              { icon: '⚡', title: 'Crypto Boost', desc: 'Añade exposición a crypto para incrementar la volatilidad de tu portfolio.' },
              { icon: '🔥', title: 'Degen Trades', desc: 'Apalanca tus posiciones 2x o 3x si tienes convicción en un movimiento.' },
              { icon: '🤖', title: 'AI Financial Agent', desc: 'Pregunta al agente qué acciones pueden subir y recibe análisis en tiempo real.' },
              { icon: '💸', title: '€10.000 virtuales', desc: 'Empieza con €10.000 de capital virtual y construye el mejor portfolio.' },
            ].map((f, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: '20px', padding: '28px',
                border: '1px solid #f0f0f0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{f.icon}</div>
                <p style={{ fontSize: '16px', fontWeight: 800, color: '#0a0a0a', marginBottom: '8px', letterSpacing: '-0.01em' }}>{f.title}</p>
                <p style={{ fontSize: '14px', color: '#666', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding: '100px 24px', textAlign: 'center', background: '#0a0a0a' }}>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900,
          color: '#fff', letterSpacing: '-0.03em', marginBottom: '16px',
        }}>
          ¿Listo para competir?
        </h2>
        <p style={{ fontSize: '16px', color: '#888', marginBottom: '36px' }}>
          Únete gratis y demuestra que eres el mejor trader de tu liga.
        </p>
        <a href="/register" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '16px 36px', borderRadius: '100px',
          background: '#ff6b35', color: '#fff',
          fontSize: '16px', fontWeight: 700, textDecoration: 'none',
        }}>
          Crear cuenta gratis →
        </a>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '24px 40px', borderTop: '1px solid #1a1a1a', background: '#0a0a0a',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px',
      }}>
        <span style={{ fontSize: '13px', color: '#555', fontWeight: 600 }}>Financial Fantasy League</span>
        <span style={{ fontSize: '12px', color: '#444' }}>© 2026 · Datos vía Polygon.io · Solo para fines de entretenimiento</span>
      </footer>
    </div>
  )
}
