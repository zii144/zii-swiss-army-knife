import { describe, it, expect } from 'vitest';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

// The app has no DOM-testing stack (tests are pure logic), so we exercise the
// error boundary's state machine directly rather than rendering it.
describe('ErrorBoundary', () => {
  it('derives error state from a thrown error', () => {
    const err = new Error('chunk load failed');
    expect(ErrorBoundary.getDerivedStateFromError(err)).toEqual({ error: err });
  });

  it('clears the captured error when resetKey changes', () => {
    const err = new Error('boom');
    // Minimal harness standing in for a mounted instance.
    let state = { error: err as Error | null };
    const instance = {
      state,
      props: { resetKey: 'tool-a' } as { resetKey: unknown },
      setState(next: { error: Error | null }) {
        state = { ...state, ...next };
        instance.state = state;
      },
    };
    const didUpdate = ErrorBoundary.prototype.componentDidUpdate as (
      this: typeof instance,
      prev: { resetKey: unknown },
    ) => void;

    // Same key → error preserved.
    didUpdate.call(instance, { resetKey: 'tool-a' });
    expect(instance.state.error).toBe(err);

    // Key changed (navigated to a different tool) → error cleared.
    didUpdate.call(instance, { resetKey: 'tool-b' });
    expect(instance.state.error).toBeNull();
  });
});
