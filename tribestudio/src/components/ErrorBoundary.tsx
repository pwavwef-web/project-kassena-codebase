import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  message?: string
}

/** Minimal app-wide error boundary for the TribeStudio workspace. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('TribeStudio error boundary caught:', error, info)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface p-6 text-center text-ink"
        >
          <h1 className="font-display text-2xl font-semibold">Workspace error</h1>
          <p className="max-w-md text-sm text-ink/70">
            A panel failed to render. Reload to continue. This is a starter shell,
            so some areas are not implemented yet.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
