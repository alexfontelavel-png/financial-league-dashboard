'use client'
import { X, TrendingUp, TrendingDown, Send } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Mover {
  ticker: string
  price:  number
  change: number
}

interface MoversData {
  gainers: Mover[]
  losers:  Mover[]
}

export function MarketsPanel({ onClose }: { onClose: () => void }) {
  const [data, setData]       = useState<MoversData | null>(null)
  const [loading, setLoading] = useState(true)
  const [question, setQuestion] = useState('')
  const [answer, setAnswer]   = useState('')
  const [asking, setAsking]   = useState(false)

  useEffect(() => {
    fetch('/api/movers')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleAsk() {
    if (!question.trim()) return
    setAsking(true)
    setAnswer('')
    // Por ahora respuesta simulada — después conectamos a IA real
    await new Promise(r => setTimeout(r, 1000))
    setAnswer(`Análisis de "${question}": Esta funcionalidad se conectará próximamente a un modelo de IA financiera para darte insights y recomendaciones personalizadas basadas en datos reales del mercado.`)
    setAsking(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl mx-4"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Markets</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Mejores y peores del día · Cierre anterior</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {!loading && data && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Gainers */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="size-4 text-green-500" />
                <h3 className="text-sm font-semibold text-foreground">Daily Gainers</h3>
              </div>
              <div className="flex flex-col gap-2">
                {data.gainers.map(m => (
                  <div key={m.ticker}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 hover:bg-accent transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground">{m.ticker}</p>
                      <p className="text-xs text-muted-foreground">${m.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-green-500">
                        +{m.change.toFixed(2)}%
                      </span>
                      <div className="flex size-5 items-center justify-center rounded-full bg-green-500">
                        <TrendingUp className="size-3 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Losers */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="size-4 text-red-500" />
                <h3 className="text-sm font-semibold text-foreground">Daily Losers</h3>
              </div>
              <div className="flex flex-col gap-2">
                {data.losers.map(m => (
                  <div key={m.ticker}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-2.5 hover:bg-accent transition-colors">
                    <div>
                      <p className="text-sm font-bold text-foreground">{m.ticker}</p>
                      <p className="text-xs text-muted-foreground">${m.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-red-500">
                        {m.change.toFixed(2)}%
                      </span>
                      <div className="flex size-5 items-center justify-center rounded-full bg-red-500">
                        <TrendingDown className="size-3 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI Box */}
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-sm font-semibold text-foreground mb-3">
            Ask Financial Agent to get insights &amp; potential recommendations
          </p>
          <div className="flex gap-2">
            <input
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAsk()}
              placeholder="e.g. ¿Por qué está bajando TSLA? ¿Es buen momento para comprar NVDA?"
              className="flex-1 h-10 rounded-xl border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/40"
            />
            <button
              onClick={handleAsk}
              disabled={asking || !question.trim()}
              className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40">
              <Send className="size-4" />
            </button>
          </div>
          {asking && (
            <p className="text-xs text-muted-foreground mt-3 animate-pulse">Analizando...</p>
          )}
          {answer && !asking && (
            <div className="mt-3 rounded-xl bg-muted p-3">
              <p className="text-sm text-foreground leading-relaxed">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
