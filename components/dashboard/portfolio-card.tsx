'use client'
import { ArrowUpRight, ArrowDownRight, Wallet, Coins } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import { formatEuro } from '@/lib/format'

interface PortfolioData {
  cash_balance:   number
  total_value:    number
  invested_value: number
  roi_pct:        number
  positions: Array<{
    ticker:        string
    company_name:  string
    shares:        number
    avg_buy_price: number
    current_price: number
    current_value: number
    pnl:           number
    pnl_pct:       number
  }>
}

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
  const domain  = TICKER_DOMAINS[ticker.toUpperCase()]
  const logoUrl = domain ? `https://img.logo.dev/${domain}?token=pk_SiUlVGlKT0CPy1GCByFRSA` : null

  if (!imgError && logoUrl) {
    return (
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-white border border-border">
        <img
          src={logoUrl} alt={ticker}
          className="size-7 object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
      {ticker.slice(0, 2)}
    </div>
  )
}

function AreaSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (data.length < 2) return null
  const width  = 520
  const height = 80
  const min    = Math.min(...data)
  const max    = Math.max(...data)
  const range  = max - min || 1
  const stepX  = width / (data.length - 1)
  const points = data.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / range) * (height - 8) - 4
    return [x, y] as const
  })
  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`
  const color = positive ? '#16a34a' : '#ef4444'

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="h-20 w-full">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#sparkFill)" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PortfolioCard() {
  const [data, setData]       = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio')
      if (res.ok) setData(await res.json())
    } catch {} finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    window.addEventListener('portfolio-updated', fetchData)
    return () => window.removeEventListener('portfolio-updated', fetchData)
  }, [fetchData])

  const totalValue    = data?.total_value    ?? 10000
  const cashBalance   = data?.cash_balance   ?? 10000
  const investedValue = data?.invested_value ?? 0
  const roiPct        = data?.roi_pct        ?? 0
  const roiAbs        = totalValue - 10000
  const isPos         = roiPct >= 0

  const sparkData = data
    ? [10000, ...Array.from({ length: 10 }, (_, i) => 10000 + (roiAbs * (i + 1) / 11)), totalValue]
    : [10000, 10000]

  return (
    <section style={{
      background: '#ffffff',
      borderRadius: '20px',
      border: '1px solid #f0f0f0',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04)',
      padding: '28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
    }}>
      <p style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>
        Total Portfolio Value
      </p>

      {loading ? (
        <div style={{ height: '48px', width: '160px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '8px' }} />
      ) : (
        <p style={{ fontSize: '42px', fontWeight: 900, color: '#0a0a0a', lineHeight: 1, letterSpacing: '-0.02em', marginBottom: '10px' }}>
          {formatEuro(totalValue)}
        </p>
      )}

      {!loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '3px',
            background: isPos ? '#f0fdf4' : '#fef2f2',
            color: isPos ? '#16a34a' : '#ef4444',
            fontSize: '12px', fontWeight: 700,
            padding: '4px 10px', borderRadius: '100px',
          }}>
            {isPos ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {isPos ? '+' : ''}{roiPct.toFixed(2)}%
          </span>
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>
            {isPos ? '+' : ''}{formatEuro(roiAbs)} this season
          </span>
        </div>
      )}

      <div style={{ marginLeft: '-4px', marginRight: '-4px', marginBottom: '20px' }}>
        <AreaSparkline data={sparkData} positive={isPos} />
      </div>

      <div style={{ height: '1px', background: '#f5f5f5', marginBottom: '20px' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: investedValue > 0 ? '20px' : '0' }}>
        <div style={{ background: '#fafafa', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Coins size={13} color="#9ca3af" />
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Invested</span>
          </div>
          {loading
            ? <div style={{ height: '24px', width: '80px', background: '#ebebeb', borderRadius: '6px' }} />
            : <p style={{ fontSize: '18px', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.01em', margin: 0 }}>{formatEuro(investedValue)}</p>
          }
        </div>
        <div style={{ background: '#fafafa', borderRadius: '14px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Wallet size={13} color="#9ca3af" />
            <span style={{ fontSize: '11px', fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cash</span>
          </div>
          {loading
            ? <div style={{ height: '24px', width: '80px', background: '#ebebeb', borderRadius: '6px' }} />
            : <p style={{ fontSize: '18px', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.01em', margin: 0 }}>{formatEuro(cashBalance)}</p>
          }
        </div>
      </div>

      {!loading && data && data.positions.length > 0 && (
        <div>
          <div style={{ height: '1px', background: '#f5f5f5', marginBottom: '16px' }} />
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Posiciones abiertas
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {data.positions.map(pos => (
              <div key={pos.ticker} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PositionLogo ticker={pos.ticker} />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a', lineHeight: 1.2, margin: 0 }}>{pos.ticker}</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', lineHeight: 1.2, margin: 0 }}>{pos.shares.toFixed(2)} acc.</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0a0a0a', margin: 0 }}>{formatEuro(pos.current_value)}</p>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: pos.pnl_pct >= 0 ? '#16a34a' : '#ef4444', margin: 0 }}>
                    {pos.pnl_pct >= 0 ? '+' : ''}{pos.pnl_pct.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
