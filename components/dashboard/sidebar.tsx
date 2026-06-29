'use client'
import {
  LayoutGrid, TrendingUp, Trophy, Wallet, Users,
  Settings, LifeBuoy, CandlestickChart, Check, X,
  TrendingDown, Send, Zap, Flame, Search, Plus, Minus,
} from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { CRYPTO_LOGOS } from '@/lib/crypto-logos'

const nav = [
  { label: 'Dashboard', icon: LayoutGrid },
  { label: 'Markets', icon: TrendingUp },
  { label: 'Portfolio', icon: Wallet },
  { label: 'Leagues', icon: Trophy },
  { label: 'Players', icon: Users },
  { label: 'Crypto', icon: Zap },
  { label: 'Degen Trade', icon: Flame },
]

const bottomNav = [
  { label: 'Settings', icon: Settings },
  { label: 'Support', icon: LifeBuoy },
]

const LEAGUES = [
  {
    id: 1,
    name: '2026 League',
    features: [
      'Trading available SP500 + NASDAQ + EUROSTOXX',
      'Cuota de entrada 50€',
      'Duración 60 días',
    ],
    spots: { taken: 36, total: 70 },
    prize: 1700,
    joined: false,
  },
]

const TICKER_DOMAINS: Record<string, string> = {
  AAPL: 'apple.com', MSFT: 'microsoft.com', GOOGL: 'google.com',
  GOOG: 'google.com', AMZN: 'amazon.com', META: 'meta.com',
  TSLA: 'tesla.com', NVDA: 'nvidia.com', AMD: 'amd.com',
  NFLX: 'netflix.com', PYPL: 'paypal.com', INTC: 'intel.com',
  UBER: 'uber.com', SPOT: 'spotify.com', SHOP: 'shopify.com',
  COIN: 'coinbase.com', PLTR: 'palantir.com', SNAP: 'snap.com',
  BABA: 'alibaba.com', DIS: 'disney.com', BA: 'boeing.com',
  JPM: 'jpmorganchase.com', V: 'visa.com', MA: 'mastercard.com',
  WMT: 'walmart.com', JNJ: 'jnj.com', PG: 'pg.com',
  KO: 'coca-cola.com', PEP: 'pepsico.com', MCD: 'mcdonalds.com',
  SBUX: 'starbucks.com', NKE: 'nike.com', ADBE: 'adobe.com',
  CRM: 'salesforce.com', ORCL: 'oracle.com', IBM: 'ibm.com',
  QCOM: 'qualcomm.com', TXN: 'ti.com', AVGO: 'broadcom.com',
  ARM: 'arm.com', RIVN: 'rivian.com', ABNB: 'airbnb.com',
  LYFT: 'lyft.com', HOOD: 'robinhood.com', SOFI: 'sofi.com',
  RBLX: 'roblox.com', TWLO: 'twilio.com', ZM: 'zoom.us',
  NET: 'cloudflare.com', SNOW: 'snowflake.com', DDOG: 'datadoghq.com',
  MDB: 'mongodb.com', DOCN: 'digitalocean.com', AMGN: 'amgen.com',
  GILD: 'gilead.com', BMY: 'bms.com', PFE: 'pfizer.com',
  MRNA: 'modernatx.com', LLY: 'lilly.com', UNH: 'unitedhealthgroup.com',
  GS: 'goldmansachs.com', MS: 'morganstanley.com', BAC: 'bankofamerica.com',
  WFC: 'wellsfargo.com', C: 'citi.com', XOM: 'exxonmobil.com',
  CVX: 'chevron.com', CSCO: 'cisco.com', AMAT: 'appliedmaterials.com',
}

function PositionLogo({ ticker }: { ticker: string }) {
  const [imgError, setImgError] = useState(false)
  const upper      = ticker.toUpperCase()
  const cryptoLogo = CRYPTO_LOGOS[upper]
  const domain     = TICKER_DOMAINS[upper]
  const logoUrl    = cryptoLogo ?? (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null)

  if (!imgError && logoUrl) {
    return (
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: '#fff', border: '1px solid #f0f0f0',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, overflow: 'hidden',
      }}>
        <img src={logoUrl} alt={ticker}
          style={{ width: '28px', height: '28px', objectFit: 'contain' }}
          onError={() => setImgError(true)} />
      </div>
    )
  }

  return (
    <div style={{
      width: '40px', height: '40px', borderRadius: '10px',
      background: '#f5f5f5', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '12px', fontWeight: 700, color: '#0a0a0a',
    }}>
      {ticker.slice(0, 2)}
    </div>
  )
}

function useEscapeKey(onClose: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])
}

function LeaguesPanel({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose)
  const [view, setView] = useState<'menu' | 'create' | 'search'>('menu')

  // --- Create state ---
  const [form, setForm] = useState({ name: '', max_participants: '', entry_fee: '', duration_days: '' })
  const [creating, setCreating] = useState(false)
  const [createResult, setCreateResult] = useState<{ ok: boolean; msg: string } | null>(null)

  // --- Search state ---
  const [searchName, setSearchName] = useState('')
  const [searching, setSearching]   = useState(false)
  const [leagueData, setLeagueData] = useState<{
    league: { id: string; name: string; max_participants: number; entry_fee: number; duration_days: number; end_date: string; created_by: string }
    members: { user_id: string; username: string; roi_pct: number; total_value: number; joined_at: string }[]
  } | null>(null)
  const [searchError, setSearchError] = useState('')
  const [joining, setJoining]         = useState(false)
  const [joinMsg, setJoinMsg]         = useState('')

  const endDatePreview = form.duration_days
    ? new Date(Date.now() + parseInt(form.duration_days) * 86400000).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  async function handleCreate() {
    if (!form.name || !form.max_participants || !form.entry_fee || !form.duration_days) return
    setCreating(true); setCreateResult(null)
    try {
      const res = await fetch('/api/leagues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setCreateResult({ ok: true, msg: `✓ Liga "${data.league.name}" creada. ¡Comparte el nombre para que otros se unan!` })
        setForm({ name: '', max_participants: '', entry_fee: '', duration_days: '' })
      } else {
        setCreateResult({ ok: false, msg: data.error ?? 'Error desconocido' })
      }
    } catch {
      setCreateResult({ ok: false, msg: 'Error de red.' })
    }
    setCreating(false)
  }

  async function handleSearch() {
    if (!searchName.trim()) return
    setSearching(true); setLeagueData(null); setSearchError(''); setJoinMsg('')
    try {
      const res = await fetch(`/api/leagues?name=${encodeURIComponent(searchName.trim())}`)
      const data = await res.json()
      if (res.ok) setLeagueData(data)
      else setSearchError(data.error ?? 'Liga no encontrada')
    } catch {
      setSearchError('Error de red.')
    }
    setSearching(false)
  }

  async function handleJoin(league_id: string) {
    setJoining(true); setJoinMsg('')
    try {
      const res = await fetch('/api/leagues/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ league_id }),
      })
      const data = await res.json()
      if (data.success) {
        setJoinMsg('✓ Te has unido a la liga')
        handleSearch()
      } else {
        setJoinMsg(data.error ?? 'Error al unirse')
      }
    } catch {
      setJoinMsg('Error de red.')
    }
    setJoining(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', height: '44px', borderRadius: '12px',
    border: '1px solid #e5e7eb', background: '#fafafa',
    padding: '0 14px', fontSize: '14px', color: '#0a0a0a',
    outline: 'none', boxSizing: 'border-box',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '12px', fontWeight: 600, color: '#6b7280',
    display: 'block', marginBottom: '6px',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm modal-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="modal-content" style={{
        width: '100%', maxWidth: '560px', borderRadius: '24px',
        background: '#ffffff', boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        margin: '0 16px', fontFamily: 'system-ui, -apple-system, sans-serif',
        maxHeight: '90vh', overflowY: 'auto',
      }}>

        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {view !== 'menu' && (
              <button onClick={() => { setView('menu'); setCreateResult(null); setLeagueData(null); setSearchError(''); setJoinMsg('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '18px', lineHeight: 1, padding: '0 4px 0 0' }}>
                ←
              </button>
            )}
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0a0a0a', margin: 0, letterSpacing: '-0.02em' }}>
                {view === 'menu' ? 'Ligas' : view === 'create' ? 'Crear liga' : 'Buscar liga'}
              </h2>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0' }}>
                {view === 'menu' ? 'Crea o únete a una liga' : view === 'create' ? 'Configura tu competición' : 'Encuentra una liga por nombre'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={16} color="#666" />
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>

          {/* MENU */}
          {view === 'menu' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button onClick={() => setView('create')} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px', borderRadius: '16px', border: '1.5px solid #0a0a0a',
                background: '#0a0a0a', cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'opacity 0.15s',
              }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Trophy size={22} color="#fff" />
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: '0 0 2px', letterSpacing: '-0.01em' }}>Crear liga</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Configura las reglas y comparte con tus amigos</p>
                </div>
              </button>

              <button onClick={() => setView('search')} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px', borderRadius: '16px', border: '1.5px solid #e5e7eb',
                background: '#fafafa', cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'all 0.15s',
              }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Search size={22} color="#0a0a0a" />
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 800, color: '#0a0a0a', margin: '0 0 2px', letterSpacing: '-0.01em' }}>Buscar liga</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Encuentra una liga por nombre y únete</p>
                </div>
              </button>
            </div>
          )}

          {/* CREATE */}
          {view === 'create' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {createResult && (
                <div style={{
                  padding: '12px 16px', borderRadius: '12px',
                  background: createResult.ok ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${createResult.ok ? '#bbf7d0' : '#fecaca'}`,
                  fontSize: '13px', color: createResult.ok ? '#16a34a' : '#dc2626',
                }}>
                  {createResult.msg}
                </div>
              )}

              <div>
                <label style={labelStyle}>Nombre de la liga</label>
                <input
                  style={inputStyle} placeholder="ej. Los Cracks 2026"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Participantes máx.</label>
                  <input
                    style={inputStyle} type="number" min={2} placeholder="ej. 10"
                    value={form.max_participants}
                    onChange={e => setForm(f => ({ ...f, max_participants: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Cuota de entrada (€)</label>
                  <input
                    style={inputStyle} type="number" min={0} placeholder="ej. 50"
                    value={form.entry_fee}
                    onChange={e => setForm(f => ({ ...f, entry_fee: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Duración (días)</label>
                <input
                  style={inputStyle} type="number" min={1} placeholder="ej. 60"
                  value={form.duration_days}
                  onChange={e => setForm(f => ({ ...f, duration_days: e.target.value }))}
                />
                {endDatePreview && (
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                    📅 Fecha de fin: <strong style={{ color: '#0a0a0a' }}>{endDatePreview}</strong>
                  </p>
                )}
              </div>

              {/* Preview card */}
              {form.name && form.max_participants && form.entry_fee && form.duration_days && (
                <div style={{ background: '#f8f8f8', borderRadius: '14px', padding: '16px', border: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Vista previa</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Premio estimado</span>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0a0a0a' }}>
                      €{(parseFloat(form.entry_fee || '0') * parseInt(form.max_participants || '0')).toLocaleString('es-ES')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Plazas</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a' }}>{form.max_participants} jugadores</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>Fin de liga</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a' }}>{endDatePreview}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleCreate}
                disabled={creating || !form.name || !form.max_participants || !form.entry_fee || !form.duration_days}
                style={{
                  width: '100%', height: '48px', borderRadius: '14px', border: 'none',
                  background: creating || !form.name || !form.max_participants || !form.entry_fee || !form.duration_days
                    ? '#e5e7eb' : '#0a0a0a',
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                  cursor: creating || !form.name || !form.max_participants || !form.entry_fee || !form.duration_days
                    ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {creating ? 'Creando...' : 'Crear liga'}
              </button>
            </div>
          )}

          {/* SEARCH */}
          {view === 'search' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder="Nombre exacto de la liga..."
                  value={searchName}
                  onChange={e => setSearchName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} disabled={searching || !searchName.trim()} style={{
                  height: '44px', padding: '0 20px', borderRadius: '12px', border: 'none',
                  background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 700,
                  cursor: searching || !searchName.trim() ? 'not-allowed' : 'pointer',
                  flexShrink: 0, opacity: searching || !searchName.trim() ? 0.5 : 1,
                }}>
                  {searching ? '...' : 'Buscar'}
                </button>
              </div>

              {searchError && (
                <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', fontSize: '13px', color: '#dc2626' }}>
                  {searchError}
                </div>
              )}

              {joinMsg && (
                <div style={{
                  padding: '12px 16px', borderRadius: '12px',
                  background: joinMsg.startsWith('✓') ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${joinMsg.startsWith('✓') ? '#bbf7d0' : '#fecaca'}`,
                  fontSize: '13px', color: joinMsg.startsWith('✓') ? '#16a34a' : '#dc2626',
                }}>
                  {joinMsg}
                </div>
              )}

              {leagueData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Liga info */}
                  <div style={{ background: '#0a0a0a', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '18px', fontWeight: 900, color: '#fff', margin: '0 0 2px', letterSpacing: '-0.02em' }}>{leagueData.league.name}</p>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                          {leagueData.members.length}/{leagueData.league.max_participants} jugadores · {leagueData.league.duration_days} días
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 2px' }}>Premio estimado</p>
                        <p style={{ fontSize: '20px', fontWeight: 900, color: '#ff6b35', margin: 0 }}>
                          €{(leagueData.league.entry_fee * leagueData.league.max_participants).toLocaleString('es-ES')}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 2px' }}>Cuota</p>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>€{leagueData.league.entry_fee}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 2px' }}>Fecha fin</p>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>
                          {new Date(leagueData.league.end_date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: '0 0 2px' }}>Días restantes</p>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>
                          {Math.max(0, Math.ceil((new Date(leagueData.league.end_date).getTime() - Date.now()) / 86400000))}d
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleJoin(leagueData.league.id)} disabled={joining} style={{
                      width: '100%', height: '40px', borderRadius: '10px', border: 'none',
                      background: '#ff6b35', color: '#fff', fontSize: '13px', fontWeight: 700,
                      cursor: joining ? 'not-allowed' : 'pointer', opacity: joining ? 0.7 : 1,
                    }}>
                      {joining ? 'Uniéndose...' : `Unirse · €${leagueData.league.entry_fee}`}
                    </button>
                  </div>

                  {/* Ranking */}
                  {leagueData.members.length > 0 && (
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>
                        Ranking · {leagueData.members.length} jugadores
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {leagueData.members.map((m, i) => {
                          const isPos = (m.roi_pct ?? 0) >= 0
                          const medals = ['🥇', '🥈', '🥉']
                          return (
                            <div key={m.user_id} style={{
                              display: 'flex', alignItems: 'center', gap: '12px',
                              padding: '12px 14px', borderRadius: '12px',
                              background: i === 0 ? '#fffbeb' : '#fafafa',
                              border: `1px solid ${i === 0 ? '#fde68a' : '#f0f0f0'}`,
                            }}>
                              <span style={{ fontSize: '16px', width: '24px', textAlign: 'center', flexShrink: 0 }}>
                                {medals[i] ?? `${i + 1}`}
                              </span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a', margin: 0 }}>{m.username}</p>
                                <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>
                                  {(m.total_value ?? 10000).toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 })}
                                </p>
                              </div>
                              <span style={{
                                fontSize: '13px', fontWeight: 800,
                                color: isPos ? '#16a34a' : '#ef4444',
                                background: isPos ? '#f0fdf4' : '#fef2f2',
                                padding: '3px 10px', borderRadius: '100px',
                              }}>
                                {isPos ? '+' : ''}{(m.roi_pct ?? 0).toFixed(2)}%
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {leagueData.members.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>
                      Aún no hay jugadores en esta liga. ¡Sé el primero!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface Mover { ticker: string; price: number; change: number }
interface MoversData { gainers: Mover[]; losers: Mover[] }

function MarketsPanel({ onClose }: { onClose: () => void }) {
  const [data, setData]         = useState<MoversData | null>(null)
  const [loading, setLoading]   = useState(true)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer]     = useState('')
  const [asking, setAsking]     = useState(false)
  useEscapeKey(onClose)

  useEffect(() => {
    fetch('/api/movers').then(r => r.json()).then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  async function handleAsk() {
    if (!question.trim()) return
    setAsking(true); setAnswer('')
    try {
      const res = await fetch('/api/market-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      })
      const data = await res.json()
      setAnswer(data.answer ?? 'No se pudo obtener respuesta.')
    } catch {
      setAnswer('Error conectando con el agente. Inténtalo de nuevo.')
    }
    setAsking(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm modal-backdrop" onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl mx-4 modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Markets</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Mejores y peores del día · Cierre anterior</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="size-5" /></button>
        </div>
        {loading && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />)}
          </div>
        )}
        {!loading && data && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-3"><TrendingUp className="size-4 text-green-500" /><h3 className="text-sm font-semibold text-foreground">Daily Gainers</h3></div>
              <div className="flex flex-col gap-2">
                {data.gainers.map(m => (
                  <div key={m.ticker} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-white border border-border">
                        <img src={`https://www.google.com/s2/favicons?domain=${TICKER_DOMAINS[m.ticker] ?? 'google.com'}&sz=32`} alt={m.ticker} className="size-5 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </div>
                      <div><p className="text-sm font-bold text-foreground">{m.ticker}</p><p className="text-xs text-muted-foreground">${m.price.toFixed(2)}</p></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-green-500">+{m.change.toFixed(2)}%</span>
                      <div className="flex size-5 items-center justify-center rounded-full bg-green-500"><TrendingUp className="size-3 text-white" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3"><TrendingDown className="size-4 text-red-500" /><h3 className="text-sm font-semibold text-foreground">Daily Losers</h3></div>
              <div className="flex flex-col gap-2">
                {data.losers.map(m => (
                  <div key={m.ticker} className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-white border border-border">
                        <img src={`https://www.google.com/s2/favicons?domain=${TICKER_DOMAINS[m.ticker] ?? 'google.com'}&sz=32`} alt={m.ticker} className="size-5 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </div>
                      <div><p className="text-sm font-bold text-foreground">{m.ticker}</p><p className="text-xs text-muted-foreground">${m.price.toFixed(2)}</p></div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-red-500">{m.change.toFixed(2)}%</span>
                      <div className="flex size-5 items-center justify-center rounded-full bg-red-500"><TrendingDown className="size-3 text-white" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-sm font-semibold text-foreground mb-3">Ask Financial Agent to get insights &amp; potential recommendations</p>
          <div className="flex gap-2">
            <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="e.g. ¿Por qué está bajando TSLA? ¿Es buen momento para comprar NVDA?"
              className="flex-1 h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40" />
            <button onClick={handleAsk} disabled={asking || !question.trim()}
              className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40">
              <Send className="size-4" />
            </button>
          </div>
          {asking && <p className="text-xs text-muted-foreground mt-3 animate-pulse">Consultando con Gemini AI...</p>}
          {answer && !asking && (
            <div className="mt-3 rounded-xl bg-muted p-3 max-h-48 overflow-y-auto dropdown-anim">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface CryptoCoin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap_rank: number
}

function CryptoPanel({ onClose }: { onClose: () => void }) {
  useEscapeKey(onClose)
  const [coins, setCoins]         = useState<CryptoCoin[]>([])
  const [loading, setLoading]     = useState(true)
  const [selected, setSelected]   = useState<CryptoCoin | null>(null)
  const [side, setSide]           = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount]       = useState('')
  const [executing, setExecuting] = useState(false)
  const [toast, setToast]         = useState<{ ok: boolean; msg: string } | null>(null)
  const [portfolio, setPortfolio] = useState<{ cash_balance: number } | null>(null)

  useEffect(() => {
    fetch('/api/crypto')
      .then(r => r.json())
      .then(d => { setCoins(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(() => setLoading(false))
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(d => setPortfolio(d))
      .catch(() => {})
  }, [])

  const fmt = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })

  const cryptoShares = selected && parseFloat(amount) > 0
    ? side === 'buy'
      ? parseFloat(amount) / selected.current_price
      : parseFloat(amount)
    : 0

  const eurValue = selected && parseFloat(amount) > 0
    ? side === 'sell'
      ? parseFloat(amount) * selected.current_price
      : parseFloat(amount)
    : 0

  async function executeCrypto() {
    if (!selected || !amount || parseFloat(amount) <= 0) return
    setExecuting(true); setToast(null)
    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: selected.symbol.toUpperCase(),
          type: side,
          shares: cryptoShares,
          price_override: selected.current_price,
          company_name: selected.name,
        }),
      })
      const data = await res.json()
      if (data.success) {
        const msg = side === 'buy'
          ? `✓ Compra: ${cryptoShares.toFixed(6)} ${selected.symbol.toUpperCase()} · Cash: ${fmt(data.cashAfter)}`
          : `✓ Venta: ${cryptoShares.toFixed(6)} ${selected.symbol.toUpperCase()} · Cash: ${fmt(data.cashAfter)}`
        setToast({ ok: true, msg })
        window.dispatchEvent(new Event('portfolio-updated'))
        setAmount(''); setSelected(null); setSide('buy')
        const pr = await fetch('/api/portfolio')
        if (pr.ok) setPortfolio(await pr.json())
      } else {
        setToast({ ok: false, msg: data.error ?? 'Error desconocido' })
      }
    } catch {
      setToast({ ok: false, msg: 'Error de red.' })
    }
    setExecuting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm modal-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="modal-content" style={{
        width: '100%', maxWidth: '680px', maxHeight: '90vh',
        overflowY: 'auto', borderRadius: '24px',
        background: '#ffffff', boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        margin: '0 16px', fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>Crypto</h2>
              <p style={{ fontSize: '13px', color: '#888', margin: '2px 0 0' }}>Top 25 criptomonedas · Precios en tiempo real vía CoinGecko</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {portfolio && (
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>Cash disponible</p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', margin: 0 }}>{fmt(portfolio.cash_balance)}</p>
                </div>
              )}
              <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} color="#666" />
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '20px 28px' }}>
          {toast && (
            <div style={{
              marginBottom: '16px', padding: '12px 16px', borderRadius: '12px',
              background: toast.ok ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${toast.ok ? '#bbf7d0' : '#fecaca'}`,
              fontSize: '13px', color: toast.ok ? '#16a34a' : '#dc2626',
            }}>
              {toast.msg}
            </div>
          )}

          {selected && (
            <div style={{ marginBottom: '20px', padding: '20px', borderRadius: '16px', border: `2px solid ${side === 'buy' ? '#f97316' : '#ef4444'}`, background: side === 'buy' ? '#fff8f5' : '#fff5f5' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={selected.image} alt={selected.name} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 800, color: '#0a0a0a', margin: 0 }}>{selected.name}</p>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>{fmt(selected.current_price)} / {selected.symbol.toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={() => { setSelected(null); setAmount(''); setToast(null); setSide('buy') }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e0e0e0', marginBottom: '16px' }}>
                <button onClick={() => { setSide('buy'); setAmount(''); setToast(null) }} style={{
                  flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 700,
                  background: side === 'buy' ? '#0a0a0a' : '#fff',
                  color: side === 'buy' ? '#fff' : '#888',
                  transition: 'all 0.15s',
                }}>Comprar</button>
                <button onClick={() => { setSide('sell'); setAmount(''); setToast(null) }} style={{
                  flex: 1, padding: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 700,
                  background: side === 'sell' ? '#ef4444' : '#fff',
                  color: side === 'sell' ? '#fff' : '#888',
                  transition: 'all 0.15s',
                }}>Vender</button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '6px' }}>
                  {side === 'buy' ? 'Importe en euros' : `Cantidad de ${selected.symbol.toUpperCase()} a vender`}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontWeight: 700, fontSize: '13px' }}>
                    {side === 'buy' ? '€' : selected.symbol.toUpperCase().slice(0, 4)}
                  </span>
                  <input
                    type="number" value={amount} min={0} placeholder="0.00"
                    onChange={e => { setAmount(e.target.value); setToast(null) }}
                    style={{
                      width: '100%', height: '44px', borderRadius: '12px',
                      border: '1px solid #e0e0e0', background: '#fff',
                      paddingLeft: side === 'buy' ? '28px' : '52px',
                      paddingRight: '12px',
                      fontSize: '15px', fontWeight: 700, color: '#0a0a0a',
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {parseFloat(amount) > 0 && (
                <div style={{ background: '#fff', borderRadius: '10px', padding: '12px 14px', marginBottom: '12px', border: '1px solid #f0f0f0' }}>
                  {side === 'buy' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>Recibirás</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0a0a0a' }}>{cryptoShares.toFixed(6)} {selected.symbol.toUpperCase()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>Precio unitario</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0a0a0a' }}>{fmt(selected.current_price)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>Recibirás</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a' }}>{fmt(eurValue)}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: '#888' }}>Precio unitario</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0a0a0a' }}>{fmt(selected.current_price)}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              <button onClick={executeCrypto} disabled={executing || !amount || parseFloat(amount) <= 0} style={{
                width: '100%', height: '44px', borderRadius: '12px',
                background: executing || !amount || parseFloat(amount) <= 0
                  ? '#e0e0e0'
                  : side === 'buy' ? '#f97316' : '#ef4444',
                color: '#fff', border: 'none',
                cursor: executing || !amount || parseFloat(amount) <= 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px', fontWeight: 700, transition: 'all 0.15s',
              }}>
                {executing
                  ? 'Ejecutando...'
                  : side === 'buy'
                    ? `Comprar ${selected.symbol.toUpperCase()}`
                    : `Vender ${selected.symbol.toUpperCase()}`}
              </button>
            </div>
          )}

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ height: '64px', borderRadius: '12px', background: '#f5f5f5' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {coins.map(coin => {
                const isPos      = coin.price_change_percentage_24h >= 0
                const isSelected = selected?.id === coin.id
                return (
                  <button key={coin.id} onClick={() => { setSelected(isSelected ? null : coin); setAmount(''); setToast(null); setSide('buy') }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '12px 16px', borderRadius: '14px',
                      border: isSelected ? '2px solid #f97316' : '1px solid #f0f0f0',
                      background: isSelected ? '#fff8f5' : '#fff',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                      width: '100%',
                    }}>
                    <span style={{ fontSize: '11px', color: '#ccc', fontWeight: 700, width: '20px', flexShrink: 0 }}>
                      #{coin.market_cap_rank}
                    </span>
                    <img src={coin.image} alt={coin.name} style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', margin: 0, lineHeight: 1.2 }}>{coin.name}</p>
                      <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>{coin.symbol.toUpperCase()}</p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', margin: 0 }}>{fmt(coin.current_price)}</p>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: isPos ? '#16a34a' : '#ef4444', margin: 0 }}>
                        {isPos ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface SearchResult { ticker: string; name: string; exchange: string }

function DegenTradeOrder({ leverage, onBack, onClose }: { leverage: 2 | 3; onBack: () => void; onClose: () => void }) {
  const [ticker, setTicker]               = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching]         = useState(false)
  const [quotePrice, setQuotePrice]       = useState<number | null>(null)
  const [quoteLoading, setQuoteLoading]   = useState(false)
  const [mode, setMode]                   = useState<'shares' | 'amount'>('shares')
  const [shares, setShares]               = useState(1)
  const [amount, setAmount]               = useState('')
  const [confirmed, setConfirmed]         = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const price = quotePrice ?? 0

  useEffect(() => {
    if (ticker.length < 1) { setSearchResults([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(ticker)}`)
        setSearchResults(await res.json())
      } catch { setSearchResults([]) }
      setSearching(false)
    }, 350)
  }, [ticker])

  async function selectTicker(r: SearchResult) {
    setTicker(r.ticker); setSearchResults([]); setQuoteLoading(true)
    try {
      const res = await fetch(`/api/quote?ticker=${r.ticker}`)
      if (res.ok) { const d = await res.json(); setQuotePrice(d.price) }
    } catch { setQuotePrice(null) }
    setQuoteLoading(false)
  }

  const totalByShares  = price > 0 ? shares * price : 0
  const sharesByAmount = price > 0 && parseFloat(amount) > 0 ? parseFloat(amount) / price : 0
  const exposureShares = totalByShares * leverage
  const exposureAmount = parseFloat(amount) > 0 ? parseFloat(amount) * leverage : 0

  if (confirmed) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-100"><Flame className="size-8 text-red-500" /></div>
        <h3 className="text-lg font-bold text-foreground">¡Degen Trade activado!</h3>
        <p className="text-sm text-muted-foreground">Tu trade {leverage}x en <strong>{ticker}</strong> ha sido registrado.<br />Exposición real: <strong>${(mode === 'shares' ? exposureShares : exposureAmount).toFixed(2)}</strong></p>
        <button onClick={onClose} className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">Cerrar</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground text-sm transition-colors">← Volver</button>
        <div className="flex-1">
          <p className="text-base font-bold text-red-600">Degen Trade {leverage}x</p>
          <p className="text-xs text-muted-foreground">Coste: {leverage === 2 ? '4€' : '6,50€'} · Selecciona acción y cantidad</p>
        </div>
      </div>
      <div className="relative">
        <div className="flex items-center gap-2 bg-background rounded-xl border border-border px-3 py-2.5">
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input value={ticker} onChange={e => { setTicker(e.target.value.toUpperCase()); setQuotePrice(null) }}
            placeholder="Buscar acción... AAPL, TSLA, NVDA"
            className="bg-transparent text-sm font-mono font-bold text-foreground placeholder:text-muted-foreground outline-none flex-1" />
          {quoteLoading && <span className="text-xs text-muted-foreground animate-pulse">Cargando...</span>}
          {quotePrice && !quoteLoading && <span className="text-sm font-bold text-foreground shrink-0">${quotePrice.toFixed(2)}</span>}
        </div>
        {(searchResults.length > 0 || searching) && (
          <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg overflow-hidden dropdown-anim">
            {searching && <p className="px-4 py-3 text-xs text-muted-foreground animate-pulse">Buscando...</p>}
            {searchResults.slice(0, 5).map(r => (
              <button key={r.ticker} onMouseDown={() => selectTicker(r)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-accent transition-colors border-b border-border last:border-0">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-[10px] font-bold text-red-600">{r.ticker.slice(0, 2)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">{r.ticker}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{r.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex rounded-xl border border-border overflow-hidden">
        <button onClick={() => setMode('shares')} className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'shares' ? 'bg-red-500 text-white' : 'text-muted-foreground hover:bg-accent'}`}>Por acciones</button>
        <button onClick={() => setMode('amount')} className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === 'amount' ? 'bg-red-500 text-white' : 'text-muted-foreground hover:bg-accent'}`}>Por importe</button>
      </div>
      {mode === 'shares' && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Número de acciones</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setShares(s => Math.max(1, s - 1))} className="flex size-9 items-center justify-center rounded-xl border border-border hover:bg-accent transition-colors"><Minus className="size-4" /></button>
            <input type="number" value={shares} min={1} onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))} className="flex-1 h-9 rounded-xl border border-border bg-background px-3 text-center text-sm font-bold text-foreground outline-none" />
            <button onClick={() => setShares(s => s + 1)} className="flex size-9 items-center justify-center rounded-xl border border-border hover:bg-accent transition-colors"><Plus className="size-4" /></button>
          </div>
          {price > 0 && (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex flex-col gap-1">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Tu inversión ({shares} acc.)</span><span className="font-semibold text-foreground">${totalByShares.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs"><span className="text-red-600 font-semibold">Exposición real {leverage}x</span><span className="font-black text-red-600">${exposureShares.toFixed(2)}</span></div>
            </div>
          )}
        </div>
      )}
      {mode === 'amount' && (
        <div>
          <p className="text-xs text-muted-foreground mb-2">Importe en euros</p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">€</span>
            <input type="number" value={amount} min={0} placeholder="0.00" onChange={e => setAmount(e.target.value)} className="w-full h-10 rounded-xl border border-border bg-background pl-7 pr-3 text-sm font-bold text-foreground outline-none" />
          </div>
          {parseFloat(amount) > 0 && price > 0 && (
            <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex flex-col gap-1">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Acciones aproximadas</span><span className="font-semibold text-foreground">{sharesByAmount.toFixed(4)} acc.</span></div>
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Precio por acción</span><span className="font-semibold text-foreground">${price.toFixed(2)}</span></div>
              <div className="flex justify-between text-xs border-t border-red-200 pt-1 mt-1"><span className="text-red-600 font-semibold">Exposición real {leverage}x</span><span className="font-black text-red-600">${exposureAmount.toFixed(2)}</span></div>
            </div>
          )}
        </div>
      )}
      <button onClick={() => { if (ticker && (mode === 'shares' ? price > 0 : parseFloat(amount) > 0)) setConfirmed(true) }}
        disabled={!ticker || !price || (mode === 'amount' && parseFloat(amount) <= 0)}
        className="w-full rounded-xl bg-red-500 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity disabled:opacity-40">
        Confirmar Degen Trade {leverage}x · {leverage === 2 ? '4€' : '6,50€'}
      </button>
    </div>
  )
}

function DegenTradePanel({ onClose }: { onClose: () => void }) {
  const [selectedLeverage, setSelectedLeverage] = useState<2 | 3 | null>(null)
  useEscapeKey(onClose)
  const features = ['¿Has escuchado sobre los degen trades?', 'Si tienes convicción con un movimiento, ves a por todas', 'Apalanca un trade y multiplica tus resultados']
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm modal-backdrop" onClick={onClose}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl mx-4 modal-content" onClick={e => e.stopPropagation()}>
        {selectedLeverage ? (
          <DegenTradeOrder leverage={selectedLeverage} onBack={() => setSelectedLeverage(null)} onClose={onClose} />
        ) : (
          <>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-red-500"><Flame className="size-5 text-white" /></div>
                <div><h2 className="text-lg font-bold text-foreground">Degen Trade</h2><p className="text-xs text-muted-foreground">Apalancamiento para traders con convicción</p></div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X className="size-5" /></button>
            </div>
            <ul className="flex flex-col gap-3 mb-6">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 rounded-xl bg-background border border-border px-4 py-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-red-500 mt-0.5"><Flame className="size-3 text-white" /></div>
                  <p className="text-sm text-foreground">{f}</p>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div><p className="text-base font-black text-red-600">Apalanca 2x</p><p className="text-xs text-red-400">Duplica tu exposición</p></div>
                  <div className="text-right"><p className="text-xl font-black text-red-600">4€</p><p className="text-xs text-red-400">/trade</p></div>
                </div>
                <button onClick={() => setSelectedLeverage(2)} className="w-full rounded-xl bg-red-500 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">Añadir · 4€</button>
              </div>
              <div className="rounded-2xl border-2 border-red-400 bg-red-100 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div><p className="text-base font-black text-red-700">Apalanca 3x</p><p className="text-xs text-red-500">Triplica tu exposición</p></div>
                  <div className="text-right"><p className="text-xl font-black text-red-700">6,50€</p><p className="text-xs text-red-500">/trade</p></div>
                </div>
                <button onClick={() => setSelectedLeverage(3)} className="w-full rounded-xl bg-red-700 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">Añadir · 6,50€</button>
              </div>
            </div>
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-bold text-red-700 mb-3">⚠️ ¿Qué implica el Apalancamiento 2x?</p>
              <p className="text-xs text-red-600 mb-3 leading-relaxed">Al activar este boost, tanto tus ganancias como tus pérdidas se multiplicarán por dos.</p>
              <ul className="flex flex-col gap-2">
                <li className="flex items-start gap-2 text-xs text-red-600"><span>🚀</span><span><strong>Si Amazon sube un 10%:</strong> Tú ganas un 20%.</span></li>
                <li className="flex items-start gap-2 text-xs text-red-600"><span>📉</span><span><strong>Si Amazon baja un 10%:</strong> Tú pierdes un 20%.</span></li>
                <li className="flex items-start gap-2 text-xs text-red-600"><span>💥</span><span><strong>Si Amazon baja un 50%:</strong> Tu posición se liquida automáticamente.</span></li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

interface PortfolioPosition {
  ticker: string
  company_name: string
  shares: number
  avg_buy_price: number
  current_price: number
  current_value: number
  pnl: number
  pnl_pct: number
}

interface PortfolioTransaction {
  id: string
  ticker: string
  type: string
  shares: number
  price_per_share: number
  total_amount: number
  executed_at: string
}

interface PortfolioData {
  cash_balance: number
  total_value: number
  invested_value: number
  roi_pct: number
  positions: PortfolioPosition[]
  transactions: PortfolioTransaction[]
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null
  const w = 120; const h = 40
  const min = Math.min(...values); const max = Math.max(...values)
  const range = max - min || 1
  const step = w / (values.length - 1)
  const pts = values.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 6) - 3}`)
  const d = `M ${pts.join(' L ')}`
  const area = `${d} L ${w} ${h} L 0 ${h} Z`
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace('#','')})`} />
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PortfolioChart({ totalValue }: { totalValue: number }) {
  const base = 10000
  const simPoints = [base, 9980, 10020, 9950, 10080, 10150, 10060, 10200, 10180, totalValue]
  const w = 500; const h = 100
  const min = Math.min(...simPoints) - 50
  const max = Math.max(...simPoints) + 50
  const range = max - min
  const step = w / (simPoints.length - 1)
  const pts = simPoints.map((v, i) => `${i * step},${h - ((v - min) / range) * (h - 10) - 5}`)
  const d = `M ${pts.join(' L ')}`
  const area = `${d} L ${w} ${h} L 0 ${h} Z`
  const isPos = totalValue >= base
  const color = isPos ? '#16a34a' : '#ef4444'
  return (
    <div>
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ height: '80px' }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#chartFill)" />
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        {['Jun 1', 'Jun 8', 'Jun 15', 'Jun 22', 'Hoy'].map(l => (
          <span key={l} style={{ fontSize: '10px', color: '#aaa' }}>{l}</span>
        ))}
      </div>
    </div>
  )
}

function PortfolioPanel({ onClose }: { onClose: () => void }) {
  const [data, setData]       = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState<'overview' | 'holdings' | 'history'>('overview')
  useEscapeKey(onClose)

  useEffect(() => {
    fetch('/api/portfolio')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const fmt   = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 })
  const total = data?.total_value ?? 10000
  const isPos = (data?.roi_pct ?? 0) >= 0

  const sparkData: Record<string, number[]> = {
    PLTR: [105, 108, 112, 109, 113, 112, 113],
    AVGO: [358, 362, 360, 365, 363, 366, 365],
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm modal-backdrop" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="modal-content" style={{
        width: '100%', maxWidth: '680px', maxHeight: '90vh',
        overflowY: 'auto', borderRadius: '24px',
        background: '#ffffff', boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        margin: '0 16px', fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ padding: '24px 28px 0', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.02em', margin: 0 }}>Mi Portfolio</h2>
              <p style={{ fontSize: '13px', color: '#888', margin: '2px 0 0' }}>Resumen de tu cartera · Liga 2026</p>
            </div>
            <button onClick={onClose} style={{ background: '#f5f5f5', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color="#666" />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {(['overview', 'holdings', 'history'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: tab === t ? 700 : 500,
                background: tab === t ? '#0a0a0a' : 'transparent',
                color: tab === t ? '#fff' : '#888',
                transition: 'all 0.15s',
              }}>
                {t === 'overview' ? 'Resumen' : t === 'holdings' ? 'Posiciones' : 'Historial'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '24px 28px' }}>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[1,2,3].map(i => <div key={i} style={{ height: '64px', borderRadius: '12px', background: '#f5f5f5' }} />)}
            </div>
          )}

          {!loading && data && tab === 'overview' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Valor total</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.03em', lineHeight: 1 }}>{fmt(total)}</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: isPos ? '#16a34a' : '#ef4444', background: isPos ? '#f0fdf4' : '#fef2f2', padding: '2px 8px', borderRadius: '100px' }}>
                    {isPos ? '+' : ''}{data.roi_pct.toFixed(2)}%
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '16px' }}>desde el inicio de temporada</p>
                <PortfolioChart totalValue={total} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {[
                  { label: 'Invertido', value: fmt(data.invested_value), color: '#0a0a0a' },
                  { label: 'Cash libre', value: fmt(data.cash_balance), color: '#16a34a' },
                  { label: 'Posiciones', value: `${data.positions.length}`, color: '#0a0a0a' },
                ].map(k => (
                  <div key={k.label} style={{ background: '#fafafa', borderRadius: '14px', padding: '14px 16px', border: '1px solid #f0f0f0' }}>
                    <p style={{ fontSize: '11px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 4px' }}>{k.label}</p>
                    <p style={{ fontSize: '16px', fontWeight: 800, color: k.color, margin: 0, letterSpacing: '-0.01em' }}>{k.value}</p>
                  </div>
                ))}
              </div>

              {data.positions.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#0a0a0a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>Asset Allocation</p>
                  <div style={{ display: 'flex', height: '8px', borderRadius: '100px', overflow: 'hidden', marginBottom: '10px', gap: '2px' }}>
                    {data.positions.map((pos, i) => {
                      const pct = total > 0 ? (pos.current_value / total) * 100 : 0
                      const colors = ['#0a0a0a', '#ff6b35', '#16a34a', '#3b82f6', '#8b5cf6']
                      return <div key={pos.ticker} style={{ width: `${pct}%`, background: colors[i % colors.length], borderRadius: '100px' }} />
                    })}
                    <div style={{ flex: 1, background: '#e5e7eb', borderRadius: '100px' }} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {data.positions.map((pos, i) => {
                      const pct = total > 0 ? (pos.current_value / total) * 100 : 0
                      const colors = ['#0a0a0a', '#ff6b35', '#16a34a', '#3b82f6', '#8b5cf6']
                      return (
                        <div key={pos.ticker} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors[i % colors.length] }} />
                          <span style={{ fontSize: '12px', color: '#555' }}>{pos.ticker} {pct.toFixed(1)}%</span>
                        </div>
                      )
                    })}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e5e7eb' }} />
                      <span style={{ fontSize: '12px', color: '#555' }}>Cash {total > 0 ? ((data.cash_balance / total) * 100).toFixed(1) : 0}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', borderRadius: '16px', padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>AI Insight</span>
                  <span style={{ fontSize: '12px', color: '#888' }}>· powered by Gemini</span>
                </div>
                <p style={{ fontSize: '13px', color: '#e5e7eb', lineHeight: 1.65, margin: 0 }}>
                  Tu cartera muestra una <strong style={{ color: '#ff6b35' }}>concentración elevada en tech</strong> con PLTR y AVGO representando el 17% del total. Con un 82% en cash, tienes amplio margen para diversificar. <strong style={{ color: '#fff' }}>PLTR</strong> mantiene momentum positivo ligado a contratos de defensa e IA gubernamental. Considera añadir exposición a sectores defensivos para reducir volatilidad antes del cierre de liga.
                </p>
              </div>
            </>
          )}

          {!loading && data && tab === 'holdings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.positions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#aaa', fontSize: '14px' }}>
                  Sin posiciones. Compra tu primera acción desde el Trade Panel.
                </div>
              ) : (
                data.positions.map(pos => {
                  const weight = total > 0 ? (pos.current_value / total) * 100 : 0
                  const spark = sparkData[pos.ticker] ?? [pos.avg_buy_price, pos.current_price]
                  const isGain = pos.pnl_pct >= 0
                  return (
                    <div key={pos.ticker} style={{ border: '1px solid #f0f0f0', borderRadius: '16px', padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <PositionLogo ticker={pos.ticker} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 2px' }}>{pos.ticker}</p>
                            <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>{pos.shares.toFixed(4)} acc · {pos.current_price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0a0a0a', margin: '0 0 2px' }}>{fmt(pos.current_value)}</p>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: isGain ? '#16a34a' : '#ef4444', margin: 0 }}>{isGain ? '+' : ''}{pos.pnl_pct.toFixed(2)}%</p>
                          </div>
                        </div>
                        <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ flex: 1, height: '4px', borderRadius: '100px', background: '#f0f0f0', overflow: 'hidden', marginRight: '12px' }}>
                            <div style={{ height: '4px', borderRadius: '100px', background: '#0a0a0a', width: `${weight}%` }} />
                          </div>
                          <Sparkline values={spark} color={isGain ? '#16a34a' : '#ef4444'} />
                        </div>
                        <p style={{ fontSize: '10px', color: '#aaa', margin: '4px 0 0' }}>{weight.toFixed(1)}% de cartera · P&L: {fmt(pos.pnl)}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {!loading && data && tab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.transactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#aaa', fontSize: '14px' }}>Sin operaciones todavía.</div>
              ) : (
                data.transactions.slice(0, 10).map(tx => (
                  <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f0f0f0', borderRadius: '14px', padding: '14px 16px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0, background: tx.type === 'buy' ? '#0a0a0a' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff' }}>
                      {tx.type === 'buy' ? 'C' : 'V'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a', margin: 0 }}>{tx.ticker}</p>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: tx.type === 'buy' ? '#ef4444' : '#16a34a', margin: 0 }}>
                          {tx.type === 'buy' ? '-' : '+'}{fmt(Number(tx.total_amount))}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                        <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>{Number(tx.shares).toFixed(4)} acc · {Number(tx.price_per_share).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}/acc</p>
                        <p style={{ fontSize: '11px', color: '#aaa', margin: 0 }}>
                          {new Date(tx.executed_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [active, setActive]               = useState('Dashboard')
  const [showLeagues, setShowLeagues]     = useState(false)
  const [showMarkets, setShowMarkets]     = useState(false)
  const [showCrypto, setShowCrypto]       = useState(false)
  const [showDegen, setShowDegen]         = useState(false)
  const [showPortfolio, setShowPortfolio] = useState(false)

  function handleNav(label: string) {
    setActive(label)
    if (label === 'Leagues')     setShowLeagues(true)
    if (label === 'Markets')     setShowMarkets(true)
    if (label === 'Crypto')      setShowCrypto(true)
    if (label === 'Degen Trade') setShowDegen(true)
    if (label === 'Portfolio')   setShowPortfolio(true)
  }

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-8 border-r border-border bg-sidebar px-5 py-6">
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <CandlestickChart className="size-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">Bull League</p>
            <p className="text-xs text-muted-foreground">Fantasy Trading</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Menu</p>
          {nav.map((item) => {
            const Icon     = item.icon
            const isActive = active === item.label
            const isCrypto = item.label === 'Crypto'
            const isDegen  = item.label === 'Degen Trade'
            return (
              <button key={item.label} onClick={() => handleNav(item.label)}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive && isDegen ? 'bg-red-500 text-white shadow-sm'
                    : isActive && isCrypto ? 'bg-orange-500 text-white shadow-sm'
                    : isActive ? 'bg-primary text-primary-foreground shadow-sm'
                    : isDegen ? 'text-red-500 hover:bg-red-50'
                    : isCrypto ? 'text-orange-500 hover:bg-orange-50'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )}>
                <Icon className="size-[18px]" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="flex flex-col gap-1">
          {bottomNav.map((item) => {
            const Icon = item.icon
            return (
              <button key={item.label} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                <Icon className="size-[18px]" />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="rounded-2xl bg-secondary p-4">
          <p className="text-sm font-semibold text-secondary-foreground">Go Pro</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Unlock real-time data and unlimited leagues.</p>
          <button className="mt-3 w-full rounded-lg bg-highlight px-3 py-2 text-xs font-semibold text-highlight-foreground transition-opacity hover:opacity-90">Upgrade</button>
        </div>
      </aside>

      {showLeagues   && <LeaguesPanel    onClose={() => setShowLeagues(false)} />}
      {showMarkets   && <MarketsPanel    onClose={() => setShowMarkets(false)} />}
      {showCrypto    && <CryptoPanel     onClose={() => setShowCrypto(false)} />}
      {showDegen     && <DegenTradePanel onClose={() => setShowDegen(false)} />}
      {showPortfolio && <PortfolioPanel  onClose={() => setShowPortfolio(false)} />}
    </>
  )
}
