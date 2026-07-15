// error-monitoring skill: a boundary reports with context and renders a
// design-system fallback with a recovery path — never a blank screen.
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert, Button } from 'antd';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // monitoring wrapper would go here; console in this local app.
    console.error('App error:', error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Alert
          type="error"
          showIcon
          data-testid="app-error-boundary"
          message="Something went wrong"
          description="Try reloading the page."
          action={
            <Button size="small" onClick={() => this.setState({ hasError: false })}>
              Retry
            </Button>
          }
        />
      );
    }
    return this.props.children;
  }
}
