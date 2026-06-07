import { useEffect, useRef, useState } from 'react'

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  suffix?: string
  color?: 'green' | 'orange' | 'gold' | 'blue'
}

const colorMap = {
  green: 'from-kassena-green/10 to-kassena-green/5 text-kassena-green',
  orange: 'from-kassena-orange/10 to-kassena-orange/5 text-kassena-orange',
  gold: 'from-kassena-gold/10 to-kassena-gold/5 text-kassena-gold',
  blue: 'from-blue-500/10 to-blue-500/5 text-blue-600',
}

const iconColorMap = {
  green: 'bg-kassena-green/10 text-kassena-green',
  orange: 'bg-kassena-orange/10 text-kassena-orange',
  gold: 'bg-kassena-gold/10 text-kassena-gold',
  blue: 'bg-blue-500/10 text-blue-600',
}

const useCountUp = (end: number, duration: number = 1000) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLParagraphElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) {
      setCount(end)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            const startTime = Date.now()
            const startValue = 0

            const animate = () => {
              const elapsed = Date.now() - startTime
              const progress = Math.min(elapsed / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              const current = Math.round(startValue + (end - startValue) * eased)
              setCount(current)

              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }

            requestAnimationFrame(animate)
          }
        })
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, duration])

  return { count, ref }
}

export const StatCard = ({
  label,
  value,
  icon,
  suffix = '',
  color = 'green',
}: StatCardProps) => {
  const { count, ref } = useCountUp(value)

  return (
    <article
      className={`group rounded-[18px] bg-gradient-to-br p-3 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md sm:rounded-2xl sm:p-5 ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold leading-tight text-slate-500 sm:text-sm">
            {label}
          </p>
          <p
            ref={ref}
            className="mt-1 text-2xl font-black leading-tight text-kassena-green transition-colors group-hover:text-kassena-orange sm:mt-2 sm:text-3xl"
          >
            {count.toLocaleString()}
            {suffix}
          </p>
        </div>
        <div
          className={`shrink-0 rounded-xl p-2 transition-transform group-hover:scale-110 sm:p-2.5 ${iconColorMap[color]}`}
        >
          {icon}
        </div>
      </div>
    </article>
  )
}
