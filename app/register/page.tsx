'use client'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres'); return }
    setError(''); setLoading(true)
    const { error: err } = await authClient.signUp.email({ email, password, name })
    if (err) { setError(err.message ?? 'Error al registrarse'); setLoading(false); return }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen">
      {/* Columna izquierda — formulario */}
      <div className="flex w-full flex-col px-8 py-10 lg:w-1/2 lg:px-16 xl:px-24">
        {/* Logo */}
        <div className="mb-auto">
          <span className="text-sm font-light tracking-[0.2em] text-foreground" style={{ fontFamily: 'Georgia, serif' }}>
            Financial Fantasy
          </span>
        </div>

        {/* Formulario centrado verticalmente */}
        <div className="flex flex-1 flex-col justify-center py-12 max-w-sm mx-auto w-full">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-2">
            Bienvenido
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Crea tu cuenta y empieza a competir en ligas privadas.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Nombre</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Tu nombre" required
                className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Contraseña</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres" required
                className="h-11 w-full rounded-lg border border-border bg-background px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="h-11 w-full rounded-lg bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-50 mt-1">
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold text-foreground hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="mt-auto" />
      </div>

      {/* Columna derecha — imagen */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center relative overflow-hidden border-l border-border">
        {/* Placeholder — aquí irá tu imagen */}
        <div className="flex flex-col items-center gap-4 text-center px-12">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl">📈</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Aquí irá tu imagen. Súbela a <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">public/auth-image.jpg</code> y te digo cómo mostrarla.
          </p>
        </div>
      </div>
    </div>
  )
}
