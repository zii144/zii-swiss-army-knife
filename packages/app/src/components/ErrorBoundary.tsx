import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

export interface ErrorBoundaryProps {
  /**
   * When this value changes, the boundary clears any captured error and
   * re-renders its children. The shell passes the selected tool id so that
   * navigating to a different tool recovers automatically.
   */
  resetKey?: unknown;
  title: string;
  body: string;
  retryLabel: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render/runtime errors thrown by a subtree — most importantly a lazy
 * tool chunk that fails to load or a tool that throws while rendering — so a
 * single broken tool degrades to a recoverable message instead of white-
 * screening the whole app. Error boundaries must be class components.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidUpdate(prev: ErrorBoundaryProps): void {
    // Clear the error when the caller signals a reset (e.g. tool changed).
    if (this.state.error !== null && prev.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // No third-party telemetry (privacy-first); surface to the console so the
    // failure is diagnosable in dev tools without leaving the device.
    console.error('Tool error boundary caught:', error, info.componentStack);
  }

  private readonly handleRetry = (): void => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    if (this.state.error !== null) {
      return (
        <div className="tool__boundary" role="alert">
          <h3 className="tool__boundary-title">{this.props.title}</h3>
          <p className="tool__boundary-body">{this.props.body}</p>
          <button type="button" className="tool__primary" onClick={this.handleRetry}>
            {this.props.retryLabel}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
