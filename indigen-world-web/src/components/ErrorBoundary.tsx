import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

/**
 * Minimal app-wide error boundary. Replace the fallback with a branded
 * error screen when the design system lands.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Indigen World web error boundary caught:', error, info)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-3 bg-cream p-6 text-center text-ink"
        >
          <h1 className="font-display text-2xl font-semibold">Something went wrong</h1>
          <p className="max-w-md text-sm text-ink/70">
            The page failed to render. Try reloading. If the problem persists,
            this is a starter shell and the route may not be implemented yet.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
