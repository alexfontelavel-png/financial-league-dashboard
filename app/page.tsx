'use client'
import { useEffect, useRef } from 'react'

const features = [
  { img: '/precios reales.png', title: 'Precios reales', desc: 'Datos de S&P500, NASDAQ y EUROSTOXX actualizados vía Polygon.io.' },
  { img: '/ligas privadas.png', title: 'Ligas privadas', desc: 'Crea ligas con tus amigos, paga la entrada y compite por el bote.' },
  { img: '/bitcoin.png', title: 'Crypto Boost', desc: 'Añade exposición a crypto para incrementar la volatilidad de tu portfolio.' },
  { img: '/degen.png', title: 'Degen Trades', desc: 'Apalanca tus posiciones 2x o 3x si tienes convicción en un movimiento.' },
  { img: '/gemini.png', title: 'AI Financial Agent', desc: 'Pregunta al agente qué acciones pueden subir y recibe análisis en tiempo real.' },
  { img: '/dinero virtual.png', title: '€10.000 virtuales', desc: 'Empieza con €10.000 de capital virtual y construye el mejor portfolio.' },
]

function FeatureCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let animId: number
    let pos = 0
    const speed = 0.5
    const cardWidth = 300 + 16 // card width + gap
    const totalWidth = cardWidth * features.length

    function animate() {
      pos += speed
      if (pos >= totalWidth) pos = 0
      if (track) track.style.transform = `translateX(-${pos}px)`
      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    // Pausar al hover
    const pause = () => cancelAnimationFrame(animId)
    const resume = () => { animId = requestAnimationFrame(animate) }
    track.addEventListener('mouseenter', pause)
    track.addEventListener('mouseleave', resume)

    return () => {
      cancelAnimationFrame(animId)
      track.removeEventListener('mouseenter', pause)
      track.removeEventListener('mouseleave', resume)
    }
  }, [])

  // Duplicar para loop infinito
  const doubled = [...features, ...features]

  return (
    <div style={{ overflow: 'hidden', width: '100%', padding: '8px 0' }}>
      <div ref={trackRef} style={{
        display: 'flex', gap: '16px',
        width: 'max-content',
        willChange: 'transform',
      }}>
        {doubled.map((f, i) => (
          <div key={i} style={{
            width: '300px', flexShrink: 0,
            background: '#ffffff', borderRadius: '20px', padding: '28px 24px',
            border: '1px solid #ebebeb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.04)',
            display: 'flex', flexDirection: 'column', gap: '16px',
          }}>
           <div style={{ width: '64px', height: '64px', flexShrink: 0 }}>
              <img src={f.img} alt={f.title} style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#0a0a0a', marginBottom: '6px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>{f.title}</p>
              <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

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
        <img src="/logo.png" alt="Financial Fantasy League" style={{ height: '32px', display: 'block' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/login" style={{
            padding: '8px 18px', borderRadius: '100px',
            border: '1px solid #e0e0e0', background: 'transparent',
            fontSize: '14px', fontWeight: 500, color: '#0a0a0a', textDecoration: 'none',
          }}>Sign in</a>
          <a href="/register" style={{
            padding: '8px 18px', borderRadius: '100px',
            background: '#0a0a0a', border: '1px solid #0a0a0a',
            fontSize: '14px', fontWeight: 600, color: '#ffffff', textDecoration: 'none',
          }}>Sign up</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        paddingTop: '120px', paddingBottom: '60px',
        textAlign: 'center', position: 'relative',
        overflow: 'hidden', minHeight: '720px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          position: 'absolute', top: '50px', left: '-40px',
          width: '360px', opacity: 1, transform: 'rotate(-6deg)',
          pointerEvents: 'none', zIndex: 0,
        }}>
          <img src="/amazon-3d.png" alt="" style={{ width: '100%', display: 'block' }} />
        </div>
        <div style={{
          position: 'absolute', top: '260px', right: '-40px',
          width: '320px', opacity: 1, transform: 'rotate(6deg)',
          pointerEvents: 'none', zIndex: 0,
        }}>
          <img src="/broadcom-3d.png" alt="" style={{ width: '100%', display: 'block' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(245,245,245,0.9)', backdropFilter: 'blur(8px)',
            borderRadius: '100px', padding: '6px 14px', marginBottom: '16px',
            fontSize: '12px', fontWeight: 600, color: '#555',
            border: '1px solid rgba(0,0,0,0.06)',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff6b35', display: 'inline-block' }} />
            Real stock prices · Powered by Polygon.io
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.65)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '32px', padding: '44px 56px 40px', margin: '0 24px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
            border: '1px solid rgba(255,255,255,0.7)',
            maxWidth: '780px', width: '100%',
          }}>
            <h1 style={{
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 900, color: '#0a0a0a',
              lineHeight: 1.05, letterSpacing: '-0.04em', margin: '0 0 16px',
            }}>
              Descubre, elige y crea<br />
              <span style={{ color: '#ff6b35' }}>el mejor portfolio</span><br />
              entre tus competidores.
            </h1>
            <p style={{ fontSize: '17px', color: '#666', maxWidth: '400px', margin: '0 auto', lineHeight: 1.65 }}>
              Compite en ligas privadas con dinero virtual y precios reales de bolsa. El mejor portfolio gana el bote.
            </p>
          </div>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', flexWrap: 'wrap', padding: '0 24px',
            marginTop: '32px', marginBottom: '80px',
          }}>
            <a href="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '100px',
              background: '#0a0a0a', color: '#fff',
              fontSize: '15px', fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}>Empieza gratis →</a>
            <a href="/login" style={{
              display: 'inline-flex', alignItems: 'center',
              padding: '14px 28px', borderRadius: '100px',
              border: '1px solid #e0e0e0', background: 'rgba(255,255,255,0.95)',
              color: '#0a0a0a', fontSize: '15px', fontWeight: 600,
              textDecoration: 'none', boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            }}>Iniciar sesión</a>
          </div>

          <div style={{
            maxWidth: '1100px', margin: '0 auto', padding: '0 24px',
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px', alignItems: 'start', width: '100%',
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
                  <img src={item.img} alt={item.label}
                    style={{ width: '100%', display: 'block', objectFit: 'cover', objectPosition: 'top', maxHeight: '320px' }} />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', marginBottom: '4px', textAlign: 'left' }}>{item.label}</p>
                <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.5, textAlign: 'left' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features carrusel */}
      <section style={{ padding: '100px 0', background: '#ffffff', borderTop: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 24px' }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900,
            color: '#0a0a0a', textAlign: 'center', letterSpacing: '-0.03em',
            marginBottom: '64px', lineHeight: 1.05,
          }}>
            Todo lo que necesitas<br />para competir
          </h2>
        </div>
        {/* Fade edges */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '120px', zIndex: 2,
            background: 'linear-gradient(to right, #ffffff, transparent)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '120px', zIndex: 2,
            background: 'linear-gradient(to left, #ffffff, transparent)',
            pointerEvents: 'none',
          }} />
          <FeatureCarousel />
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
