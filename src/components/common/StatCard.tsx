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
      className={`group rounded-2xl bg-gradient-to-br p-5 shadow-sm ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md ${colorMap[color]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p
            ref={ref}
            className="mt-2 text-3xl font-bold text-kassena-green transition-colors group-hover:text-kassena-orange"
          >
            {count.toLocaleString()}
            {suffix}
          </p>
        </div>
        <div
          className={`rounded-xl p-2.5 transition-transform group-hover:scale-110 ${iconColorMap[color]}`}
        >
          {icon}
        </div>
      </div>
    </article>
  )
}
