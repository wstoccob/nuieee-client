import { Component, type ErrorInfo, type ReactNode } from 'react'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      '[ErrorBoundary] Uncaught render error',
      error,
      '\nComponent stack:',
      info.componentStack,
    )
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground">
          <section
            aria-labelledby="error-title"
            className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center text-card-foreground shadow-sm"
            role="alert"
          >
            <p className="text-sm font-semibold uppercase tracking-wide text-ieee-blue">
              Something went wrong
            </p>
            <h1 id="error-title" className="mt-3 text-2xl font-semibold">
              We could not load this page
            </h1>
            <p className="mt-3 text-muted-foreground">
              Please return to the homepage and try again.
            </p>
            <a
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-ieee-blue px-5 py-2 font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href="/"
            >
              Return to homepage
            </a>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
