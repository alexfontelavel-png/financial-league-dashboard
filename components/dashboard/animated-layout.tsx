'use client'
import { useEffect, useRef } from 'react'

function Reveal({ children, className = '', direction = 'bottom', delay = 0 }: {
  children: React.ReactNode
  className?: string
  direction?: 'bottom' | 'left' | 'right'
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const dirClass = direction === 'left' ? 'from-left' : direction === 'right' ? 'from-right' : ''
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : ''

  return (
    <div ref={ref} className={`reveal ${dirClass} ${delayClass} ${className}`}>
      {children}
    </div>
  )
}

export function AnimatedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

AnimatedLayout.Reveal = Reveal
