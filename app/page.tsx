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
          }}>Sign in</a>
          <a href="/register" style={{
            padding: '8px 18px', borderRadius: '100px',
            background: '#0a0a0a', border: '1px solid #0a0a0a',
            fontSize: '14px', fontWeight: 600, color: '#ffffff',
            textDecoration: 'none',
          }}>Sign up</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: '140px', paddingBottom: '60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '720px',
      }}>
        {/* Logo Amazon — izquierda */}
        <div style={{
          position: 'absolute',
          top: '50px',
          left: '-40px',
          width: '360px',
          opacity: 1,
          transform: 'rotate(-6deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <img src="/amazon-3d.png" alt="" style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Logo Broadcom — derecha y más abajo */}
        <div style={{
          position: 'absolute',
          top: '260px',
          right: '-40px',
          width: '320px',
          opacity: 1,
          transform: 'rotate(6deg)',
          pointerEvents: 'none',
          zIndex: 0,
        }}>
          <img src="/broadcom-3d.png" alt="" style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Contenido en primer plano */}
        <div style={{ position: 'relative', zIndex: 2 }}>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#f5f5f5', borderRadius: '100px',
            padding: '6px 14px', marginBottom: '28px',
            fontSize: '12px', fontWeight: 600, color: '#555',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff6b35', display: 'inline-block' }} />
            Real stock prices · Powered by Polygon.io
          </div>

          {/* Título flotante con profundidad */}
          <h1 style={{
            fontSize: 'clamp(38px, 5.5vw, 76px)',
            fontWeight: 900, color: '#0a0a0a',
            lineHeight: 1.05, letterSpacing: '-0.04em',
            margin: '0 auto 24px', maxWidth: '820px', padding: '0 24px',
            textShadow: `
              0 1px 0 rgba(255,255,255,1),
              0 2px 0 rgba(255,255,255,0.9),
              0 4px 8px rgba(255,255,255,1),
              0 8px 24px rgba(255,255,255,0.95),
              0 16px 48px rgba(255,255,255,0.8),
              2px 2px 0 rgba(255,255,255,0.6),
              -2px -2px 0 rgba(255,255,255,0.6)
            `,
            filter: 'drop-shadow(0 4px 32px rgba(255,255,255,1)) drop-shadow(0 0 60px rgba(255,255,255,0.95))',
          }}>
            Research, choose and<br />
            <span style={{
              color: '#ff6b35',
              textShadow: `
                0 1px 0 rgba(255,255,255,1),
                0 2px 0 rgba(255,255,255,0.9),
                0 4px 8px rgba(255,255,255,1),
                0 8px 24px rgba(255,255,255,0.95),
                0 16px 48px rgba(255,255,255,0.8)
              `,
              filter: 'drop-shadow(0 4px 32px rgba(255,255,255,1))',
            }}>create the best portfolio</span><br />
            among your peers.
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: '18px', color: '#555',
            maxWidth: '460px', margin: '0 auto 40px',
            lineHeight: 1.65, padding: '0 24px',
            textShadow: '0 2px 16px rgba(255,255,255,1), 0 0 32px rgba(255,255,255,1)',
          }}>
            Compite en ligas privadas con dinero virtual y precios reales de bolsa. El mejor portfolio gana el bote.
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', flexWrap: 'wrap', padding: '0 24px', marginBottom: '80px',
          }}>
            <a href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '100px',
              background: '#0a0a0a', color: '#fff',
              fontSize: '15px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.12)',
            }}>Empieza gratis →</a>
            <a href="/login" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '14px 28px', borderRadius: '100px',
              border: '1px solid #e0e0e0',
              background: 'rgba(255,255,255,0.95)',
              color: '#0a0a0a', fontSize: '15px', fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              backdropFilter: 'blur(8px)',
            }}>Iniciar sesión</a>
          </div>

          {/* Screenshot cards */}
          <div style={{
            maxWidth: '1100px', margin: '0 auto',
            padding: '0 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            alignItems: 'start',
          }}>
            {[
              { img: '/screen1.png', label: 'Tu portfolio en tiempo real', desc: 'Consulta tu valor total, cash disponible y posiciones abiertas.', offset: '0px', accent: '#f0fdf4' },
              { img: '/screen2.png', label: 'Crypto Boost & features premium', desc: 'Añade exposición a crypto y apalanca tus mejores trades.', offset: '32px', accent: '#fff8f5' },
              { img: '/screen3.png', label: 'Markets en tiempo real', desc: 'Daily gainers y losers con precios reales del mercado.', offset: '16px', accent: '#f5f5ff' },
            ].map((item, i) => (
              <div key={i} style={{ marginTop: item.offset }}>
                <div style={{
                  borderRadius: '20px', overflow: 'hidden',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  background: item.accent, marginBottom: '16px',
                }}>
                  <div style={{
                    padding: '10px 14px', background: '#f8f8f8',
                    borderBottom: '1px solid #ebebeb',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f57' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28c840' }} />
                    <div style={{ flex: 1, margin: '0 8px', background: '#ebebeb', borderRadius: '4px', height: '16px' }} />
                  </div>
                  <img
                    src={item.img}
                    alt={item.label}
                    style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top', maxHeight: '320px' }}
                  />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', marginBottom: '4px', textAlign: 'left' }}>{item.label}</p>
                <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.5, textAlign: 'left' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '100px 24px', background: '#fafafa', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900,
            color: '#0a0a0a', textAlign: 'center', letterSpacing: '-0.03em', marginBottom: '60px',
          }}>
            Todo lo que necesitas para competir
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
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
