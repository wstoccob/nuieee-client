import { Component, type ErrorInfo, type ReactNode } from 'react'
import { StatusScreen } from './StatusScreen'

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
        <StatusScreen
          alert
          eyebrow="Something went wrong"
          title="We could not load this page"
          message="Please return to the homepage and try again."
        />
      )
    }

    return this.props.children
  }
}
