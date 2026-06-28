'use client'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    const { error: err } = await authClient.signIn.email({ email, password })
    if (err) { setError(err.message ?? 'Error al iniciar sesión'); setLoading(false); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#ffffff',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="Financial Fantasy League" style={{ height: '32px', display: 'block' }} />
        </a>
        <p style={{ fontSize: '13px', color: '#888' }}>
          ¿No tienes cuenta?{' '}
          <a href="/register" style={{ color: '#0a0a0a', fontWeight: 600, textDecoration: 'none' }}>
            Regístrate gratis
          </a>
        </p>
      </nav>

      {/* Contenido */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Logo Amazon — fondo izquierda */}
        <div style={{
          position: 'absolute', top: '-20px', left: '-60px',
          width: '300px', opacity: 0.5,
          transform: 'rotate(-8deg)',
          pointerEvents: 'none', zIndex: 0,
        }}>
          <img src="/amazon-3d.png" alt="" style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Logo Broadcom — fondo derecha */}
        <div style={{
          position: 'absolute', bottom: '20px', right: '-40px',
          width: '260px', opacity: 0.45,
          transform: 'rotate(8deg)',
          pointerEvents: 'none', zIndex: 0,
        }}>
          <img src="/broadcom-3d.png" alt="" style={{ width: '100%', display: 'block' }} />
        </div>

        {/* Card formulario */}
        <div style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: '420px',
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '28px', padding: '40px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)',
          border: '1px solid rgba(255,255,255,0.7)',
        }}>
          {/* Logo centrado */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img src="/logo.png" alt="Financial Fantasy League" style={{ height: '36px', margin: '0 auto', display: 'block' }} />
          </div>

          <h1 style={{
            fontSize: '26px', fontWeight: 900, color: '#0a0a0a',
            letterSpacing: '-0.03em', margin: '0 0 6px', textAlign: 'center',
          }}>
            Bienvenido de nuevo
          </h1>
          <p style={{ fontSize: '14px', color: '#888', textAlign: 'center', marginBottom: '28px' }}>
            Introduce tus datos para acceder a tu liga
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '6px' }}>
                Email
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                style={{
                  width: '100%', height: '44px', borderRadius: '12px',
                  border: '1px solid #e8e8e8', background: 'rgba(255,255,255,0.8)',
                  padding: '0 14px', fontSize: '14px', color: '#0a0a0a',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0a0a0a', marginBottom: '6px' }}>
                Contraseña
              </label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                style={{
                  width: '100%', height: '44px', borderRadius: '12px',
                  border: '1px solid #e8e8e8', background: 'rgba(255,255,255,0.8)',
                  padding: '0 14px', fontSize: '14px', color: '#0a0a0a',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '10px', padding: '10px 14px',
                fontSize: '13px', color: '#dc2626',
              }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              height: '44px', borderRadius: '12px',
              background: '#0a0a0a', color: '#fff', border: 'none',
              fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1, marginTop: '4px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
            }}>
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '20px' }}>
            ¿No tienes cuenta?{' '}
            <a href="/register" style={{ color: '#ff6b35', fontWeight: 700, textDecoration: 'none' }}>
              Regístrate gratis
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
