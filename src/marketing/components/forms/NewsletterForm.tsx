import { useId, useState } from 'react'
import { subscribeToUpdates } from '../../lib/forms'

type Status = 'idle' | 'loading' | 'success' | 'error'

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

export const NewsletterForm = ({
  tone = 'light',
  compact = false,
}: {
  tone?: 'light' | 'dark'
  compact?: boolean
}) => {
  const id = useId()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    setMessage('')
    const result = await subscribeToUpdates(email.trim())
    if (result.ok) {
      setStatus('success')
      setMessage('Thank you — you are on the list. Watch your inbox for updates.')
      setEmail('')
    } else {
      setStatus('error')
      setMessage(result.error ?? 'Something went wrong. Please try again.')
    }
  }

  const dark = tone === 'dark'
  const labelColor = dark ? 'text-cream-200/80' : 'text-charcoal-muted'

  if (status === 'success') {
    return (
      <p
        role="status"
        className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
          dark ? 'bg-white/10 text-cream-100' : 'bg-savannah-50 text-savannah-700'
        }`}
      >
        <span aria-hidden="true">✓</span> {message}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <label htmlFor={id} className={`mb-2 block text-sm font-medium ${labelColor}`}>
        Get project updates
      </label>
      <div className={`flex gap-2 ${compact ? '' : 'flex-col sm:flex-row'}`}>
        <input
          id={id}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          aria-invalid={status === 'error'}
          aria-describedby={`${id}-msg`}
          className={`min-h-[48px] w-full rounded-xl border px-4 text-base outline-none transition-colors ${
            dark
              ? 'border-white/20 bg-white/10 text-cream-100 placeholder:text-cream-200/50 focus:border-kente-400'
              : 'border-indigo-200 bg-white text-charcoal placeholder:text-sand-500 focus:border-indigo-400'
          }`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="pk-focus inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-xl bg-kente-500 px-5 font-semibold text-charcoal transition-colors hover:bg-kente-400 disabled:opacity-60"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      <p
        id={`${id}-msg`}
        role={status === 'error' ? 'alert' : undefined}
        className={`mt-2 min-h-[1.25rem] text-sm ${
          status === 'error'
            ? dark
              ? 'text-terracotta-200'
              : 'text-terracotta-600'
            : labelColor
        }`}
      >
        {status === 'error' ? message : 'No spam. Unsubscribe anytime.'}
      </p>
    </form>
  )
}
