import { useEffect, useState } from 'react'
import { APP_NAME, TAGLINE } from '../../lib/constants'

const SPLASH_VISIBLE_MS = 2200
const SPLASH_EXIT_MS = 650

export const SplashScreen = () => {
  const [phase, setPhase] = useState<'visible' | 'leaving' | 'hidden'>(
    'visible',
  )

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => {
      setPhase('leaving')
    }, SPLASH_VISIBLE_MS)

    const hideTimer = window.setTimeout(() => {
      setPhase('hidden')
    }, SPLASH_VISIBLE_MS + SPLASH_EXIT_MS)

    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(hideTimer)
    }
  }, [])

  if (phase === 'hidden') {
    return null
  }

  return (
    <div
      className={`splash-screen ${phase === 'leaving' ? 'splash-screen--leaving' : ''}`}
      role="status"
      aria-live="polite"
      aria-label={`${APP_NAME} is loading`}
    >
      <div className="splash-field" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="splash-panel">
        <div className="splash-logo-stage">
          <div className="splash-logo-trace" aria-hidden="true" />
          <img
            src="/favicon.png"
            alt=""
            className="splash-logo"
            decoding="async"
          />
        </div>

        <div className="splash-copy">
          <p>Kasem language platform</p>
          <h1>{APP_NAME}</h1>
          <span>{TAGLINE}</span>
        </div>

        <div className="splash-signal" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="splash-progress" aria-hidden="true">
          <span />
        </div>
      </div>

      <span className="sr-only">Loading {APP_NAME}</span>
    </div>
  )
}
