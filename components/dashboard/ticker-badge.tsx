'use client'
import { cn } from '@/lib/utils'
import { useState } from 'react'

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

export function TickerBadge({
  ticker,
  color,
  className,
}: {
  ticker: string
  color: string
  className?: string
}) {
  const [imgError, setImgError] = useState(false)
  const domain  = TICKER_DOMAINS[ticker.toUpperCase()]
  const logoUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : null

  if (!imgError && logoUrl) {
    return (
      <div
        className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-white border border-border', className)}
        aria-hidden="true"
      >
        <img
          src={logoUrl}
          alt={ticker}
          className="size-6 object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    )
  }

  return (
    <span
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white',
        className,
      )}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {ticker.slice(0, 2)}
    </span>
  )
}
